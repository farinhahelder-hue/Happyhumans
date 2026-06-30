import { NextRequest, NextResponse } from 'next/server';
import { requireCmsAuth } from '@/lib/cms-auth';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const cmsPassword = process.env.CMS_PASSWORD;

  console.log('[DEBUG upload] Start', { hasUrl: !!url, hasKey: !!key, hasPassword: !!cmsPassword });

  if (!url || !key) {
    console.error('[DEBUG upload] Supabase credentials missing:', { url: !!url, key: !!key });
    return NextResponse.json({ error: 'Supabase non configuré', message: 'NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant' }, { status: 500 });
  }

  const authError = requireCmsAuth(req);
  if (authError) {
    console.log('[DEBUG upload] Auth failed. Cookies:', req.headers.get('cookie'));
    return NextResponse.json({ error: 'Non autorisé', message: 'Session CMS invalide ou expirée' }, { status: 401 });
  }

  try {
    const sb = createClient(url, key);

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Type de fichier non autorisé' }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024; // 5 Mo
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max 5 Mo)' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `uploads/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // First ensure the bucket exists
    const { data: bucketData, error: bucketError } = await sb.storage.getBucket('cms-assets');
    if (bucketError) {
      // Try to create the bucket
      const { error: createError } = await sb.storage.createBucket('cms-assets', { public: true });
      if (createError) {
        console.error('Bucket creation error:', createError);
        return NextResponse.json({ error: 'Bucket non accessible: ' + createError.message }, { status: 500 });
      }
    }

    const { data, error } = await sb.storage
      .from('cms-assets')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json({ error: 'Échec de l\'upload: ' + error.message }, { status: 500 });
    }

    const { data: publicData } = sb.storage.from('cms-assets').getPublicUrl(fileName);

    return NextResponse.json({ url: publicData.publicUrl });
  } catch (err: any) {
    console.error('Upload exception:', err);
    return NextResponse.json({ error: 'Erreur lors de l\'upload: ' + (err?.message || 'Inconnu') }, { status: 500 });
  }
}
