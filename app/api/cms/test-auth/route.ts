import { NextRequest, NextResponse } from 'next/server';
import { getCmsAuthStatus } from '@/lib/cms-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const status = getCmsAuthStatus(req);
  const envPwd = process.env.CMS_PASSWORD;
  const headerAuth = req.headers.get('x-cms-auth');

  return NextResponse.json({
    status,
    headerReceived: !!headerAuth,
    headerValue: headerAuth ? '***' + headerAuth.slice(-3) : null,
    envPwdSet: !!envPwd,
    envPwdLength: envPwd?.length || 0,
    match: headerAuth ? headerAuth === envPwd : null,
  });
}
