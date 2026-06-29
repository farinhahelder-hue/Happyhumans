import { NextRequest, NextResponse } from 'next/server'

const INLINE_EDIT_COOKIE = 'hh_cms_edit'
const INLINE_READY_COOKIE = 'hh_cms_inline_ready'

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

function base64UrlDecode(value: string): string {
  const padding = (4 - (value.length % 4)) % 4
  const normalized = `${value}${'='.repeat(padding)}`
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  return atob(normalized)
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

  // Check ?cms_edit_token=... param (passed from CMS admin)
  const tokenFromParam = req.nextUrl.searchParams.get('cms_edit_token')
  if (tokenFromParam) {
    const secret = getSecret()
    const parts = tokenFromParam.split('.')

    if (parts.length === 2 && secret) {
      const valid = await verifySignature(parts[0], parts[1], secret)

      if (valid) {
        try {
          const payload = JSON.parse(base64UrlDecode(parts[0]))
          if (payload?.exp && Math.floor(Date.now() / 1000) < payload.exp) {
            const url = req.nextUrl.clone()
            url.searchParams.delete('cms_edit_token')
            // Set cookie on the redirect response itself (not on discarded res)
            const redirectRes = NextResponse.redirect(url)
            // Short-lived activation cookie (2h) — triggers inline editor UI
            redirectRes.cookies.set(INLINE_EDIT_COOKIE, '1', {
              maxAge: 60 * 60 * 2,
              path: '/',
              sameSite: 'lax',
              secure: true,
              httpOnly: false,
            })
            // Long-lived readiness cookie (7d) — used by API auth to allow writes
            redirectRes.cookies.set(INLINE_READY_COOKIE, '1', {
              maxAge: 60 * 60 * 24 * 7,
              path: '/',
              sameSite: 'lax',
              secure: true,
              httpOnly: false,
            })
            return redirectRes
          }
        } catch { /* invalid payload */ }
      }
    }

    // Token invalid or secret missing — strip param and continue without cookie
    const url = req.nextUrl.clone()
    url.searchParams.delete('cms_edit_token')
    return NextResponse.redirect(url)
  }

  // Carry forward inline-edit state as a request header (API routes can't read
  // response-set cookies, so we forward it as a header the API can check)
  const editCookie = req.cookies.get(INLINE_EDIT_COOKIE)
  if (editCookie?.value === '1') {
    res.headers.set('x-cms-edit', '1')
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
