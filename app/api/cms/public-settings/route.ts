import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Endpoint public pour les paramètres globaux du site (logo, taille, nom)
// Utilisé par Header pour ne pas dépendre de NEXT_PUBLIC_SUPABASE_ANON_KEY
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ settings: {} });

  const sb = createClient(url, key);
  const { data } = await sb
    .from('cms_settings_kv')
    .select('key, value')
    .in('key', ['logo_url', 'logo_size', 'site_name', 'tagline', 'theme_preset',
                 'theme_primary', 'theme_accent', 'theme_dark', 'theme_bg', 'favicon_url']);

  const settings: Record<string, string> = {};
  (data || []).forEach((r: { key: string; value: string }) => { if (r.value) settings[r.key] = r.value; });

  return NextResponse.json(
    { settings },
    { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } }
  );
}
