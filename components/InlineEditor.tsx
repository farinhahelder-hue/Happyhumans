'use client';
import { useState, useEffect, useCallback } from 'react';
import { useInlineEdit } from '@/contexts/InlineEditContext';

type Toast = { id: number; type: 'success' | 'partial' | 'error'; message: string };

function getCmsEditCookie(): boolean {
  if (typeof document === 'undefined') return false;
  const match = document.cookie.match(/(?:^|;\s*)hh_cms_edit=([^;]*)/);
  return match !== null && match[1] === '1';
}

export default function InlineEditor() {
  const { isEditing, isSaving, toggleEditing, saveAll, discardChanges, changeCount } = useInlineEdit();
  const [isCmsUser, setIsCmsUser] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = { current: 0 };

  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  useEffect(() => {
    setIsCmsUser(getCmsEditCookie());
  }, []);

  // Global Ctrl+S / Cmd+S shortcut
  useEffect(() => {
    if (!isEditing) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveAll();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isEditing, saveAll]);

  // Event listeners for save results
  useEffect(() => {
    const onSaved = (e: Event) => {
      const { count } = (e as CustomEvent<{ count: number }>).detail;
      addToast('success', `✅ ${count} champ${count > 1 ? 's' : ''} sauvegardé${count > 1 ? 's' : ''} !`);
    };
    const onPartial = (e: Event) => {
      const { saved, errors } = (e as CustomEvent<{ saved: number; errors: string[] }>).detail;
      addToast('partial', `⚠️ ${saved} sauvegardé${saved > 1 ? 's' : ''}, ${errors.length} échoué${errors.length > 1 ? 's' : ''}`);
    };
    const onError = (e: Event) => {
      const { errors } = (e as CustomEvent<{ errors: string[] }>).detail;
      addToast('error', `❌ Échec : ${errors[0]}`);
    };
    window.addEventListener('inline-edit-saved', onSaved);
    window.addEventListener('inline-edit-partial', onPartial);
    window.addEventListener('inline-edit-error', onError);
    return () => {
      window.removeEventListener('inline-edit-saved', onSaved);
      window.removeEventListener('inline-edit-partial', onPartial);
      window.removeEventListener('inline-edit-error', onError);
    };
  }, [addToast]);

  const handleQuit = () => {
    if (changeCount > 0) {
      if (!window.confirm(`Vous avez ${changeCount} modification${changeCount > 1 ? 's' : ''} non sauvegardée${changeCount > 1 ? 's' : ''}. Voulez-vous vraiment quitter sans sauvegarder ?`)) {
        return;
      }
    }
    toggleEditing();
  };

  // Invisible if not from CMS admin
  if (!isCmsUser) return null;

  const toastColors = { success: '#16a34a', partial: '#d97706', error: '#dc2626' };

  return (
    <>
      {/* Green banner when editing */}
      {isEditing && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9998,
          background: 'linear-gradient(90deg, #2d5f54, #3a7c6e)',
          color: 'white', padding: '0.5rem 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem',
          fontSize: '0.8rem', fontWeight: 500,
          boxShadow: '0 2px 12px rgba(0,0,0,.2)',
          fontFamily: 'inherit',
        }}>
          <span style={{ fontWeight: 700, letterSpacing: '0.03em' }}>
            ✏️ Mode édition CMS — {changeCount} modification{changeCount !== 1 ? 's' : ''} en attente
          </span>
          <span style={{ opacity: 0.7 }}>
            Ctrl+S pour sauvegarder · Échap pour fermer un champ
          </span>
        </div>
      )}

      {/* Edit / Quit button — bottom left */}
      <button
        onClick={isEditing ? handleQuit : toggleEditing}
        style={{
          position: 'fixed', bottom: '1.5rem', left: '1.5rem', zIndex: 9999,
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.65rem 1.2rem',
          background: isEditing ? '#dc2626' : '#2d5f54',
          color: 'white', border: 'none', borderRadius: '999px',
          boxShadow: '0 4px 16px rgba(0,0,0,.25)',
          fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer',
          transition: 'background .2s, transform .1s',
        }}
        title={isEditing ? 'Quitter le mode édition' : 'Activer le mode édition'}
      >
        <span style={{ fontSize: '1rem' }}>{isEditing ? '✕' : '✏️'}</span>
        {isEditing ? 'Quitter' : 'Éditer'}
      </button>

      {/* Save + Cancel buttons — bottom right */}
      {changeCount > 0 && (
        <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={() => { if (window.confirm('Annuler toutes les modifications ?')) discardChanges(); }}
            style={{
              padding: '0.65rem 1rem',
              background: '#6b7280', color: 'white', border: 'none', borderRadius: '999px',
              boxShadow: '0 4px 16px rgba(0,0,0,.25)',
              fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
            }}
          >
            ↩ Annuler
          </button>
          <button
            onClick={saveAll}
            disabled={isSaving}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.65rem 1.3rem',
              background: isSaving ? '#6b7280' : '#16a34a',
              color: 'white', border: 'none', borderRadius: '999px',
              boxShadow: '0 4px 16px rgba(0,0,0,.25)',
              fontSize: '0.88rem', fontWeight: 700,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              transition: 'background .2s',
            }}
          >
            {isSaving ? (
              <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            ) : '💾'}
            {isSaving ? 'Sauvegarde…' : `Sauvegarder${typeof navigator !== 'undefined' && navigator.platform?.includes('Mac') ? ' ⌘S' : ' Ctrl+S'} (${changeCount})`}
          </button>
        </div>
      )}

      {/* Toasts */}
      {toasts.map(toast => (
        <div
          key={toast.id}
          style={{
            position: 'fixed', bottom: '5.5rem', right: '1.5rem', zIndex: 99999,
            background: toastColors[toast.type],
            color: 'white', padding: '0.7rem 1.2rem',
            borderRadius: '0.75rem', fontSize: '0.88rem', fontWeight: 600,
            maxWidth: 360, boxShadow: '0 4px 12px rgba(0,0,0,.2)',
            animation: 'slideUp 0.2s ease-out',
          }}
        >
          {toast.message}
        </div>
      ))}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
}
