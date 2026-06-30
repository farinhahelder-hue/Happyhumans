import { NextRequest, NextResponse } from 'next/server';
import { requireCmsAuth } from '@/lib/cms-auth';
import { getSupabaseServer } from '@/lib/supabase-server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
  return getSupabaseServer();
}

// Check auth - accept cookie OR x-cms-auth header
function checkAuth(req: NextRequest) {
  const authHeader = req.headers.get('x-cms-auth');
  const cmsPassword = process.env.CMS_PASSWORD;
  
  if (authHeader) {
    if (cmsPassword && authHeader === cmsPassword) {
      return null; // Valid
    }
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
  }
  
  return requireCmsAuth(req);
}

export async function POST(req: NextRequest) {
  const authError = checkAuth(req);
  if (authError) return authError;

  const sb = getSupabase();
  if (!sb) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string || 'articles';

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
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

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
