import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireCmsAuth } from '@/lib/cms-auth';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// GET /api/cms/maintenance — lecture publique
export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ enabled: false });

  const { data } = await supabase
    .from('site_content')
    .select('value')
    .eq('page', 'settings')
    .eq('block_key', 'maintenance_mode')
    .single();

  return NextResponse.json({ enabled: data?.value === 'true' });
}

// PUT /api/cms/maintenance — écriture (auth requis)
export async function PUT(req: NextRequest) {
  const authError = requireCmsAuth(req);
  if (authError) return authError;

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });

  const { enabled } = await req.json();

  const { error } = await supabase
    .from('site_content')
    .upsert(
      { page: 'settings', block_key: 'maintenance_mode', value: enabled ? 'true' : 'false' },
      { onConflict: 'page,block_key' }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
