'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

function useSettings() {
  const [s, setS] = useState<Record<string,string>>({})
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return
    createClient(url, key)
      .from('cms_settings_kv')
      .select('key, value')
      .in('key', ['site_name','linkedin_url','instagram_url','footer_text','contact_email'])
      .then(({ data }) => {
        if (!data) return
        const m: Record<string,string> = {}
        data.forEach((r: {key:string;value:string}) => { m[r.key] = r.value })
        setS(m)
      })
  }, [])
  return s
}

export default function Footer() {
  const s = useSettings()
  const year = new Date().getFullYear()
  const siteName = s.site_name || 'Happy Humans'
  const linkedin = s.linkedin_url || 'https://fr.linkedin.com/in/monica-schneider-philo-coaching'
  const instagram = s.instagram_url || ''
  const footerText = s.footer_text || `Coaching & transformation avec Monica Schneider.`

  return (
    <footer className="bg-stone-950 text-stone-200">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <h3 className="mb-2 text-2xl font-serif font-bold text-white">{siteName}</h3>
              <p className="text-sm text-amber-200">{footerText}</p>
            </div>
            <p className="text-sm leading-relaxed text-stone-300">
              Une pratique de coaching qui relie leadership, authenticité, philosophie et
              transformation humaine, pour les personnes comme pour les organisations.
            </p>
            <div className="mt-6 flex gap-4">
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-stone-300 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.49 6S0 4.88 0 3.5 1.12 1 2.49 1s2.49 1.12 2.49 2.5zM.5 8h4V24h-4V8zm7 0h3.8v2.2h.1c.53-1 1.82-2.2 3.75-2.2 4.01 0 4.75 2.64 4.75 6.07V24h-4v-8.1c0-1.93-.03-4.42-2.69-4.42-2.7 0-3.11 2.1-3.11 4.28V24h-4V8z"/>
                  </svg>
                  <span className="text-sm">LinkedIn</span>
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-stone-300 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span className="text-sm">Instagram</span>
                </a>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-6 text-lg font-serif font-bold text-white">Navigation</h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/a-propos', label: 'À propos' },
                { href: '/coaching', label: 'Coaching' },
                { href: '/entreprises', label: 'Entreprises' },
                { href: '/relations', label: 'Relations' },
                { href: '/temoignages', label: 'Témoignages' },
                { href: '/blog', label: 'Blog' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-stone-300 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-6 text-lg font-serif font-bold text-white">Services</h4>
            <ul className="space-y-3 text-sm text-stone-300">
              <li>Executive coaching individuel</li>
              <li>Coaching de dirigeants</li>
              <li>Philosophical counselling</li>
              <li>Ateliers et séminaires</li>
              <li>Accompagnement du changement</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-6 text-lg font-serif font-bold text-white">Contact</h4>
            <ul className="space-y-3 text-sm text-stone-300">
              {s.contact_email && (
                <li>
                  <a href={`mailto:${s.contact_email}`} className="hover:text-white transition-colors">
                    ✉️ {s.contact_email}
                  </a>
                </li>
              )}
              <li>🌍 Français · English · Română</li>
              <li>
                <Link href="/contact" className="inline-block mt-2 rounded-full border border-stone-600 px-4 py-2 text-xs font-semibold hover:border-white hover:text-white transition-colors">
                  Prendre contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-stone-800 pt-8 text-xs text-stone-500 md:flex-row">
          <p>© {year} {siteName} — Monica Schneider. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="hover:text-stone-300 transition-colors">Mentions légales</Link>
            <Link href="/politique-confidentialite" className="hover:text-stone-300 transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
