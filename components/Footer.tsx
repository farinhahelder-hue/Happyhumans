'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-stone-950 text-stone-200">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div>
            <div className="mb-4">
              <h3 className="mb-2 text-2xl font-serif font-bold text-white">Happy Humans</h3>
              <p className="text-sm text-amber-200">Coaching & transformation avec Monica Schneider.</p>
            </div>
            <p className="text-sm leading-relaxed text-stone-300">
              Une pratique de coaching qui relie leadership, authenticité, philosophie et
              transformation humaine, pour les personnes comme pour les organisations.
            </p>
            <div className="mt-6">
              <a
                href="https://fr.linkedin.com/in/monica-schneider-philo-coaching"
                className="inline-flex items-center gap-2 text-stone-300 transition-colors duration-200 hover:text-white"
                title="Voir le profil LinkedIn de Monica Schneider"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5C4.98 4.88 3.86 6 2.49 6S0 4.88 0 3.5 1.12 1 2.49 1s2.49 1.12 2.49 2.5zM.5 8h4V24h-4V8zm7 0h3.8v2.2h.1c.53-1 1.82-2.2 3.75-2.2 4.01 0 4.75 2.64 4.75 6.07V24h-4v-8.1c0-1.93-.03-4.42-2.69-4.42-2.7 0-3.11 2.1-3.11 4.28V24h-4V8z" />
                </svg>
                <span className="text-sm font-medium">LinkedIn</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-lg font-serif font-bold text-white">Navigation</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-stone-300 transition-colors duration-200 hover:text-white">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-stone-300 transition-colors duration-200 hover:text-white">
                  Monica
                </Link>
              </li>
              <li>
                <Link href="/coaching" className="text-stone-300 transition-colors duration-200 hover:text-white">
                  Coaching
                </Link>
              </li>
              <li>
                <Link href="/entreprises" className="text-stone-300 transition-colors duration-200 hover:text-white">
                  Entreprises
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-stone-300 transition-colors duration-200 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-lg font-serif font-bold text-white">Accompagnements</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/coaching" className="text-stone-300 transition-colors duration-200 hover:text-white">
                  Coaching individuel
                </Link>
              </li>
              <li>
                <Link href="/entreprises" className="text-stone-300 transition-colors duration-200 hover:text-white">
                  Leadership & équipes
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-stone-300 transition-colors duration-200 hover:text-white">
                  Session découverte
                </Link>
              </li>
              <li>
                <a href="https://monicaschneider.me/" className="text-stone-300 transition-colors duration-200 hover:text-white">
                  À propos de Monica
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-lg font-serif font-bold text-white">Infos</h4>
            <ul className="space-y-3 text-sm">
              <li className="text-stone-300">France · En ligne · Europe</li>
              <li className="text-stone-300">Français · English · Română</li>
              <li>
                <a href="mailto:contactus@happy-humans.org" className="text-stone-300 transition-colors duration-200 hover:text-white">
                  contactus@happy-humans.org
                </a>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-stone-300 transition-colors duration-200 hover:text-white">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="text-stone-300 transition-colors duration-200 hover:text-white">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-stone-400 md:flex-row">
            <p>© {currentYear} Happy Humans. Tous droits réservés.</p>
            <p className="text-xs">Monica Schneider · Happy Humans</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
