import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ items: [] });

  const { data } = await supabase
    .from('temoignages')
    .select('id, nom, role, texte, photo_url, note')
    .eq('visible', true)
    .order('sort_order', { ascending: true });

  return NextResponse.json({ items: data || [] });
}
