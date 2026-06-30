'use client'
import Link from 'next/link'
import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULTS: Record<string, string> = {
  site_name:              'Happy Humans',
  tagline:                'philo-coaching',
  description:            'Coaching & transformation avec Monica Schneider.',
  description_2:          'Une pratique qui relie leadership, authenticite, philosophie et transformation humaine.',
  linkedin_url:           'https://fr.linkedin.com/in/monica-schneider-philo-coaching',
  photos_label:           'Photos : ',
  footer_nav_title:       'Navigation',
  footer_nav_home:        'Accueil',
  footer_nav_coaching:    'Coaching individuel',
  footer_nav_hd:          "Happiness Design",
  footer_nav_sparring:    'Sparring Partner',
  footer_nav_entreprises: 'Entreprises',
  footer_nav_relations:   'Relations',
  footer_nav_temoignages: 'Temoignages',
  footer_nav_show_temoignages: 'false',
  footer_nav_contact:     'Contact',
  footer_nav_blog:        'Ressources',
  footer_nav_faq:         'FAQ',
  footer_services_title:  'Services',
  service_1:              'Executive coaching individuel',
  service_2:              'Coaching de dirigeants',
  service_3:              'Philosophical counselling',
  service_4:              'Sparring partner',
  service_5:              'Ateliers et seminaires',
  copyright:              'Happy Humans \u2014 Monica Schneider. Tous droits reserves.',
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
              style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', letterSpacing: '0.08em', color: '#f5f0e8', fontWeight: 400 }}>
              {c.site_name.toUpperCase()}
            </Link>
            <p className="text-xs italic mt-1" style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>
              {c.get('tagline')}
            </p>
            <p className="text-xs mt-2" style={{ color: '#5a7a74' }}>{c.get('description')}</p>
            <p className="text-xs mt-1" style={{ color: '#5a7a74' }}>{c.get('description_2')}</p>
            {c.linkedin_url && (
              <a href={c.linkedin_url} target="_blank" rel="noopener noreferrer"
                className="inline-block mt-3 text-xs hover:text-white transition" style={{ color: '#5a7a74' }}>
                LinkedIn &rarr;
              </a>
            )}
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#c9a96e' }}>{c.get('footer_nav_title')}</p>
            <div className="flex flex-col gap-2 text-xs" style={{ color: '#5a7a74' }}>
              <Link href="/" className="hover:text-white transition">{c.get('footer_nav_home')}</Link>
              <Link href="/coaching" className="hover:text-white transition">{c.get('footer_nav_coaching')}</Link>
              <Link href="/happiness-design" className="hover:text-white transition">{c.get('footer_nav_hd')}</Link>
              <Link href="/sparring-partner" className="hover:text-white transition">{c.get('footer_nav_sparring')}</Link>
              <Link href="/entreprises" className="hover:text-white transition">{c.get('footer_nav_entreprises')}</Link>
              <Link href="/relations" className="hover:text-white transition">{c.get('footer_nav_relations')}</Link>
              {c.get('footer_nav_show_temoignages') !== 'false' && (
                <Link href="/temoignages" className="hover:text-white transition">{c.get('footer_nav_temoignages')}</Link>
              )}
              <Link href="/contact" className="hover:text-white transition">{c.get('footer_nav_contact')}</Link>
              <Link href="/blog" className="hover:text-white transition">{c.get('footer_nav_blog')}</Link>
              <Link href="/faq" className="hover:text-white transition">{c.get('footer_nav_faq')}</Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#c9a96e' }}>{c.get('footer_services_title')}</p>
            <div className="flex flex-col gap-2 text-xs" style={{ color: '#5a7a74' }}>
              {[1,2,3,4,5].map(i => {
                const val = c.get(`service_${i}`)
                if (!val) return null
                return <span key={i}>{val}</span>
              })}
            </div>
          </div>

        </div>

        <div className="w-full h-px mb-6" style={{ backgroundColor: '#2d5f54' }} />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs" style={{ color: '#5a7a74' }}>
          <div>
            <p>&copy; {year} {c.get('copyright')}</p>
            <p className="opacity-40 mt-1">
              {c.get('photos_label')}<a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition">Unsplash</a>
            </p>
          </div>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="hover:text-white transition">Mentions legales</Link>
            <Link href="/politique-confidentialite" className="hover:text-white transition">Confidentialite</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
