import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireCmsAuth } from '@/lib/cms-auth';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// Default settings definition with types
const DEFAULT_SETTINGS = [
  // Branding
  { key: 'logo_url',          label: 'Logo du site',          group_name: 'branding', type: 'image',    value: '' },
  { key: 'logo_alt',          label: 'Texte alternatif logo', group_name: 'branding', type: 'text',     value: 'Happy Humans' },
  { key: 'site_name',         label: 'Nom du site',           group_name: 'branding', type: 'text',     value: 'Happy Humans' },
  { key: 'tagline',           label: 'Tagline / Slogan',      group_name: 'branding', type: 'text',     value: 'philo-coaching' },
  { key: 'favicon_url',       label: 'Favicon URL',           group_name: 'branding', type: 'image',    value: '' },
  // General
  { key: 'contact_email',     label: 'Email de contact',      group_name: 'general',  type: 'text',     value: '' },
  { key: 'contact_phone',     label: 'Téléphone',             group_name: 'general',  type: 'text',     value: '' },
  { key: 'address',           label: 'Adresse',               group_name: 'general',  type: 'textarea', value: '' },
  // Social
  { key: 'linkedin_url',      label: 'LinkedIn URL',          group_name: 'social',   type: 'text',     value: '' },
  { key: 'instagram_url',     label: 'Instagram URL',         group_name: 'social',   type: 'text',     value: '' },
  { key: 'instagram_handle',  label: 'Instagram @handle',     group_name: 'social',   type: 'text',     value: '' },
  { key: 'facebook_url',      label: 'Facebook URL',          group_name: 'social',   type: 'text',     value: '' },
  // SEO
  { key: 'seo_title',         label: 'Titre SEO (défaut)',    group_name: 'seo',      type: 'text',     value: '' },
  { key: 'seo_description',   label: 'Description SEO',       group_name: 'seo',      type: 'textarea', value: '' },
  { key: 'og_image',          label: 'Image Open Graph',      group_name: 'seo',      type: 'image',    value: '' },
  // Footer
  { key: 'footer_text',       label: 'Texte footer',          group_name: 'footer',   type: 'textarea', value: '' },
  { key: 'footer_links',      label: 'Liens footer (JSON)',   group_name: 'footer',   type: 'textarea', value: '' },
];

export async function GET(req: NextRequest) {
  const authError = requireCmsAuth(req);
  if (authError) return authError;

  const supabase = getSupabase();
  if (!supabase) {
    // Return defaults without Supabase
    return NextResponse.json({ settings: DEFAULT_SETTINGS });
  }

  const { data, error } = await supabase.from('cms_settings_kv').select('*').order('group_name');

  if (error || !data || data.length === 0) {
    // Ensure table exists and return defaults
    return NextResponse.json({ settings: DEFAULT_SETTINGS });
  }

  // Merge DB values into defaults
  const merged = DEFAULT_SETTINGS.map(def => {
    const dbRow = data.find((r: any) => r.key === def.key);
    return dbRow ? { ...def, value: dbRow.value || def.value } : def;
  });

  return NextResponse.json({ settings: merged });
}

export async function POST(req: NextRequest) {
  const authError = requireCmsAuth(req);
  if (authError) return authError;

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });

  const body = await req.json();
  const { key, value } = body;
  if (!key) return NextResponse.json({ error: 'key requis' }, { status: 400 });

  const { error } = await supabase
    .from('cms_settings_kv')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const authError = requireCmsAuth(req);
  if (authError) return authError;

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });

  const body = await req.json();
  const updates: { key: string; value: string }[] = body.updates || [];

  for (const { key, value } of updates) {
    await supabase
      .from('cms_settings_kv')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  }

  return NextResponse.json({ success: true });
}
