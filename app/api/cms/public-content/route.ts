import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// GET /api/cms/public-content?page=home&locale=fr|en
// Endpoint public (pas d'auth) — lecture seule du contenu CMS pour les pages publiques.
// Convention bilingue : la valeur anglaise d'un champ `x` est stockée sous la clé
// `x::en`. En `locale=en`, on renvoie la valeur EN si présente, sinon la FR
// (repli), le tout sous la clé de base — le client n'a pas à connaître la locale.
const EN_SUFFIX = '::en';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page');
  const locale = searchParams.get('locale') === 'en' ? 'en' : 'fr';
  if (!page) return NextResponse.json({ content: [] });

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });

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

  const clean = (value: string) =>
    value
      ?.replace(/au booze et ailleurs/gi, 'au boulot et ailleurs')
      ?.replace(/au booze/gi, 'au boulot');

  // Sépare les valeurs FR (clé de base) des valeurs EN (clé `...::en`).
  const fr: Record<string, string> = {};
  const en: Record<string, string> = {};
  for (const row of (data || []) as { block_key: string; value: string }[]) {
    if (row.block_key.endsWith(EN_SUFFIX)) {
      en[row.block_key.slice(0, -EN_SUFFIX.length)] = row.value;
    } else {
      fr[row.block_key] = row.value;
    }
  }

  const keys = new Set([...Object.keys(fr), ...Object.keys(en)]);
  const content = [...keys]
    .map((key) => {
      const value = locale === 'en' ? en[key] ?? fr[key] : fr[key];
      return value != null ? { block_key: key, value: clean(value) } : null;
    })
    .filter(Boolean);

  return NextResponse.json(
    { content },
    { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } }
  );
}
