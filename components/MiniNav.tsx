'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function MiniNav() {
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/coaching',    label: 'Coaching' },
    { href: '/relations',   label: 'Relations' },
    { href: '/temoignages', label: 'Témoignages' },
    { href: '/a-propos',    label: 'Monica' },
    { href: '/contact',     label: 'Contact' },
  ]

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(245,240,232,0.95)', borderColor: '#e8d5b0' }}>
      <div className="flex items-center justify-between px-6 py-4 md:px-10">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo-happy-humans.jpg" alt="Happy Humans" width={36} height={36} className="rounded-full object-cover" />
          <div className="flex flex-col">
            <span className="font-serif text-base font-semibold tracking-wide"
              style={{ color: '#1e3a34', fontFamily: 'Cormorant Garamond, serif' }}>
              Happy Humans
            </span>
            <span className="text-xs italic" style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>
              philo-coaching
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className="transition hover:underline underline-offset-4"
              style={{ color: '#2d5f54' }}>
              {l.label}
            </Link>
          ))}
          <Link href="/booking"
            className="rounded-full px-5 py-2 text-white text-sm font-medium transition"
            style={{ backgroundColor: '#2d5f54' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1e3a34')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2d5f54')}>
            Réserver
          </Link>
        </nav>

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
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="text-sm font-medium text-stone-700 hover:text-[#2d5f54] py-1">
                {l.label}
              </Link>
            ))}
            <Link href="/booking" onClick={() => setOpen(false)}
              className="mt-2 rounded-full py-2 text-sm font-medium text-white text-center"
              style={{ backgroundColor: '#2d5f54' }}>
              Réserver une séance
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
