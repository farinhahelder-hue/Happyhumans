import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireCmsAuth } from '@/lib/cms-auth';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

const DEFAULT_SETTINGS = [
  // Thème
  { key: 'theme_preset',     label: 'Thème actif',                group_name: 'theme',    type: 'text',     value: 'forest' },
  { key: 'theme_primary',    label: 'Couleur principale',         group_name: 'theme',    type: 'text',     value: '' },
  { key: 'theme_accent',     label: 'Couleur accent',             group_name: 'theme',    type: 'text',     value: '' },
  { key: 'theme_dark',       label: 'Couleur sombre',             group_name: 'theme',    type: 'text',     value: '' },
  { key: 'theme_bg',         label: 'Couleur fond',               group_name: 'theme',    type: 'text',     value: '' },
  // Branding
  { key: 'logo_url',         label: 'Logo du site (image)',       group_name: 'branding', type: 'image',    value: '' },
  { key: 'logo_size',        label: 'Taille du logo (px)',        group_name: 'branding', type: 'text',     value: '44' },
  { key: 'logo_shape',       label: 'Forme du logo',              group_name: 'branding', type: 'text',     value: 'circle' },
  { key: 'logo_position',    label: 'Position dans le header',    group_name: 'branding', type: 'text',     value: 'left' },
  { key: 'favicon_url',      label: 'Favicon (icône onglet)',      group_name: 'branding', type: 'image',    value: '' },
  { key: 'site_name',        label: 'Nom du site',                 group_name: 'branding', type: 'text',     value: 'Happy Humans' },
  { key: 'tagline',          label: 'Tagline / Slogan',            group_name: 'branding', type: 'text',     value: 'philo-coaching' },
  { key: 'contact_email',    label: 'Email de contact',            group_name: 'general',  type: 'text',     value: '' },
  { key: 'contact_phone',    label: 'Téléphone',                   group_name: 'general',  type: 'text',     value: '' },
  { key: 'address',          label: 'Adresse / Ville',             group_name: 'general',  type: 'text',     value: '' },
  { key: 'linkedin_url',     label: 'LinkedIn URL',                group_name: 'social',   type: 'text',     value: '' },
  { key: 'instagram_url',    label: 'Instagram URL',               group_name: 'social',   type: 'text',     value: '' },
  { key: 'instagram_handle', label: 'Instagram @handle',           group_name: 'social',   type: 'text',     value: '' },
  { key: 'facebook_url',     label: 'Facebook URL',                group_name: 'social',   type: 'text',     value: '' },
  { key: 'seo_title',        label: 'Titre SEO par défaut',        group_name: 'seo',      type: 'text',     value: '' },
  { key: 'seo_description',  label: 'Description SEO',             group_name: 'seo',      type: 'textarea', value: '' },
  { key: 'og_image',         label: 'Image Open Graph (réseaux)',  group_name: 'seo',      type: 'image',    value: '' },
  { key: 'footer_text',      label: 'Texte copyright footer',      group_name: 'footer',   type: 'text',     value: '' },
  { key: 'footer_links',     label: 'Liens footer (JSON)',         group_name: 'footer',   type: 'textarea', value: '' },
];

export async function GET(req: NextRequest) {
  const authError = requireCmsAuth(req);
  if (authError) return authError;

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ settings: DEFAULT_SETTINGS });

  const { data } = await supabase.from('cms_settings_kv').select('key, value');
  const dbMap: Record<string, string> = {};
  (data || []).forEach((r: { key: string; value: string }) => { dbMap[r.key] = r.value; });

  const merged = DEFAULT_SETTINGS.map(def => ({
    ...def,
    value: dbMap[def.key] !== undefined ? dbMap[def.key] : def.value,
  }));

  return NextResponse.json({ settings: merged });
}

export async function PUT(req: NextRequest) {
  const authError = requireCmsAuth(req);
  if (authError) return authError;

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });

  const body = await req.json();

  // Support both single {key, value} and batch {updates: [{key, value}]}
  const updates: { key: string; value: string }[] = body.updates
    ? body.updates
    : [{ key: body.key, value: body.value }];

  for (const { key, value } of updates) {
    if (!key) continue;
    const { error } = await supabase
      .from('cms_settings_kv')
      .upsert({ key, value: value ?? '', updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function POST(req: NextRequest) {
  return PUT(req);
}
