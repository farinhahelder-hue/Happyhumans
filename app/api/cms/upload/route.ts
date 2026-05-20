import { NextRequest, NextResponse } from 'next/server';
import { requireCmsAuth } from '@/lib/cms-auth';
import { getSupabaseServer } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

function getSupabase() {
  return getSupabaseServer();
}

export async function GET(req: NextRequest) {
  const sb = getSupabase();
  if (!sb) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });
  const authError = requireCmsAuth(req);
  if (authError) return authError;
  return NextResponse.json({ ok: true, message: 'API route' });
}

export async function POST(req: NextRequest) {
  const sb = getSupabase();
  if (!sb) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });
  const authError = requireCmsAuth(req);
  if (authError) return authError;
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const sb = getSupabase();
  if (!sb) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });
  const authError = requireCmsAuth(req);
  if (authError) return authError;
  return NextResponse.json({ ok: true });
}
