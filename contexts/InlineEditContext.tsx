'use client';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { bustCmsCache } from '@/hooks/useCmsContent';

type InlineEditContextValue = {
  isEditing: boolean;
  toggleEditing: () => void;
  discardChanges: () => void;
  pendingChanges: Record<string, Record<string, string>>;
  updateField: (page: string, key: string, value: string) => void;
  saveAll: () => Promise<void>;
  isSaving: boolean;
  changeCount: number;
};

const InlineEditContext = createContext<InlineEditContextValue | null>(null);

function countChanges(changes: Record<string, Record<string, string>>): number {
  return Object.values(changes).reduce((acc, fields) => acc + Object.keys(fields).length, 0);
}

export function InlineEditProvider({ children }: { children: React.ReactNode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, Record<string, string>>>({});
  const [isSaving, setIsSaving] = useState(false);

  const discardChanges = useCallback(() => {
    setPendingChanges({});
  }, []);

  const toggleEditing = useCallback(() => {
    setIsEditing(prev => {
      if (prev) {
        // Quitter le mode édition : demander confirmation si changements en attente
        const count = countChanges(pendingChanges);
        if (count > 0) {
          const ok = window.confirm(
            `Vous avez ${count} modification${count > 1 ? 's' : ''} non sauvegardée${count > 1 ? 's' : ''}.\n\nQuitter sans sauvegarder ?`
          );
          if (!ok) return prev; // annuler le toggle
        }
        setPendingChanges({});
      }
      return !prev;
    });
  }, [pendingChanges]);

  const updateField = useCallback((page: string, key: string, value: string) => {
    setPendingChanges(prev => ({
      ...prev,
      [page]: { ...(prev[page] || {}), [key]: value },
    }));
  }, []);

  const saveAll = useCallback(async () => {
    const pages = Object.keys(pendingChanges);
    if (pages.length === 0) return;

    setIsSaving(true);

    // Construire la liste de tous les champs à sauvegarder
    const allFields: { page: string; key: string; value: string }[] = [];
    for (const page of pages) {
      for (const [key, value] of Object.entries(pendingChanges[page])) {
        allFields.push({ page, key, value });
      }
    }

    // Sauvegardes parallèles avec Promise.allSettled
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
          return field;
        })
      )
    );

    const errors: string[] = [];
    const savedPages = new Set<string>();

    for (const result of results) {
      if (result.status === 'rejected') {
        errors.push(result.reason instanceof Error ? result.reason.message : String(result.reason));
      } else {
        savedPages.add(result.value.page);
      }
    }

    setIsSaving(false);
    const totalCount = allFields.length;

    if (errors.length === 0) {
      setPendingChanges({});
      window.dispatchEvent(new CustomEvent('inline-edit-saved', { detail: { count: totalCount, pages: [...savedPages] } }));
    } else if (errors.length < allFields.length) {
      // Sauvegarde partielle : retirer les champs sauvegardés avec succès
      setPendingChanges(prev => {
        const next = { ...prev };
        for (const result of results) {
          if (result.status === 'fulfilled') {
            const { page, key } = result.value;
            if (next[page]) {
              const { [key]: _, ...rest } = next[page];
              if (Object.keys(rest).length === 0) {
                delete next[page];
              } else {
                next[page] = rest;
              }
            }
          }
        }
        return next;
      });
      window.dispatchEvent(new CustomEvent('inline-edit-error', { detail: { errors, partial: true } }));
    } else {
      window.dispatchEvent(new CustomEvent('inline-edit-error', { detail: { errors, partial: false } }));
    }
  }, [pendingChanges]);

  // Raccourci clavier global Ctrl+S / Cmd+S
  useEffect(() => {
    if (!isEditing) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (!isSaving && countChanges(pendingChanges) > 0) {
          saveAll();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, isSaving, pendingChanges, saveAll]);

  return (
    <InlineEditContext.Provider value={{
      isEditing,
      toggleEditing,
      discardChanges,
      pendingChanges,
      updateField,
      saveAll,
      isSaving,
      changeCount: countChanges(pendingChanges),
    }}>
      {children}
    </InlineEditContext.Provider>
  );
}

export function useInlineEdit() {
  const ctx = useContext(InlineEditContext);
  if (!ctx) throw new Error('useInlineEdit must be used inside InlineEditProvider');
  return ctx;
}
