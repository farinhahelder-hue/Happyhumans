'use client'
import Link from 'next/link'
import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULTS = {
  site_name:     'Happy Humans',
  tagline:       'philo-coaching',
  description:   'Coaching & transformation avec Monica Schneider.',
  description_2: 'Une pratique qui relie leadership, authenticité, philosophie et transformation humaine.',
  linkedin_url:  'https://fr.linkedin.com/in/monica-schneider-philo-coaching',
  service_1:     'Executive coaching individuel',
  service_2:     'Coaching de dirigeants',
  service_3:     'Philosophical counselling',
  service_4:     'Sparring partner',
  service_5:     'Ateliers et séminaires',
  copyright:     'Happy Humans — Monica Schneider. Tous droits réservés.',
}

export default function Footer() {
  const c = useCmsContent('footer', DEFAULTS)
  const year = new Date().getFullYear()
  return (
    <footer className="border-t px-6 py-10 md:px-10"
      style={{ backgroundColor: '#1e3a34', borderColor: '#2d5f54' }}>
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div>
            <Link href="/"
              style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif', fontSize: '1.1rem', letterSpacing: '0.08em', color: '#f5f0e8', fontWeight: 400 }}>
              {c.site_name.toUpperCase()}
            </Link>
            <p className="text-xs italic mt-1" style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>
              {c.field('tagline')}
            </p>
            <p className="text-xs mt-2" style={{ color: '#5a7a74' }}>{c.description}</p>
            <p className="text-xs mt-1" style={{ color: '#5a7a74' }}>{c.description_2}</p>
            {c.linkedin_url && (
              <a href={c.linkedin_url} target="_blank" rel="noopener noreferrer"
                className="inline-block mt-3 text-xs hover:text-white transition" style={{ color: '#5a7a74' }}>
                LinkedIn →
              </a>
            )}
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#c9a96e' }}>Navigation</p>
            <div className="flex flex-col gap-2 text-xs" style={{ color: '#5a7a74' }}>
              <Link href="/" className="hover:text-white transition">Accueil</Link>
              <Link href="/coaching" className="hover:text-white transition">Coaching individuel</Link>
              <Link href="/happiness-design" className="hover:text-white transition">Happiness Design™</Link>
              <Link href="/sparring-partner" className="hover:text-white transition">Sparring Partner</Link>
              <Link href="/entreprises" className="hover:text-white transition">Entreprises</Link>
              <Link href="/relations" className="hover:text-white transition">Relations</Link>
              <Link href="/temoignages" className="hover:text-white transition">Témoignages</Link>
              <Link href="/contact" className="hover:text-white transition">Contact</Link>
              <Link href="/blog" className="hover:text-white transition">Ressources</Link>
              <Link href="/faq" className="hover:text-white transition">FAQ</Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#c9a96e' }}>Services</p>
            <div className="flex flex-col gap-2 text-xs" style={{ color: '#5a7a74' }}>
              {[c.service_1, c.service_2, c.service_3, c.service_4, c.service_5].filter(Boolean).map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
          </div>

        </div>

        <div className="w-full h-px mb-6" style={{ backgroundColor: '#2d5f54' }} />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs" style={{ color: '#5a7a74' }}>
          <div>
            <p>© {year} {c.field('copyright')}</p>
            <p className="opacity-40 mt-1">Photos : <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition">Unsplash</a></p>
          </div>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="hover:text-white transition">Mentions légales</Link>
            <Link href="/politique-confidentialite" className="hover:text-white transition">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
