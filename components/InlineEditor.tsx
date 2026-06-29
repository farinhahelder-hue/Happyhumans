'use client';
import { useState, useEffect } from 'react';
import { useInlineEdit } from '@/contexts/InlineEditContext';

function getCmsEditCookie(): boolean {
  if (typeof document === 'undefined') return false;
  const match = document.cookie.match(/(?:^|;\s*)hh_cms_edit=([^;]*)/);
  return match !== null && match[1] === '1';
}

export default function InlineEditor() {
  const { isEditing, toggleEditing, discardChanges, saveAll, changeCount, isSaving } = useInlineEdit();
  const [isCmsUser, setIsCmsUser] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'partial'; message: string } | null>(null);

  useEffect(() => {
    setIsCmsUser(getCmsEditCookie());
  }, []);

  // Listen for save events
  useEffect(() => {
    const onSaved = (e: Event) => {
      const detail = (e as CustomEvent<{ count: number }>).detail;
      setToast({ type: 'success', message: `✅ ${detail.count} champ${detail.count > 1 ? 's' : ''} sauvegardé${detail.count > 1 ? 's' : ''} !` });
      setTimeout(() => setToast(null), 3500);
    };
    const onError = (e: Event) => {
      const detail = (e as CustomEvent<{ errors: string[]; partial?: boolean }>).detail;
      const msg = detail.partial
        ? `⚠️ Partiel : ${detail.errors[0]}`
        : `❌ Erreur : ${detail.errors[0]}`;
      setToast({ type: detail.partial ? 'partial' : 'error', message: msg });
      setTimeout(() => setToast(null), 6000);
    };
    window.addEventListener('inline-edit-saved', onSaved);
    window.addEventListener('inline-edit-error', onError);
    return () => {
      window.removeEventListener('inline-edit-saved', onSaved);
      window.removeEventListener('inline-edit-error', onError);
    };
  }, []);

  const handleSave = async () => {
    if (isSaving) return;
    await saveAll();
  };

  const handleDiscard = () => {
    if (window.confirm('Annuler toutes les modifications en cours ?')) {
      discardChanges();
      setToast({ type: 'success', message: '↩️ Modifications annulées' });
      setTimeout(() => setToast(null), 2500);
    }
  };

  if (!isCmsUser) return null;

  const toastBg = toast?.type === 'success'
    ? '#16a34a'
    : toast?.type === 'partial'
    ? '#d97706'
    : '#dc2626';

  return (
    <>
      {/* ── Bandeau d'édition en haut de page ── */}
      {isEditing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 99990,
          background: 'linear-gradient(90deg, #1a3d37 0%, #2d5f54 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 1.5rem',
          fontSize: '0.8rem',
          fontWeight: 600,
          boxShadow: '0 2px 12px rgba(0,0,0,.3)',
          gap: '1rem',
          fontFamily: 'system-ui, sans-serif',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1rem' }}>✏️</span>
            Mode édition actif
            {changeCount > 0 && (
              <span style={{
                background: '#f59e0b',
                color: '#1a1a1a',
                borderRadius: '999px',
                padding: '0.1rem 0.55rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                marginLeft: '0.25rem',
              }}>
                {changeCount} non sauvegardé{changeCount > 1 ? 's' : ''}
              </span>
            )}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.7, fontSize: '0.72rem' }}>
            Cliquez sur un champ pour modifier · <kbd style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.25)', borderRadius: '3px', padding: '0.1rem 0.35rem', fontFamily: 'monospace' }}>Ctrl+S</kbd> pour sauvegarder · <kbd style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.25)', borderRadius: '3px', padding: '0.1rem 0.35rem', fontFamily: 'monospace' }}>Esc</kbd> pour fermer un champ
          </span>
        </div>
      )}

      {/* ── Bouton Éditer / Quitter — bas gauche ── */}
      <button
        onClick={toggleEditing}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '1.5rem',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.6rem 1.1rem',
          background: isEditing ? '#7f1d1d' : '#2d5f54',
          color: 'white',
          border: 'none',
          borderRadius: '999px',
          boxShadow: '0 4px 16px rgba(0,0,0,.3)',
          fontSize: '0.82rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'background .2s, transform .15s',
          fontFamily: 'system-ui, sans-serif',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        title={isEditing ? 'Quitter le mode édition' : 'Activer le mode édition inline'}
      >
        <span style={{ fontSize: '1rem' }}>{isEditing ? '✕' : '✏️'}</span>
        {isEditing ? 'Quitter' : 'Éditer'}
      </button>

      {/* ── Boutons Annuler + Sauvegarder — bas droit (si changements) ── */}
      {isEditing && changeCount > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 99999,
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}>
          {/* Annuler */}
          <button
            onClick={handleDiscard}
            style={{
              padding: '0.6rem 1.1rem',
              background: 'rgba(30,30,30,0.85)',
              color: '#fca5a5',
              border: '1px solid rgba(252,165,165,0.35)',
              borderRadius: '999px',
              boxShadow: '0 4px 16px rgba(0,0,0,.25)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'background .15s',
            }}
            title="Annuler toutes les modifications"
          >
            ↩ Annuler
          </button>

          {/* Sauvegarder */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.65rem 1.35rem',
              background: isSaving ? '#4b7c71' : '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '999px',
              boxShadow: '0 4px 16px rgba(22,163,74,.4)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: isSaving ? 'wait' : 'pointer',
              transition: 'background .2s, transform .15s',
            }}
            onMouseEnter={e => { if (!isSaving) e.currentTarget.style.transform = 'scale(1.04)'; }}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            title="Sauvegarder (Ctrl+S)"
          >
            {isSaving ? (
              <>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                Sauvegarde…
              </>
            ) : (
              <>
                💾 Sauvegarder ({changeCount})
                <span style={{ opacity: 0.65, fontSize: '0.72rem', marginLeft: '0.2rem' }}>Ctrl+S</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* ── Toast notification ── */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: changeCount > 0 ? '5.5rem' : '1.5rem',
            right: '1.5rem',
            zIndex: 999999,
            background: toastBg,
            color: 'white',
            padding: '0.75rem 1.25rem',
            borderRadius: '0.75rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            boxShadow: '0 6px 20px rgba(0,0,0,.25)',
            maxWidth: 340,
            fontFamily: 'system-ui, sans-serif',
            animation: 'fadeInUp 0.2s ease',
          }}
        >
          {toast.message}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
}
