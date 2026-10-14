'use client';

import { useRef, useState } from 'react';
import SiteLogo, { resolveLogo } from '@/components/SiteLogo';
import { invalidateSiteSettings, useSiteSettings } from '@/hooks/useSiteSettings';
import { uploadImage } from '@/lib/upload-client';

/**
 * Changer les logos directement depuis le site (mode « Éditer le site » → « Modifier le menu et le logo »).
 * Enregistre les réglages « logo_url » (en-tête) et « logo_footer_url » (pied de page, version claire pour fond
 * sombre) : les mêmes que Paramètres → Logo & Identité. Le logo change aussitôt sur le site. Taille, forme et position
 * se règlent toujours dans l'administration.
 */
export default function LogoQuickEditor() {
  return (
    <div style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid #eee' }}>
      <h3 style={{ margin: '0 0 .6rem', fontSize: '.95rem', fontWeight: 700, color: '#2d5f54' }}>🖼️ Logos</h3>
      <LogoRow
        title="Logo de l’en-tête"
        settingKey="logo_url"
        resetLabel="↩ Logo d’origine"
        previewBackground="#ffffff"
        onDark={false}
      />
      <LogoRow
        title="Logo du pied de page (version claire, pour le fond vert foncé)"
        settingKey="logo_footer_url"
        resetLabel="↩ Même logo que l’en-tête"
        previewBackground="#1e3a34"
        onDark
      />
      <p style={{ margin: '.5rem 0 0', fontSize: '.78rem', color: '#888' }}>
        Taille, forme et position du logo : administration → Paramètres → Logo &amp; Identité.
      </p>
    </div>
  );
}

function LogoRow({
  title, settingKey, resetLabel, previewBackground, onDark,
}: { title: string; settingKey: 'logo_url' | 'logo_footer_url'; resetLabel: string; previewBackground: string; onDark: boolean }) {
  const settings = useSiteSettings();
  const logo = resolveLogo(settings, onDark ? { onDark: true, fallbackSize: 40, maxSize: 72, sizeKey: 'logo_footer_size' } : {});
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const save = async (value: string) => {
    const res = await fetch('/api/cms/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates: [{ key: settingKey, value }] }),
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
    <div style={{ margin: '0 0 1rem' }}>
      <p style={{ margin: '0 0 .4rem', fontSize: '.82rem', fontWeight: 600, color: '#444' }}>{title}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ background: previewBackground, border: '1px solid #e8e4df', borderRadius: '.5rem', padding: '.5rem .9rem', minHeight: 60, display: 'flex', alignItems: 'center' }}>
          <SiteLogo url={logo.url} size={Math.min(logo.size, 56)} shape={logo.shape} alt="Logo actuel" />
        </div>
        <input ref={input} type="file" accept="image/*" hidden onChange={onFile} />
        <button type="button" disabled={busy} onClick={() => input.current?.click()}
          style={{ padding: '.55rem 1.1rem', background: '#2d5f54', color: 'white', border: 'none', borderRadius: '.5rem', fontWeight: 600, cursor: 'pointer', opacity: busy ? .6 : 1 }}>
          {busy ? 'Envoi en cours…' : '📷 Changer'}
        </button>
        {settings[settingKey] && (
          <button type="button" disabled={busy}
            onClick={() => { if (confirm('Revenir au logo par défaut ?')) void run(() => save(''), 'Logo par défaut rétabli.'); }}
            style={{ padding: '.5rem .9rem', background: 'white', border: '1px solid #ddd', borderRadius: '.5rem', cursor: 'pointer', fontSize: '.85rem', color: '#555' }}>
            {resetLabel}
          </button>
        )}
      </div>
      {message && <p style={{ margin: '.5rem 0 0', fontSize: '.85rem', color: message.ok ? '#047857' : '#dc2626' }}>{message.ok ? '✅' : '❌'} {message.text}</p>}
    </div>
  );
}
