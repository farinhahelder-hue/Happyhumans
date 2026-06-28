import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// GET /api/cms/public-content?page=home
// Endpoint public (pas d'auth) — lecture seule du contenu CMS pour les pages publiques
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page');
  if (!page) return NextResponse.json({ content: [] });

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ content: [] });

  const { data } = await supabase
    .from('site_content')
    .select('block_key, value')
    .eq('page', page);

  // Sanitisation : corriger les typos introduites par des push automatiques
  const sanitized = (data || []).map((row: { block_key: string; value: string }) => ({
    ...row,
    value: row.value
      ?.replace(/au booze et ailleurs/gi, 'au boulot et ailleurs')
      ?.replace(/au booze/gi, 'au boulot'),
  }));

  return NextResponse.json(
    { content: sanitized },
    { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } }
  );
}
