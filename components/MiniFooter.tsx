'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULTS = {
  site_name:  'Happy Humans',
  tagline:    'philo-coaching',
  copyright:  'Happy Humans — Monica Schneider. Tous droits réservés.',
  logo_url:   '/logo-happy-humans.jpg',
}

export default function MiniFooter() {
  const c = useCmsContent('footer', DEFAULTS)
  const year = new Date().getFullYear()
  const logo = c.logo_url || '/logo-happy-humans.jpg'
  return (
    <footer className="border-t px-6 py-10 md:px-10"
      style={{ backgroundColor: '#1e3a34', borderColor: '#2d5f54' }}>
      <div className="mx-auto max-w-4xl flex flex-col items-center justify-between gap-6 md:flex-row">

        <div className="flex items-center gap-3">
          <Link href="/" className="transition">
            <Image src={logo} alt={c.site_name} width={36} height={36} className="rounded-full object-cover" />
          </Link>
          <div className="flex flex-col">
            <Link href="/" className="transition"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', letterSpacing: '0.08em', color: '#f5f0e8', fontWeight: 400 }}>
              {c.site_name.toUpperCase()}
            </Link>
            <span className="text-xs italic" style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.08em' }}>
              {c.tagline}
            </span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs" style={{ color: '#5a7a74' }}>© {year} {c.copyright}</p>
          <p className="text-xs opacity-40 mt-1" style={{ color: '#5a7a74' }}>Photos : <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a></p>
        </div>

        <div className="flex gap-6 text-xs" style={{ color: '#5a7a74' }}>
          <Link href="/mentions-legales" className="transition hover:text-white" style={{ color: '#5a7a74' }}>Mentions légales</Link>
          <Link href="/politique-confidentialite" className="transition hover:text-white" style={{ color: '#5a7a74' }}>Confidentialité</Link>
        </div>

      </div>
      <div className="mx-auto mt-8 w-16 h-px" style={{ backgroundColor: '#c9a96e', opacity: 0.4 }} />
    </footer>
  )
}
