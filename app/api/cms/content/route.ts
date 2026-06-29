import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireCmsAuth } from '@/lib/cms-auth';

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// GET /api/cms/content?page=home
export async function GET(req: NextRequest) {
  const supabase = getSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });
  const authError = requireCmsAuth(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page');

  let query = supabase.from('site_content').select('*').order('page').order('id');
  if (page) query = query.eq('page', page);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ content: data });
}

// PUT /api/cms/content body: { page, block_key, value }
export async function PUT(req: NextRequest) {
  const supabase = getSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });
  const authError = requireCmsAuth(req);
  if (authError) return authError;

  const body = await req.json();
  const { page, block_key, value } = body;
  if (!page || !block_key === undefined) {
    return NextResponse.json({ error: 'page et block_key requis' }, { status: 400 });
  }

  // Use upsert with composite unique constraint on (page, block_key)
  const { data, error } = await supabase
    .from('site_content')
    .upsert(
      { page, block_key, value: value ?? '' },
      { onConflict: 'page,block_key' }
    )
    .select()
    .single();

  if (error) {
    // Provide actionable error message
    let detail = error.message;
    if (error.code === '23505') detail = 'Doublon détecté — cette clé existe déjà';
    else if (error.code === '42501') detail = 'Droits insuffisants — vérifiez la clé service_role Supabase';
    else if (error.message?.includes('does not exist')) detail = `Table 'site_content' introuvable — exécutez la migration SQL`;
    return NextResponse.json({ error: detail, code: error.code }, { status: 500 });
  }
  return NextResponse.json({ success: true, data });
}
