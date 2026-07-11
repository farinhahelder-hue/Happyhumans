import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Appelé par Vercel Cron (vercel.json) une fois par jour.
// Une simple lecture suffit à compter comme "activité" pour Supabase
// et empêche la mise en pause automatique du free tier après 7 jours.
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ ok: false, error: 'Supabase non configuré' }, { status: 503 });
  }

  const supabase = createClient(url, key);
  try {
    const { error } = await supabase
      .from('site_content')
      .select('id', { count: 'exact', head: true })
      .limit(1);
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 503 });
    }
    return NextResponse.json({ ok: true, pinged_at: new Date().toISOString() });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'Erreur inconnue' },
      { status: 503 }
    );
  }
}
