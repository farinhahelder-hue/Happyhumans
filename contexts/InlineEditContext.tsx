'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { bustCmsCache } from '@/hooks/useCmsContent';

type InlineEditContextValue = {
  isEditing: boolean;
  toggleEditing: () => void;
  pendingChanges: Record<string, Record<string, string>>;
  updateField: (page: string, key: string, value: string) => void;
  saveAll: () => Promise<void>;
  changeCount: number;
};

const InlineEditContext = createContext<InlineEditContextValue | null>(null);

function countChanges(changes: Record<string, Record<string, string>>): number {
  return Object.values(changes).reduce((acc, fields) => acc + Object.keys(fields).length, 0);
}

export function InlineEditProvider({ children }: { children: React.ReactNode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, Record<string, string>>>({});

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

    const errors: string[] = [];
    const count = countChanges(pendingChanges);
    const allFields: { page: string; key: string; value: string }[] = [];
    for (const page of pages) {
      for (const [key, value] of Object.entries(pendingChanges[page])) {
        allFields.push({ page, key, value });
      }
    }

    for (const field of allFields) {
      try {
        const res = await fetch('/api/cms/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page: field.page, block_key: field.key, value: field.value }),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          errors.push(`${field.key} (${field.page}): ${d.error || res.status}`);
        } else {
          bustCmsCache(field.page);
        }
      } catch {
        errors.push(`${field.key} (${field.page}): erreur réseau`);
      }
    }

    if (errors.length === 0) {
      setPendingChanges({});
      window.dispatchEvent(new CustomEvent('inline-edit-saved', { detail: { count } }));
    } else {
      window.dispatchEvent(new CustomEvent('inline-edit-error', { detail: { errors } }));
    }
  }, [pendingChanges]);

  return (
    <InlineEditContext.Provider value={{ isEditing, toggleEditing, pendingChanges, updateField, saveAll, changeCount: countChanges(pendingChanges) }}>
      {children}
    </InlineEditContext.Provider>
  );
}

export function useInlineEdit() {
  const ctx = useContext(InlineEditContext);
  if (!ctx) throw new Error('useInlineEdit must be used inside InlineEditProvider');
  return ctx;
}
