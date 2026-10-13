'use client';

import { useRef, useState } from 'react';
import SiteLogo, { resolveLogo } from '@/components/SiteLogo';
import { invalidateSiteSettings, useSiteSettings } from '@/hooks/useSiteSettings';
import { uploadImage } from '@/lib/upload-client';

/**
 * Changer le logo directement depuis le site (mode « Éditer le site » → « Modifier le menu et le logo »).
 * Enregistre le réglage « logo_url » (le même que Paramètres → Logo & Identité) : le logo change aussitôt dans
 * l'en-tête et le pied de page. Taille, forme et position se règlent toujours dans l'administration.
 */
export default function LogoQuickEditor() {
  const settings = useSiteSettings();
  const logo = resolveLogo(settings);
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const save = async (value: string) => {
    const res = await fetch('/api/cms/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates: [{ key: 'logo_url', value }] }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(res.status === 401 ? 'Session expirée : reconnectez-vous à l’administration puis réessayez.' : data.error || `Erreur ${res.status}`);
    }
    invalidateSiteSettings();
  };

  const run = async (job: () => Promise<void>, success: string) => {
    setBusy(true);
    setMessage(null);
    try {
      await job();
      setMessage({ ok: true, text: success });
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : 'Envoi impossible. Réessayez.' });
    } finally {
      setBusy(false);
    }
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const file = target.files?.[0];
    if (!file) return;
    void run(async () => save(await uploadImage(file)), 'Logo enregistré : il est déjà en place sur le site.').finally(() => { target.value = ''; });
  };

  return (
    <div style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid #eee' }}>
      <h3 style={{ margin: '0 0 .6rem', fontSize: '.95rem', fontWeight: 700, color: '#2d5f54' }}>🖼️ Logo</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ background: '#fff', border: '1px solid #e8e4df', borderRadius: '.5rem', padding: '.5rem .9rem', minHeight: 60, display: 'flex', alignItems: 'center' }}>
          <SiteLogo url={logo.url} size={Math.min(logo.size, 56)} shape={logo.shape} alt="Logo actuel" />
        </div>
        <input ref={input} type="file" accept="image/*" hidden onChange={onFile} />
        <button type="button" disabled={busy} onClick={() => input.current?.click()}
          style={{ padding: '.55rem 1.1rem', background: '#2d5f54', color: 'white', border: 'none', borderRadius: '.5rem', fontWeight: 600, cursor: 'pointer', opacity: busy ? .6 : 1 }}>
          {busy ? 'Envoi en cours…' : '📷 Changer le logo'}
        </button>
        {settings.logo_url && (
          <button type="button" disabled={busy}
            onClick={() => { if (confirm('Revenir au logo d’origine du site ?')) void run(() => save(''), 'Logo d’origine rétabli.'); }}
            style={{ padding: '.5rem .9rem', background: 'white', border: '1px solid #ddd', borderRadius: '.5rem', cursor: 'pointer', fontSize: '.85rem', color: '#555' }}>
            ↩ Logo d’origine
          </button>
        )}
      </div>
      {message && <p style={{ margin: '.6rem 0 0', fontSize: '.85rem', color: message.ok ? '#047857' : '#dc2626' }}>{message.ok ? '✅' : '❌'} {message.text}</p>}
      <p style={{ margin: '.5rem 0 0', fontSize: '.78rem', color: '#888' }}>
        Taille, forme et position du logo : administration → Paramètres → Logo &amp; Identité.
      </p>
    </div>
  );
}
