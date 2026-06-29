import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireCmsAuth } from '@/lib/cms-auth';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// GET /api/cms/navigation — lecture publique
export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ nav: [] });

  const { data } = await supabase
    .from('site_content')
    .select('block_key, value')
    .eq('page', 'navigation');

  const navItem = (data || []).find((r: { block_key: string }) => r.block_key === 'nav_items');
  const items = navItem?.value ? JSON.parse(navItem.value) : null;
  return NextResponse.json({ nav: items }, { headers: { 'Cache-Control': 'public, s-maxage=30' } });
}

// PUT /api/cms/navigation — écriture (auth requis)
export async function PUT(req: NextRequest) {
  const authError = requireCmsAuth(req);
  if (authError) return authError;

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });

  const body = await req.json();
  const navItems = body.nav;

  if (!Array.isArray(navItems)) {
    return NextResponse.json({ error: 'nav doit être un tableau' }, { status: 400 });
  }

  const { error } = await supabase
    .from('site_content')
    .upsert(
      { page: 'navigation', block_key: 'nav_items', value: JSON.stringify(navItems) },
      { onConflict: 'page,block_key' }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
