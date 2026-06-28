'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/components/AuthProvider'
import { useCmsContent } from '@/hooks/useCmsContent'

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
  const [open, setOpen]         = useState(false)  // mobile menu
  const [dropOpen, setDropOpen] = useState(false)   // coaching dropdown desktop
  const [mobileCoach, setMobileCoach] = useState(false) // coaching sub on mobile
  const dropRef = useRef<HTMLDivElement>(null)
  const { user, loading } = useAuth()
  const [logoUrl, setLogoUrl]   = useState<string>('/logo-happy-humans.jpg')
  const [siteName, setSiteName] = useState('Happy Humans')
  const [logoSize, setLogoSize] = useState(44)
  const nav = useCmsContent('navigation', NAV_DEFAULTS)

  const isCmsUser = !loading && !!user

  useEffect(() => {
    fetch('/api/cms/public-settings')
      .then(r => r.ok ? r.json() : { settings: {} })
      .then(({ settings }) => {
        if (settings.logo_url)  setLogoUrl(settings.logo_url)
        if (settings.site_name) setSiteName(settings.site_name)
        if (settings.logo_size) setLogoSize(Number(settings.logo_size) || 44)
      })
      .catch(() => {})
  }, [])

  // Fermer le dropdown si clic hors
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const topLinksLeft  = [{ href: '/a-propos', label: nav.label_apropos }]
  const topLinksRight = [
    { href: '/relations',   label: nav.label_relations },
    { href: '/entreprises', label: nav.label_entreprises },
    { href: '/contact',     label: nav.label_contact },
  ]

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-stone-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 transition-colors duration-200" aria-label={`${siteName} accueil`}>
            <Image src={logoUrl} alt={siteName} width={logoSize} height={logoSize}
              className="rounded-full object-cover" style={{ height: logoSize, width: logoSize }} />
            <span className="text-xl font-serif font-bold tracking-tight text-stone-900">{siteName}</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 md:flex">

            {topLinksLeft.map(link => (
              <Link key={link.href} href={link.href}
                className="text-sm font-medium text-stone-600 transition-colors duration-200 hover:text-[#2d5f54]">
                {link.label}
              </Link>
            ))}

            {/* Coaching dropdown */}
            <div ref={dropRef} className="relative">
              <button
                onMouseEnter={() => setDropOpen(true)}
                onClick={() => setDropOpen(d => !d)}
                className="flex items-center gap-1 text-sm font-medium text-stone-600 transition-colors duration-200 hover:text-[#2d5f54]"
              >
                {nav.label_coaching}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {dropOpen && (
                <div
                  onMouseLeave={() => setDropOpen(false)}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 rounded-xl border border-stone-100 bg-white shadow-lg overflow-hidden z-50"
                >
                  <Link href="/coaching" onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-stone-700 hover:bg-[#f5f0e8] hover:text-[#2d5f54] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
                    {nav.label_coaching}
                  </Link>
                  <div className="mx-3 h-px bg-stone-100" />
                  <Link href="/temoignages" onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-stone-700 hover:bg-[#f5f0e8] hover:text-[#2d5f54] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    {nav.label_temoignages}
                  </Link>
                </div>
              )}
            </div>

            {topLinksRight.map(link => (
              <Link key={link.href} href={link.href}
                className="text-sm font-medium text-stone-600 transition-colors duration-200 hover:text-[#2d5f54]">
                {link.label}
              </Link>
            ))}

            {/* CTA */}
            <Link href="/booking"
              className="rounded-full bg-[#2d5f54] px-4 py-1.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#1e3a34]">
              {nav.label_cta}
            </Link>

            {isCmsUser && (
              <Link href="/cms-admin" className="text-xs text-stone-400 hover:text-stone-600 transition-colors duration-200">
                CMS
              </Link>
            )}
          </div>

          {/* Burger */}
          <button onClick={() => { setOpen(!open); setMobileCoach(false) }}
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
            <div className="flex flex-col gap-1">
              {[...topLinksLeft].map(link => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                  className="text-sm font-medium text-stone-700 hover:text-[#2d5f54] py-2.5 border-b border-stone-50">
                  {link.label}
                </Link>
              ))}

              {/* Coaching sous-menu mobile */}
              <button
                onClick={() => setMobileCoach(c => !c)}
                className="flex items-center justify-between text-sm font-medium text-stone-700 hover:text-[#2d5f54] py-2.5 border-b border-stone-50 w-full text-left"
              >
                {nav.label_coaching}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform duration-200 ${mobileCoach ? 'rotate-180' : ''}`}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {mobileCoach && (
                <div className="ml-4 flex flex-col gap-0 border-l-2 border-[#2d5f54]/20 pl-3 mb-1">
                  <Link href="/coaching" onClick={() => setOpen(false)}
                    className="text-sm text-stone-600 hover:text-[#2d5f54] py-2">
                    {nav.label_coaching}
                  </Link>
                  <Link href="/temoignages" onClick={() => setOpen(false)}
                    className="text-sm text-stone-600 hover:text-[#2d5f54] py-2">
                    {nav.label_temoignages}
                  </Link>
                </div>
              )}

              {topLinksRight.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                  className="text-sm font-medium text-stone-700 hover:text-[#2d5f54] py-2.5 border-b border-stone-50">
                  {link.label}
                </Link>
              ))}

              <Link href="/booking" onClick={() => setOpen(false)}
                className="mt-3 rounded-full bg-[#2d5f54] px-4 py-2.5 text-sm font-medium text-white text-center hover:bg-[#1e3a34]">
                {nav.label_cta}
              </Link>
              {isCmsUser && (
                <Link href="/cms-admin" onClick={() => setOpen(false)}
                  className="text-xs text-center text-stone-400 hover:text-stone-600 mt-2">
                  CMS
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
