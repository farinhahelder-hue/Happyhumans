import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCmsAuthStatus } from '@/lib/cms-auth';
import { draftPage, overlayDrafts } from '@/lib/cms-drafts';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// GET /api/cms/public-content?page=home
// Endpoint public (pas d'auth) — lecture seule du contenu CMS pour les pages publiques.
//
// ?preview=1 : ajoute les BROUILLONS par-dessus le contenu publié. Réservé aux sessions CMS authentifiées
// (cookie de session ou mode édition) ; pour tout autre visiteur le paramètre est ignoré : il ne voit que le publié.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page');
  if (!page) return NextResponse.json({ content: [] });

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });

  const wantsPreview = searchParams.get('preview') === '1' && getCmsAuthStatus(req) === 'ok';

  let data, error;
  try {
    ({ data, error } = await supabase
      .from('site_content')
      .select('block_key, value')
      .eq('page', page));
  } catch (e) {
    error = e;
  }

  // Base en erreur (ex: projet Supabase en pause) → 503 pour que le client
  // conserve son cache local au lieu de l'écraser avec du vide
  if (error) {
    return NextResponse.json(
      { error: 'Base de données indisponible' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  let rows = (data || []) as { block_key: string; value: string }[];
  let draftCount = 0;
  if (wantsPreview) {
    try {
      const { data: drafts } = await supabase.from('site_content').select('block_key, value').eq('page', draftPage(page));
      const d = (drafts || []) as { block_key: string; value: string }[];
      draftCount = d.length;
      rows = overlayDrafts(rows, d);
    } catch {
      /* brouillons indisponibles : on affiche le publié */
    }
  }

  // Sanitisation : corriger les typos introduites par des push automatiques
  const sanitized = rows.map((row: { block_key: string; value: string }) => ({
    ...row,
    value: row.value
      ?.replace(/au booze et ailleurs/gi, 'au boulot et ailleurs')
      ?.replace(/au booze/gi, 'au boulot'),
  }));

  // Aperçu : jamais mis en cache (ni CDN ni navigateur). Public : cache court comme avant.
  return NextResponse.json(
    wantsPreview ? { content: sanitized, drafts: draftCount, preview: true } : { content: sanitized },
    { headers: { 'Cache-Control': wantsPreview ? 'no-store' : 'public, s-maxage=30, stale-while-revalidate=60' } }
  );
}
