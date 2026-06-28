import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireCmsAuth } from '@/lib/cms-auth';

// GET /api/cms/fix-data — appelez une fois depuis /cms-admin pour corriger les données CMS
// Corrige les typos introduites par des push automatiques (OpenHands, etc.)
export async function GET(req: Request) {
  const authError = requireCmsAuth(req as never);
  if (authError) return authError;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });

  const sb = createClient(url, key);

  const fixes: string[] = [];

  // Fix "booze" → "boulot"
  const { data: boozeRows } = await sb
    .from('site_content')
    .select('id, page, block_key, value')
    .ilike('value', '%booze%');

  for (const row of boozeRows || []) {
    const newVal = row.value.replace(/au booze et ailleurs/gi, 'au boulot et ailleurs').replace(/au booze/gi, 'au boulot');
    await sb.from('site_content').update({ value: newVal }).eq('id', row.id);
    fixes.push(`site_content[${row.page}.${row.block_key}]: "booze" → "boulot"`);
  }

  return NextResponse.json({ success: true, fixes, total: fixes.length });
}
