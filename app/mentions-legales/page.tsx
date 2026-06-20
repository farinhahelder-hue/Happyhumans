import MiniNav from '@/components/MiniNav'
import MiniFooter from '@/components/MiniFooter'

export const metadata = {
  title: 'Mentions légales | Happy Humans',
  description: 'Mentions légales du site Happy Humans — Monica Schneider, philo-coaching.',
}

export default function MentionsLegales() {
  return (
    <>
      <MiniNav />
      <main className="min-h-screen py-20 px-6 md:px-10" style={{ backgroundColor: '#f5f0e8' }}>
        <div className="mx-auto max-w-3xl">

          {/* Titre */}
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#c9a96e' }}>Cadre légal</p>
            <h1 className="text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif', color: '#1e3a34' }}>
              Mentions légales
            </h1>
            <div className="mx-auto mt-4 w-12 h-px" style={{ backgroundColor: '#c9a96e' }} />
            <p className="mt-4 text-sm" style={{ color: '#5a7a74' }}>Dernière mise à jour : juin 2026</p>
          </div>

          <div className="space-y-10 text-sm leading-relaxed" style={{ color: '#1e3a34' }}>

            {/* Éditeur */}
            <section>
              <h2 className="text-lg font-semibold mb-3" style={{ color: '#2d5f54', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem' }}>
                Identité de l'éditeur
              </h2>
              <div className="space-y-1" style={{ color: '#3d3d3d' }}>
                <p><strong>Nom commercial :</strong> Happy Humans</p>
                <p><strong>Responsable :</strong> Monica Schneider</p>
                <p><strong>Activité :</strong> Philo-coaching, executive coaching, philosophical counselling</p>
                <p><strong>Email :</strong>{' '}
                  <a href="mailto:happyhumans.coaching@gmail.com" style={{ color: '#2d5f54' }}>
                    happyhumans.coaching@gmail.com
                  </a>
                </p>
                <p><strong>Site :</strong>{' '}
                  <a href="https://happyhumans.vercel.app" style={{ color: '#2d5f54' }}>
                    happyhumans.vercel.app
                  </a>
                </p>
              </div>
            </section>

            {/* Hébergeur */}
            <section>
              <h2 className="text-lg font-semibold mb-3" style={{ color: '#2d5f54', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem' }}>
                Hébergeur
              </h2>
              <div className="space-y-1" style={{ color: '#3d3d3d' }}>
                <p><strong>Société :</strong> Vercel Inc.</p>
                <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
                <p><strong>Site :</strong>{' '}
                  <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2d5f54' }}>
                    vercel.com
                  </a>
                </p>
              </div>
            </section>

            {/* Propriété intellectuelle */}
            <section>
              <h2 className="text-lg font-semibold mb-3" style={{ color: '#2d5f54', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem' }}>
                Propriété intellectuelle
              </h2>
              <p style={{ color: '#3d3d3d' }}>
                L'ensemble des contenus présents sur ce site (textes, visuels, éléments graphiques, structure et code) 
                est la propriété exclusive de Happy Humans — Monica Schneider et est protégé par le droit de la propriété intellectuelle.
                Toute reproduction, diffusion, adaptation ou exploitation, totale ou partielle, sans autorisation préalable 
                écrite est interdite.
              </p>
              <p className="mt-2" style={{ color: '#3d3d3d' }}>
                Crédits photo : Happy Humans et banques d'images sous licence.
              </p>
            </section>

            {/* Limitation de responsabilité */}
            <section>
              <h2 className="text-lg font-semibold mb-3" style={{ color: '#2d5f54', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem' }}>
                Limitation de responsabilité
              </h2>
              <p style={{ color: '#3d3d3d' }}>
                Happy Humans s'efforce de fournir des informations fiables et à jour, sans garantie d'exhaustivité 
                ou d'absence d'erreur. Happy Humans ne pourra être tenue responsable des dommages directs ou indirects 
                liés à l'utilisation du site, à l'indisponibilité temporaire du service ou à l'usage d'informations 
                externes référencées. Les liens sortants sont fournis à titre informatif et n'emportent pas validation 
                de leur contenu.
              </p>
            </section>

            {/* Contact légal */}
            <section>
              <h2 className="text-lg font-semibold mb-3" style={{ color: '#2d5f54', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem' }}>
                Contact légal
              </h2>
              <p style={{ color: '#3d3d3d' }}>
                Pour toute demande légale ou relative au RGPD, vous pouvez nous écrire à{' '}
                <a href="mailto:happyhumans.coaching@gmail.com" style={{ color: '#2d5f54' }}>
                  happyhumans.coaching@gmail.com
                </a>.
              </p>
            </section>

            {/* Copyright */}
            <section className="pt-6 border-t" style={{ borderColor: '#e8d5b0' }}>
              <p className="text-xs" style={{ color: '#5a7a74' }}>
                © 2026 Happy Humans — Monica Schneider. Tous droits réservés.
              </p>
            </section>

          </div>
        </div>
      </main>
      <MiniFooter />
    </>
  )
}
