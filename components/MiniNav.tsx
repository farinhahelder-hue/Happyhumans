'use client'
import Link from 'next/link'

export default function MiniNav() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b px-6 py-4 backdrop-blur-sm md:px-10"
      style={{ 
        backgroundColor: 'rgba(245,240,232,0.95)', 
        borderColor: '#e8d5b0' 
      }}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <span className="font-serif text-lg font-semibold tracking-wide transition"
          style={{ color: '#1e3a34', fontFamily: 'Cormorant Garamond, Playfair Display, serif', fontSize: '1.2rem', letterSpacing: '0.06em' }}>
          Happy Humans
        </span>
        <span className="text-xs italic"
          style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.08em' }}>
          philo-coaching
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex items-center gap-6 text-sm font-medium">
        <Link href="/relations" 
          className="transition hover:underline underline-offset-4"
          style={{ color: '#2d5f54', letterSpacing: '0.04em' }}>
          Relations
        </Link>
        <Link href="/contact" 
          className="transition hover:underline underline-offset-4"
          style={{ color: '#2d5f54', letterSpacing: '0.04em' }}>
          Contact
        </Link>
        <Link href="/booking"
          className="rounded-full px-5 py-2 text-white text-sm font-medium transition"
          style={{ backgroundColor: '#2d5f54', letterSpacing: '0.04em' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1e3a34')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2d5f54')}>
          Réserver
        </Link>
      </nav>
    </header>
  )
}
