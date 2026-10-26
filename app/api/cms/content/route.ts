import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireCmsAuth } from '@/lib/cms-auth';
import { revalidatePath } from 'next/cache';
import { pagePath } from '@/lib/page-seo';
import { draftPage } from '@/lib/cms-drafts';

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// GET /api/cms/content?page=home
// Sans `page` : toutes les lignes, brouillons compris (page = « draft:<page> ») — c'est ce qu'utilise l'admin.
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

function describeError(error: { code?: string; message?: string }) {
  let detail = error.message;
  if (error.code === '23505') detail = 'Doublon détecté — cette clé existe déjà';
  else if (error.code === '42501') detail = 'Droits insuffisants — vérifiez la clé service_role Supabase';
  else if (error.message?.includes('does not exist')) detail = `Table 'site_content' introuvable — exécutez la migration SQL`;
  return detail;
}

// PUT /api/cms/content body: { page, block_key, value, draft?, reset? }
//   sans `draft`         : écrit directement EN LIGNE (édition en ligne historique)
//   draft: true          : écrit dans le brouillon (page « draft:<page> »), invisible du site public
//   draft: true, reset   : retire ce champ du brouillon (il est revenu à sa valeur publiée)
export async function PUT(req: NextRequest) {
  const supabase = getSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });
  const authError = requireCmsAuth(req);
  if (authError) return authError;

  const body = await req.json();
  const { page, block_key, value, draft, reset } = body;
  if (!page || block_key === undefined || block_key === null) {
    return NextResponse.json({ error: 'page et block_key requis' }, { status: 400 });
  }

  if (draft) {
    const target = draftPage(page);
    if (reset) {
      const { error } = await supabase.from('site_content').delete().eq('page', target).eq('block_key', block_key);
      if (error) return NextResponse.json({ error: describeError(error), code: error.code }, { status: 500 });
      return NextResponse.json({ success: true, reset: true });
    }
    const { data, error } = await supabase
      .from('site_content')
      .upsert({ page: target, block_key, value: value ?? '' }, { onConflict: 'page,block_key' })
      .select()
      .single();
    if (error) {
      // 23514 = une contrainte CHECK de la base refuse la page « draft:… » : les brouillons ne sont pas disponibles ici
      return NextResponse.json(
        { error: describeError(error), code: error.code, draftUnsupported: error.code === '23514' },
        { status: 500 },
      );
    }
    return NextResponse.json({ success: true, data });
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
    return NextResponse.json({ error: describeError(error), code: error.code }, { status: 500 });
  }
  // Une écriture directe en ligne est la plus récente : elle remplace un éventuel brouillon du même champ
  // (sinon « Publier » écraserait plus tard cette modification avec une version plus ancienne).
  try { await supabase.from('site_content').delete().eq('page', draftPage(page)).eq('block_key', block_key); } catch { /* sans incidence */ }
  // Une écriture directe change la page publique : on la régénère tout de suite, sinon le texte (ou le SEO,
  // calculé côté serveur) resterait l'ancien jusqu'à 5 minutes sur un site en cache.
  try { revalidatePath(pagePath(page)); } catch { /* sans incidence : la page se régénère au plus tard dans 5 min */ }
  return NextResponse.json({ success: true, data });
}
