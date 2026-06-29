'use client';
import { useState, useEffect } from 'react';
import { useInlineEdit } from '@/contexts/InlineEditContext';

export default function InlineEditor() {
  const { isEditing, isVisible, toggleEditing, saveAll, changeCount } = useInlineEdit();
  const [showSaved, setShowSaved] = useState(false);
  const [showError, setShowError] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Listen for save events from InlineEditContext
  useEffect(() => {
    const onSaved = () => {
      setShowSaved(true);
      setShowError([]);
      setTimeout(() => setShowSaved(false), 3000);
    };
    const onError = (e: Event) => {
      setShowError((e as CustomEvent<{ errors: string[] }>).detail.errors);
      setTimeout(() => setShowError([]), 5000);
    };
    window.addEventListener('inline-edit-saved', onSaved);
    window.addEventListener('inline-edit-error', onError);
    return () => {
      window.removeEventListener('inline-edit-saved', onSaved);
      window.removeEventListener('inline-edit-error', onError);
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await saveAll();
    setSaving(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Edit mode floating button — bottom left */}
      <button
        onClick={toggleEditing}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.6rem 1.1rem',
          background: isEditing ? '#dc2626' : '#2d5f54',
          color: 'white',
          border: 'none',
          borderRadius: '999px',
          boxShadow: '0 4px 16px rgba(0,0,0,.25)',
          fontSize: '0.85rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'background .2s, transform .1s',
        }}
        title={isEditing ? 'Quitter le mode édition' : 'Activer le mode édition'}
      >
        <span style={{ fontSize: '1rem' }}>✏️</span>
        {isEditing ? 'Quitter' : 'Éditer'}
      </button>

      {/* Save floating button — bottom right, appears when changes pending */}
      {changeCount > 0 && (
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.7rem 1.4rem',
            background: saving ? '#6b7280' : '#16a34a',
            color: 'white',
            border: 'none',
            borderRadius: '999px',
            boxShadow: '0 4px 16px rgba(0,0,0,.25)',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'background .2s',
          }}
        >
          💾 {saving ? 'Sauvegarde…' : `Sauvegarder (${changeCount})`}
        </button>
      )}

      {/* Success toast */}
      {showSaved && (
        <div style={{
          position: 'fixed',
          bottom: '5.5rem',
          right: '1.5rem',
          zIndex: 99999,
          background: '#16a34a',
          color: 'white',
          padding: '0.7rem 1.2rem',
          borderRadius: '0.75rem',
          fontSize: '0.88rem',
          fontWeight: 600,
          boxShadow: '0 4px 12px rgba(0,0,0,.2)',
        }}>
          ✅ Sauvegardé avec succès !
        </div>
      )}

      {/* Error toast */}
      {showError.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '5.5rem',
          right: '1.5rem',
          zIndex: 99999,
          background: '#dc2626',
          color: 'white',
          padding: '0.7rem 1.2rem',
          borderRadius: '0.75rem',
          fontSize: '0.85rem',
          maxWidth: 320,
          boxShadow: '0 4px 12px rgba(0,0,0,.2)',
        }}>
          ❌ Erreur : {showError[0]}
        </div>
      )}
    </>
  );
}
