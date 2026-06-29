import { NextResponse } from 'next/server';
import { createHmac, randomBytes } from 'node:crypto';
import { requireCmsAuth } from '@/lib/cms-auth';

function getEditSecret(): string | null {
  return process.env.CMS_HMAC_SECRET?.trim()
    || process.env.CMS_SESSION_SECRET?.trim()
    || process.env.CMS_PASSWORD?.trim()
    || null;
}

export async function GET(req: Request) {
  const authError = requireCmsAuth(req);
  if (authError) return authError;

  const secret = getEditSecret();
  if (!secret) {
    return NextResponse.json(
      { error: 'Aucune clé secrète configurée pour l\'édition inline.' },
      { status: 503 }
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const payload = JSON.stringify({ exp: now + 300, iat: now, jit: randomBytes(8).toString('hex') });
  const encoded = Buffer.from(payload, 'utf8').toString('base64url');
  const signature = createHmac('sha256', secret).update(encoded).digest('hex');

  return NextResponse.json({ token: `${encoded}.${signature}` });
}
