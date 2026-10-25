import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireCmsAuth } from '@/lib/cms-auth';
import { NAV_LOCKED_KEY, NAV_KEY, isNavLocked } from '@/lib/cms-nav';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// GET /api/cms/navigation — lecture publique (menu + verrou d'ordre)
export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ nav: [], locked: false });

  const { data } = await supabase
    .from('site_content')
    .select('block_key, value')
    .eq('page', 'navigation');

  const rows = (data || []) as { block_key: string; value: string | null }[];
  const navRow = rows.find(r => r.block_key === NAV_KEY);
  const lockRow = rows.find(r => r.block_key === NAV_LOCKED_KEY);
  let items = null;
  try { items = navRow?.value ? JSON.parse(navRow.value) : null; } catch { items = null; }

  return NextResponse.json(
    { nav: items, locked: isNavLocked(lockRow?.value) },
    { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=10, stale-while-revalidate=30' } },
  );
}

// PUT /api/cms/navigation — écriture (auth requis)
//   body : { nav?: NavItem[], locked?: boolean } — `nav` et `locked` peuvent être envoyés séparément
export async function PUT(req: NextRequest) {
  const authError = requireCmsAuth(req);
  if (authError) return authError;

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });

  const body = await req.json();
  const navItems = body.nav;
  const locked = body.locked;

  if (navItems !== undefined && !Array.isArray(navItems)) {
    return NextResponse.json({ error: 'nav doit être un tableau' }, { status: 400 });
  }
  if (navItems === undefined && locked === undefined) {
    return NextResponse.json({ error: 'rien à enregistrer (nav ou locked)' }, { status: 400 });
  }

  const rows: { page: string; block_key: string; value: string }[] = [];
  if (navItems !== undefined) rows.push({ page: 'navigation', block_key: NAV_KEY, value: JSON.stringify(navItems) });
  if (locked !== undefined) rows.push({ page: 'navigation', block_key: NAV_LOCKED_KEY, value: locked ? '1' : '0' });

  const { error } = await supabase
    .from('site_content')
    .upsert(rows, { onConflict: 'page,block_key' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, locked: locked === undefined ? undefined : Boolean(locked) });
}
