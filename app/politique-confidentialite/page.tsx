import MiniNav from '@/components/MiniNav'
import MiniFooter from '@/components/MiniFooter'

export const metadata = {
  title: 'Politique de confidentialité | Happy Humans',
  description: 'Politique de confidentialité et protection des données personnelles — Happy Humans, Monica Schneider.',
}

export default function PolitiqueConfidentialite() {
  return (
    <>
      <MiniNav />
      <main className="min-h-screen py-20 px-6 md:px-10" style={{ backgroundColor: '#f5f0e8' }}>
        <div className="mx-auto max-w-3xl">

          {/* Titre */}
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#c9a96e' }}>Données personnelles</p>
            <h1 className="text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif', color: '#1e3a34' }}>
              Politique de confidentialité
            </h1>
            <div className="mx-auto mt-4 w-12 h-px" style={{ backgroundColor: '#c9a96e' }} />
            <p className="mt-4 text-sm" style={{ color: '#5a7a74' }}>Dernière mise à jour : juin 2026</p>
          </div>

          <div className="space-y-10 text-sm leading-relaxed" style={{ color: '#1e3a34' }}>

            {/* Responsable */}
            <section>
              <h2 className="text-lg mb-3" style={{ color: '#2d5f54', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600 }}>
                Responsable du traitement
              </h2>
              <p style={{ color: '#3d3d3d' }}>
                <strong>Happy Humans — Monica Schneider</strong><br />
                Email : <a href="mailto:happyhumans.coaching@gmail.com" style={{ color: '#2d5f54' }}>happyhumans.coaching@gmail.com</a>
              </p>
            </section>

            {/* Données collectées */}
            <section>
              <h2 className="text-lg mb-3" style={{ color: '#2d5f54', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600 }}>
                Données collectées
              </h2>
              <p style={{ color: '#3d3d3d' }}>Nous collectons uniquement les données que vous nous transmettez volontairement :</p>
              <ul className="mt-2 space-y-1 list-disc list-inside" style={{ color: '#3d3d3d' }}>
                <li>Nom et adresse email (formulaire de contact)</li>
                <li>Nom, email, type de séance, créneau choisi (formulaire de réservation)</li>
                <li>Résultats du test de style d&apos;attachement (anonymes)</li>
              </ul>
            </section>

            {/* Finalités */}
            <section>
              <h2 className="text-lg mb-3" style={{ color: '#2d5f54', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600 }}>
                Finalités du traitement
              </h2>
              <ul className="space-y-1 list-disc list-inside" style={{ color: '#3d3d3d' }}>
                <li>Répondre à vos demandes de contact ou de réservation</li>
                <li>Organiser et assurer le suivi des séances de coaching</li>
                <li>Respecter les obligations légales applicables</li>
              </ul>
            </section>

            {/* Durée de conservation */}
            <section>
              <h2 className="text-lg mb-3" style={{ color: '#2d5f54', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600 }}>
                Durée de conservation
              </h2>
              <p style={{ color: '#3d3d3d' }}>2 ans maximum pour les données de contact et de réservation.</p>
              <p style={{ color: '#3d3d3d' }}>Les résultats anonymes du test d&apos;attachement ne sont pas conservés de manière identifiable.</p>
            </section>

            {/* Sous-traitants */}
            <section>
              <h2 className="text-lg mb-3" style={{ color: '#2d5f54', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600 }}>
                Hébergement et sous-traitants
              </h2>
              <p style={{ color: '#3d3d3d' }}>
                Les données peuvent être traitées par des prestataires techniques sélectionnés :{' '}
                <strong>Vercel</strong> (hébergement) et <strong>Supabase</strong> (base de données).
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-lg mb-3" style={{ color: '#2d5f54', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600 }}>
                Cookies
              </h2>
              <p style={{ color: '#3d3d3d', fontWeight: 600 }}>Pas de cookies tiers.</p>
              <p style={{ color: '#3d3d3d', fontWeight: 600 }}>Pas de publicité.</p>
              <p style={{ color: '#3d3d3d', fontWeight: 600 }}>Pas de partage avec des tiers.</p>
              <p style={{ color: '#3d3d3d' }} className="mt-2">
                Les cookies strictement nécessaires au fonctionnement du site sont utilisés sans consentement préalable.
              </p>
            </section>

            {/* Vos droits */}
            <section>
              <h2 className="text-lg mb-3" style={{ color: '#2d5f54', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600 }}>
                Vos droits (RGPD)
              </h2>
              <p style={{ color: '#3d3d3d' }}>Conformément au RGPD, vous pouvez demander :</p>
              <ul className="mt-2 space-y-1 list-disc list-inside" style={{ color: '#3d3d3d' }}>
                <li>L&apos;accès à vos données personnelles</li>
                <li>La rectification de données inexactes</li>
                <li>L&apos;effacement de vos données</li>
                <li>La limitation ou l&apos;opposition à certains traitements</li>
              </ul>
              <p style={{ color: '#3d3d3d' }} className="mt-3">
                Pour exercer vos droits ou poser une question relative à vos données, contactez-nous à{' '}
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
