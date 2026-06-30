import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { createHmac } from 'node:crypto';

const CMS_SESSION_COOKIE = 'happyhumans_cms_session';

function getSessionSecret() {
  const secret = process.env.CMS_SESSION_SECRET?.trim();
  return secret ? secret : (process.env.CMS_PASSWORD?.trim() || null);
}

function parseSessionPayload(token: string, secret: string): { exp: number; iat: number; sid: string } | null {
  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return null;

  const expectedSignature = createHmac('sha256', secret).update(encodedPayload).digest('hex');
  if (signature !== expectedSignature) return null;

  try {
    const normalized = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
    const padding = (4 - (normalized.length % 4)) % 4;
    const decoded = Buffer.from(`${normalized}${'='.repeat(padding)}`, 'base64').toString('utf8');
    const payload = JSON.parse(decoded);

    if (payload.exp && payload.iat && Math.floor(Date.now() / 1000) < payload.exp) {
      return { exp: payload.exp, iat: payload.iat, sid: payload.sid };
    }
  } catch {}
  return null;
}

function isCmsUser(): boolean {
  try {
    const cookieStore = cookies();
    const editCookie = cookieStore.get('hh_cms_edit');
    if (editCookie?.value === '1') return true;

    const sessionCookie = cookieStore.get(CMS_SESSION_COOKIE);
    if (!sessionCookie?.value) return false;

    const secret = getSessionSecret();
    if (!secret) return false;

    return !!parseSessionPayload(sessionCookie.value, secret);
  } catch {
    return false;
  }
}

async function isMaintenanceMode(): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;
  try {
    const supabase = createClient(url, key);
    const { data } = await supabase
      .from('site_content')
      .select('value')
      .eq('page', 'settings')
      .eq('block_key', 'maintenance_mode')
      .single();
    return data?.value === 'true';
  } catch {
    return false;
  }
}

export default async function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const maintenance = await isMaintenanceMode();
  // Allow CMS users to bypass maintenance mode
  if (maintenance && !isCmsUser()) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center', maxWidth: 480, padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🔧</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#2d5f54', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
            Site en maintenance
          </h1>
          <p style={{ color: '#78716c', fontSize: '1rem', lineHeight: 1.6 }}>
            Happyhumans.fr est actuellement en cours de mise à jour.<br />
            Nous revenons très vite !
          </p>
          <p style={{ color: '#a8a29e', fontSize: '0.85rem', marginTop: '2rem' }}>
            💬 Besoin d&apos;aide ? Écrivez à{' '}
            <a href="mailto:happyhumans.coaching@gmail.com" style={{ color: '#2d5f54' }}>
              happyhumans.coaching@gmail.com
            </a>
          </p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
