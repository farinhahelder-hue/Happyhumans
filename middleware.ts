import { NextRequest, NextResponse } from 'next/server'

function getSecret(): string {
  return (
    process.env.CMS_SESSION_SECRET?.trim() ||
    process.env.CMS_PASSWORD?.trim() ||
    ''
  )
}

function base64UrlDecode(value: string): string {
  const padding = (4 - (value.length % 4)) % 4
  return Buffer.from(value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(padding), 'base64').toString('utf8')
}

function isSessionValid(token: string, secret: string): boolean {
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [encodedPayload, signature] = parts
  const { createHmac, timingSafeEqual } = require('crypto')
  const expectedSig = createHmac('sha256', secret).update(encodedPayload).digest('hex')
  try {
    const a = Buffer.from(signature)
    const b = Buffer.from(expectedSig)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false
  } catch { return false }
  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload))
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return false
    return true
  } catch { return false }
}

export function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // 1. Check URL param ?cms_edit_token=... (passed from CMS admin)
  const tokenFromParam = req.nextUrl.searchParams.get('cms_edit_token')
  if (tokenFromParam) {
    const secret = getSecret()
    if (secret && isSessionValid(tokenFromParam, secret)) {
      res.cookies.set('hh_cms_edit', '1', {
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 2, // 2h
        path: '/',
      })
      // Remove the token from the URL (redirect without param)
      const url = req.nextUrl.clone()
      url.searchParams.delete('cms_edit_token')
      return NextResponse.redirect(url)
    }
  }

  // 2. Carry forward the hh_cms_edit flag via header for server components
  const editCookie = req.cookies.get('hh_cms_edit')
  if (editCookie?.value === '1') {
    res.headers.set('x-cms-edit', '1')
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
