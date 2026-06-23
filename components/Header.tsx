'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@supabase/supabase-js'
import { useCmsContent } from '@/hooks/useCmsContent'

function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

const NAV_DEFAULTS = {
  label_apropos:      'Monica',
  label_coaching:     'Coaching',
  label_entreprises:  'Entreprises',
  label_relations:    'Relations',
  label_temoignages:  'Témoignages',
  label_contact:      'Contact',
  label_cta:          'Réserver une séance',
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const { user, loading } = useAuth()
  const [logoUrl, setLogoUrl] = useState<string>('/logo-happy-humans.jpg')
  const [siteName, setSiteName] = useState('Happy Humans')
  const nav = useCmsContent('navigation', NAV_DEFAULTS)

  const accountHref = !loading && user ? '/dashboard' : '/auth/login'
  const accountLabel = !loading && user ? 'CMS' : 'Connexion'

  useEffect(() => {
    const sb = getSupabaseBrowser()
    if (!sb) return
    sb.from('cms_settings_kv')
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

  const navLinks = [
    { href: '/a-propos',    label: nav.label_apropos },
    { href: '/coaching',    label: nav.label_coaching },
    { href: '/entreprises', label: nav.label_entreprises },
    { href: '/relations',   label: nav.label_relations },
    { href: '/temoignages', label: nav.label_temoignages },
    { href: '/contact',     label: nav.label_contact },
  ]

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-stone-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3 transition-colors duration-200" aria-label={`${siteName} accueil`}>
            <Image src={logoUrl} alt={siteName} width={44} height={44} className="rounded-full object-cover" style={{ height: 44, width: 44 }} />
            <span className="text-xl font-serif font-bold tracking-tight text-stone-900">{siteName}</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="text-sm font-medium text-stone-600 transition-colors duration-200 hover:text-amber-900">
                {link.label}
              </Link>
            ))}
            <Link href="/booking"
              className="rounded-full bg-amber-900 px-4 py-1.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-amber-800">
              {nav.label_cta}
            </Link>
            <Link href={accountHref}
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors duration-200">
              {accountLabel}
            </Link>
          </div>

          {/* Mobile burger */}
          <button onClick={() => setOpen(!open)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg md:hidden"
            aria-label="Menu">
            <span className={`block h-0.5 w-5 bg-stone-700 transition-transform duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-5 bg-stone-700 transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-stone-700 transition-transform duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-stone-100 bg-white px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                  className="text-sm font-medium text-stone-700 hover:text-amber-900 py-1">
                  {link.label}
                </Link>
              ))}
              <Link href="/booking" onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-amber-900 px-4 py-2 text-sm font-medium text-white text-center hover:bg-amber-800">
                {nav.label_cta}
              </Link>
              <Link href={accountHref} onClick={() => setOpen(false)}
                className="text-xs text-center text-stone-400 hover:text-stone-600">
                {accountLabel}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
