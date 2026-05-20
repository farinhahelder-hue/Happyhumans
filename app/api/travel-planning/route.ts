import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const sb = getSupabaseServer();
  if (!sb) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  const sb = getSupabaseServer();
  if (!sb) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });
  return NextResponse.json({ ok: true });
}
