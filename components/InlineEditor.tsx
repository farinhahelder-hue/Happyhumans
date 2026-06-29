'use client';
import { useState, useEffect } from 'react';
import { useInlineEdit } from '@/contexts/InlineEditContext';

function getCmsEditCookie(): boolean {
  if (typeof document === 'undefined') return false;
  const match = document.cookie.match(/(?:^|;\s*)hh_cms_edit=([^;]*)/);
  return match !== null && match[1] === '1';
}

export default function InlineEditor() {
  const { isEditing, toggleEditing, saveAll, changeCount } = useInlineEdit();
  const [isCmsUser, setIsCmsUser] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [showError, setShowError] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Read the hh_cms_edit cookie set by middleware when ?cms_edit_token=... was visited
    setIsCmsUser(getCmsEditCookie());
  }, []);

  useEffect(() => {
    const onSaved = () => { setShowSaved(true); setShowError([]); setTimeout(() => setShowSaved(false), 3000); };
    const onError = (e: Event) => { setShowError((e as CustomEvent<{ errors: string[] }>).detail.errors); setTimeout(() => setShowError([]), 5000); };
    window.addEventListener('inline-edit-saved', onSaved);
    window.addEventListener('inline-edit-error', onError);
    return () => { window.removeEventListener('inline-edit-saved', onSaved); window.removeEventListener('inline-edit-error', onError); };
  }, []);

  const handleSave = async () => { setSaving(true); await saveAll(); setSaving(false); };

  // Invisible if not from CMS admin
  if (!isCmsUser) return null;

  return (
    <>
      {/* Edit mode button — bottom left */}
      <button onClick={toggleEditing}
        style={{ position: 'fixed', bottom: '1.5rem', left: '1.5rem', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.1rem', background: isEditing ? '#dc2626' : '#2d5f54', color: 'white', border: 'none', borderRadius: '999px', boxShadow: '0 4px 16px rgba(0,0,0,.25)', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: 'background .2s' }}
        title={isEditing ? 'Quitter le mode édition' : 'Activer le mode édition'}>
        <span style={{ fontSize: '1rem' }}>✏️</span>
        {isEditing ? 'Quitter' : 'Éditer'}
      </button>

      {/* Save button — bottom right when changes pending */}
      {changeCount > 0 && (
        <button onClick={handleSave} disabled={saving}
          style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.7rem 1.4rem', background: saving ? '#6b7280' : '#16a34a', color: 'white', border: 'none', borderRadius: '999px', boxShadow: '0 4px 16px rgba(0,0,0,.25)', fontSize: '0.88rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', transition: 'background .2s' }}>
          💾 {saving ? 'Sauvegarde…' : `Sauvegarder (${changeCount})`}
        </button>
      )}

      {showSaved && (
        <div style={{ position: 'fixed', bottom: '5.5rem', right: '1.5rem', zIndex: 99999, background: '#16a34a', color: 'white', padding: '0.7rem 1.2rem', borderRadius: '0.75rem', fontSize: '0.88rem', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,.2)' }}>
          ✅ Sauvegardé avec succès !
        </div>
      )}

      {showError.length > 0 && (
        <div style={{ position: 'fixed', bottom: '5.5rem', right: '1.5rem', zIndex: 99999, background: '#dc2626', color: 'white', padding: '0.7rem 1.2rem', borderRadius: '0.75rem', fontSize: '0.85rem', maxWidth: 320, boxShadow: '0 4px 12px rgba(0,0,0,.2)' }}>
          ❌ Erreur : {showError[0]}
        </div>
      )}
    </>
  );
}
