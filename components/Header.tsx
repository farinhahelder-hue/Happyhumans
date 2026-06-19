'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@supabase/supabase-js'

function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const { user, loading } = useAuth()
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [siteName, setSiteName] = useState('Happy Humans')

  const accountHref = !loading && user ? '/dashboard' : '/auth/login'
  const accountLabel = !loading && user ? 'CMS' : 'Connexion'

  useEffect(() => {
    const sb = getSupabaseBrowser()
    if (!sb) return
    sb.from('cms_settings')
      .select('key, value')
      .in('key', ['logo_url', 'site_name'])
      .then(({ data }) => {
        if (!data) return
        data.forEach((row: { key: string; value: string }) => {
          if (row.key === 'logo_url' && row.value) setLogoUrl(row.value)
          if (row.key === 'site_name' && row.value) setSiteName(row.value)
        })
      })
  }, [])

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-stone-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-amber-900 transition-colors duration-200 hover:text-amber-700"
            aria-label={`${siteName} accueil`}
          >
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} style={{ height: 38, width: 'auto', objectFit: 'contain' }} />
            ) : (
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
                <circle cx="17" cy="17" r="16" stroke="currentColor" strokeWidth="1.2" />
                <line x1="10" y1="9" x2="10" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="24" y1="9" x2="24" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="10" y1="15.5" x2="24" y2="15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8 26 Q11 24 14 26 Q17 28 20 26 Q23 24 26 26" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />
              </svg>
            )}
            <span className="text-xl font-serif font-bold tracking-tight">{siteName}</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link href="/a-propos" className="text-sm font-medium text-stone-600 transition-colors duration-200 hover:text-amber-900">
              Monica
            </Link>
            <Link href="/coaching" className="text-sm font-medium text-stone-600 transition-colors duration-200 hover:text-amber-900">
              Coaching
            </Link>
            <Link href="/entreprises" className="text-sm font-medium text-stone-600 transition-colors duration-200 hover:text-amber-900">
              Entreprises
            </Link>
            <Link href="/relations" className="text-sm font-medium text-stone-600 transition-colors duration-200 hover:text-amber-900">
              Relations
            </Link>
            <Link href="/temoignages" className="text-sm font-medium text-stone-600 transition-colors duration-200 hover:text-amber-900">
              Témoignages
            </Link>
            <Link href="/blog" className="text-sm font-medium text-stone-600 transition-colors duration-200 hover:text-amber-900">
              Blog
            </Link>
            <Link href="/contact" className="text-sm font-medium text-stone-600 transition-colors duration-200 hover:text-amber-900">
              Contact
            </Link>
            <Link href={accountHref} className="rounded-full bg-amber-900 px-4 py-1.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-amber-800">
              {accountLabel}
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg md:hidden"
            aria-label="Menu"
          >
            <span className={`block h-0.5 w-5 bg-stone-700 transition-transform duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-5 bg-stone-700 transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-stone-700 transition-transform duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-stone-100 bg-white px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {[
                { href: '/a-propos', label: 'Monica' },
                { href: '/coaching', label: 'Coaching' },
                { href: '/entreprises', label: 'Entreprises' },
                { href: '/relations', label: 'Relations' },
                { href: '/temoignages', label: 'Témoignages' },
                { href: '/blog', label: 'Blog' },
                { href: '/booking', label: 'Réserver' },
    { href: '/contact', label: 'Contact' },
              ].map(link => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                  className="text-sm font-medium text-stone-700 hover:text-amber-900 py-1">
                  {link.label}
                </Link>
              ))}
              <Link href={accountHref} onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-amber-900 px-4 py-2 text-sm font-medium text-white text-center hover:bg-amber-800">
                {accountLabel}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
