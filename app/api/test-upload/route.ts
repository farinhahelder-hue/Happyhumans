import { NextResponse } from 'next/server';
import { requireCmsAuth } from '@/lib/cms-auth';

export async function GET(req: Request) {
  // Route d'administration : réservée aux sessions CMS authentifiées (avant : ouverte à tout le monde)
  const authError = requireCmsAuth(req);
  if (authError) return authError;

  return NextResponse.json({ 
    ok: true, 
    message: 'Test endpoint working',
    env: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasCmsPassword: !!process.env.CMS_PASSWORD,
    }
  });
}
