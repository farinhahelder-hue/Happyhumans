import { NextRequest, NextResponse } from 'next/server'

function getSecret(): string {
  return (
    process.env.CMS_HMAC_SECRET?.trim() ||
    process.env.CMS_SESSION_SECRET?.trim() ||
    process.env.CMS_PASSWORD?.trim() ||
    ''
  )
}

function hex(buf: Uint8Array): string {
  return Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function verifySignature(data: string, signature: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    const expected = hex(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(data))))
    return expected === signature
  } catch { return false }
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Check ?cms_edit_token=... param (passed from CMS admin via generate-edit-token)
  const tokenFromParam = req.nextUrl.searchParams.get('cms_edit_token')
  if (tokenFromParam) {
    const secret = getSecret()
    const parts = tokenFromParam.split('.')
    const valid = parts.length === 2 && !!secret && await verifySignature(parts[0], parts[1], secret)

    if (valid) {
      try {
        const payload = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')))
        if (payload?.exp && Math.floor(Date.now() / 1000) < payload.exp) {
          const url = req.nextUrl.clone()
          url.searchParams.delete('cms_edit_token')
          const redirectRes = NextResponse.redirect(url)
          redirectRes.cookies.set('hh_cms_edit', '1', {
            httpOnly: false,
            sameSite: 'lax',
            maxAge: 60 * 60 * 2,
            path: '/',
          })
          return redirectRes
        }
      } catch { /* invalid payload */ }
    }
    // Token invalid — redirect without setting cookie
    const url = req.nextUrl.clone()
    url.searchParams.delete('cms_edit_token')
    return NextResponse.redirect(url)
  }

  // Carry forward existing hh_cms_edit flag
  const editCookie = req.cookies.get('hh_cms_edit')
  if (editCookie?.value === '1') {
    res.headers.set('x-cms-edit', '1')
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
