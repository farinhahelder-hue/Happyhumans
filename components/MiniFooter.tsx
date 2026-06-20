'use client'
import Link from 'next/link'

export default function MiniFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t px-6 py-10 md:px-10"
      style={{ backgroundColor: '#1e3a34', borderColor: '#2d5f54' }}>
      <div className="mx-auto max-w-4xl flex flex-col items-center justify-between gap-6 md:flex-row">

        {/* Logo footer */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <Link href="/" className="transition"
            style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif', fontSize: '1.1rem', letterSpacing: '0.08em', color: '#f5f0e8', fontWeight: 400 }}>
            HAPPY HUMANS
          </Link>
          <span className="text-xs italic" style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.08em' }}>
            philo-coaching
          </span>
          <p className="text-xs mt-1" style={{ color: '#5a7a74' }}>
            by Monica Schneider
          </p>
        </div>

        {/* Copyright */}
        <p className="text-xs text-center" style={{ color: '#5a7a74' }}>
          © {year} Happy Humans — Monica Schneider. Tous droits réservés.
        </p>

        {/* Liens légaux */}
        <div className="flex gap-6 text-xs" style={{ color: '#5a7a74' }}>
          <Link href="/mentions-legales" className="transition hover:text-white" style={{ color: '#5a7a74' }}>
            Mentions légales
          </Link>
          <Link href="/politique-confidentialite" className="transition hover:text-white" style={{ color: '#5a7a74' }}>
            Confidentialité
          </Link>
        </div>

      </div>

      {/* Divider doré */}
      <div className="mx-auto mt-8 w-16 h-px" style={{ backgroundColor: '#c9a96e', opacity: 0.4 }} />
    </footer>
  )
}
