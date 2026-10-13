'use client';
import { useEffect, useState } from 'react';
import { DEFAULT_PACK_ID, resolvePack, type IllustrationPack } from '@/lib/theme-packs';

/**
 * Pack d'illustrations actif (clé CMS `illustration_pack`, repli : pack du
 * thème puis pack par défaut). Les pages consomment `pack.slots`.
 */
export function useIllustrationPack(): IllustrationPack {
  const [packId, setPackId] = useState<string>(DEFAULT_PACK_ID);

  useEffect(() => {
    let active = true;
    fetch('/api/cms/public-settings')
      .then((r) => (r.ok ? r.json() : { settings: {} }))
      .then(({ settings }: { settings: Record<string, string> }) => {
        if (!active) return;
        if (settings?.illustration_pack) setPackId(settings.illustration_pack);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  return resolvePack(packId);
}
