import { NextRequest, NextResponse } from 'next/server';
import { requireCmsAuth } from '@/lib/cms-auth';
import { getSupabaseServer } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const authError = requireCmsAuth(req);
  if (authError) return authError;

  const sb = getSupabaseServer();
  if (!sb) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string | null) || 'articles';

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: `Type ${file.type} non autorisé` }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10 Mo
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max 10 Mo)' }, { status: 400 });
    }

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${folder}/${Date.now()}-${sanitizedName}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await sb.storage
      .from('cms-assets')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json({ error: `Échec de l'upload: ${error.message}` }, { status: 500 });
    }

    const { data: publicData } = sb.storage.from('cms-assets').getPublicUrl(fileName);

    return NextResponse.json({ url: publicData.publicUrl });
  } catch (err) {
    console.error('Upload exception:', err);
    return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 });
  }
}
