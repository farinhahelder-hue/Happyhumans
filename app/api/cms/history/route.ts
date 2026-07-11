import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireCmsAuth } from '@/lib/cms-auth';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// GET /api/cms/history?page=happiness-design — dernières modifications
export async function GET(req: NextRequest) {
  const authError = requireCmsAuth(req);
  if (authError) return authError;

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page');

  let query = supabase
    .from('site_content_history')
    .select('id, page, block_key, old_value, new_value, changed_at')
    .order('changed_at', { ascending: false })
    .limit(100);
  if (page) query = query.eq('page', page);

  const { data, error } = await query;
  if (error) {
    if (error.message?.includes('does not exist') || error.message?.includes('Could not find the table')) {
      return NextResponse.json({
        error: 'migration_missing',
        message: "L'historique n'est pas encore activé — exécutez la migration SQL 20260711000000_content_history.sql dans Supabase.",
      }, { status: 501 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ history: data ?? [] });
}

// POST /api/cms/history — body { id } : restaure l'ancienne valeur de cette entrée
export async function POST(req: NextRequest) {
  const authError = requireCmsAuth(req);
  if (authError) return authError;

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 });

  const { data: entry, error: readErr } = await supabase
    .from('site_content_history')
    .select('page, block_key, old_value')
    .eq('id', id)
    .single();
  if (readErr || !entry) return NextResponse.json({ error: readErr?.message ?? 'Entrée introuvable' }, { status: 404 });

  // Restaure l'ancienne valeur (le trigger journalisera cette restauration aussi)
  const { error: writeErr } = await supabase
    .from('site_content')
    .upsert(
      { page: entry.page, block_key: entry.block_key, value: entry.old_value ?? '' },
      { onConflict: 'page,block_key' }
    );
  if (writeErr) return NextResponse.json({ error: writeErr.message }, { status: 500 });

  return NextResponse.json({ success: true, restored: { page: entry.page, block_key: entry.block_key } });
}
