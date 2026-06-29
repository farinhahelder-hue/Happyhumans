'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { bustCmsCache } from '@/hooks/useCmsContent';

export type InlineEditContextValue = {
  isEditing: boolean;
  isSaving: boolean;
  toggleEditing: () => void;
  pendingChanges: Record<string, Record<string, string>>;
  updateField: (page: string, key: string, value: string) => void;
  discardChanges: () => void;
  saveAll: () => Promise<void>;
  changeCount: number;
};

const InlineEditContext = createContext<InlineEditContextValue | null>(null);

function countChanges(changes: Record<string, Record<string, string>>): number {
  return Object.values(changes).reduce((acc, fields) => acc + Object.keys(fields).length, 0);
}

export function InlineEditProvider({ children }: { children: React.ReactNode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, Record<string, string>>>({});

  const discardChanges = useCallback(() => {
    setPendingChanges({});
  }, []);

  const toggleEditing = useCallback(() => {
    setIsEditing(prev => {
      if (prev) setPendingChanges({});
      return !prev;
    });
  }, []);

  const updateField = useCallback((page: string, key: string, value: string) => {
    setPendingChanges(prev => ({
      ...prev,
      [page]: { ...(prev[page] || {}), [key]: value },
    }));
  }, []);

  const saveAll = useCallback(async () => {
    const pages = Object.keys(pendingChanges);
    if (pages.length === 0) return;

    const allFields: { page: string; key: string; value: string }[] = [];
    for (const page of pages) {
      for (const [key, value] of Object.entries(pendingChanges[page])) {
        allFields.push({ page, key, value });
      }
    }

    setIsSaving(true);

    const results = await Promise.allSettled(
      allFields.map(field =>
        fetch('/api/cms/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ page: field.page, block_key: field.key, value: field.value }),
        }).then(async res => {
          if (!res.ok) {
            const d = await res.json().catch(() => ({}));
            throw new Error(`${field.key} (${field.page}): ${d.error || res.status}`);
          }
          bustCmsCache(field.page);
        })
      )
    );

    const errors: string[] = [];
    const succeeded = new Set<string>();
    results.forEach((r, i) => {
      if (r.status === 'fulfilled') {
        succeeded.add(`${allFields[i].page}:${allFields[i].key}`);
      } else {
        errors.push(r.reason?.message ?? 'Erreur inconnue');
      }
    });

    // Remove succeeded fields from pending, keep failures
    if (succeeded.size > 0) {
      setPendingChanges(prev => {
        const next: Record<string, Record<string, string>> = {};
        for (const [page, fields] of Object.entries(prev)) {
          const remaining = Object.fromEntries(
            Object.entries(fields).filter(([k]) => !succeeded.has(`${page}:${k}`))
          );
          if (Object.keys(remaining).length > 0) next[page] = remaining;
        }
        return next;
      });
    }

    setIsSaving(false);

    if (errors.length === 0) {
      window.dispatchEvent(new CustomEvent('inline-edit-saved', { detail: { count: succeeded.size } }));
    } else if (succeeded.size === 0) {
      window.dispatchEvent(new CustomEvent('inline-edit-error', { detail: { errors } }));
    } else {
      window.dispatchEvent(new CustomEvent('inline-edit-partial', { detail: { saved: succeeded.size, errors } }));
    }
  }, [pendingChanges]);

  return (
    <InlineEditContext.Provider value={{ isEditing, isSaving, toggleEditing, pendingChanges, updateField, discardChanges, saveAll, changeCount: countChanges(pendingChanges) }}>
      {children}
    </InlineEditContext.Provider>
  );
}

export function useInlineEdit(): InlineEditContextValue {
  const ctx = useContext(InlineEditContext);
  if (!ctx) throw new Error('useInlineEdit must be used inside InlineEditProvider');
  return ctx;
}
