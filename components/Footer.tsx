'use client'
import Link from 'next/link'

// Footer utilisé sur les pages secondaires (non-visibles en maintenance)
// Pour les pages publiques, utiliser MiniFooter à la place
export default function Footer() {
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
              HAPPY HUMANS
            </Link>
            <p className="text-xs italic mt-1" style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>
              philo-coaching
            </p>
            <p className="text-xs mt-2" style={{ color: '#5a7a74' }}>
              Coaching & transformation avec Monica Schneider.
            </p>
            <p className="text-xs mt-1" style={{ color: '#5a7a74' }}>
              Une pratique qui relie leadership, authenticité, philosophie et transformation humaine.
            </p>
            <a href="https://fr.linkedin.com/in/monica-schneider-philo-coaching"
              target="_blank" rel="noopener noreferrer"
              className="inline-block mt-3 text-xs hover:text-white transition"
              style={{ color: '#5a7a74' }}>
              LinkedIn →
            </a>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#c9a96e' }}>Navigation</p>
            <div className="flex flex-col gap-2 text-xs" style={{ color: '#5a7a74' }}>
              <Link href="/" className="hover:text-white transition">Accueil</Link>
              <Link href="/relations" className="hover:text-white transition">Relations</Link>
              <Link href="/booking" className="hover:text-white transition">Réserver</Link>
              <Link href="/contact" className="hover:text-white transition">Contact</Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#c9a96e' }}>Services</p>
            <div className="flex flex-col gap-2 text-xs" style={{ color: '#5a7a74' }}>
              <span>Executive coaching individuel</span>
              <span>Coaching de dirigeants</span>
              <span>Philosophical counselling</span>
              <span>Sparring partner</span>
              <span>Ateliers et séminaires</span>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px mb-6" style={{ backgroundColor: '#2d5f54' }} />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs" style={{ color: '#5a7a74' }}>
          <p>© {year} Happy Humans — Monica Schneider. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="hover:text-white transition">Mentions légales</Link>
            <Link href="/politique-confidentialite" className="hover:text-white transition">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
