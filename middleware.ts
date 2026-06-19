import { NextRequest, NextResponse } from 'next/server'

// Pages accessibles en mode maintenance
const ALLOWED = [
  '/',
  '/relations',
  '/booking',
  '/contact',
  '/mentions-legales',
  '/politique-confidentialite',
  '/test-attachement',
  '/cms-admin',
  '/merci',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Toujours laisser passer : API, assets, _next, fichiers statiques
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.') ||
    ALLOWED.some(p => pathname === p || pathname.startsWith(p + '/'))
  ) {
    return NextResponse.next()
  }

  // Tout le reste → redirection vers la landing page
  return NextResponse.redirect(new URL('/', req.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
