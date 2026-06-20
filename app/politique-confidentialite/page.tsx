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
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#c9a96e' }}>Cadre légal</p>
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
                <li>Nom, prénom et adresse email (formulaire de contact ou de réservation)</li>
                <li>Numéro de téléphone (optionnel, lors d'une réservation)</li>
                <li>Message libre et informations partagées dans le cadre du coaching</li>
                <li>Résultats du test de style d'attachement (anonymes, non liés à votre identité sauf consentement)</li>
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
                <li>Respecter les obligations légales et comptables applicables</li>
              </ul>
            </section>

            {/* Bases légales */}
            <section>
              <h2 className="text-lg mb-3" style={{ color: '#2d5f54', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600 }}>
                Bases légales
              </h2>
              <ul className="space-y-1 list-disc list-inside" style={{ color: '#3d3d3d' }}>
                <li>Exécution précontractuelle ou contractuelle (demandes et prestations)</li>
                <li>Consentement (cookies non essentiels, communications marketing)</li>
                <li>Intérêt légitime (sécurité, prévention de fraude, maintenance)</li>
                <li>Obligation légale (conservation comptable et fiscale)</li>
              </ul>
            </section>

            {/* Durée de conservation */}
            <section>
              <h2 className="text-lg mb-3" style={{ color: '#2d5f54', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600 }}>
                Durée de conservation
              </h2>
              <ul className="space-y-1 list-disc list-inside" style={{ color: '#3d3d3d' }}>
                <li>Demandes de contact : jusqu'à 24 mois après le dernier échange</li>
                <li>Données clients : pendant la relation puis conservation légale obligatoire</li>
                <li>Logs techniques : durée courte de sécurité et de diagnostic</li>
              </ul>
            </section>

            {/* Sous-traitants */}
            <section>
              <h2 className="text-lg mb-3" style={{ color: '#2d5f54', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600 }}>
                Hébergement et sous-traitants
              </h2>
              <p style={{ color: '#3d3d3d' }}>
                Les données peuvent être traitées par des prestataires techniques sélectionnés pour l'hébergement 
                et la base de données : <strong>Vercel</strong> (hébergement) et <strong>Supabase</strong> (base de données).
                Ces prestataires sont soumis à des obligations de confidentialité strictes.
              </p>
            </section>

            {/* Vos droits */}
            <section>
              <h2 className="text-lg mb-3" style={{ color: '#2d5f54', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600 }}>
                Vos droits RGPD
              </h2>
              <p style={{ color: '#3d3d3d' }}>Conformément au RGPD, vous pouvez demander :</p>
              <ul className="mt-2 space-y-1 list-disc list-inside" style={{ color: '#3d3d3d' }}>
                <li>L'accès à vos données personnelles</li>
                <li>La rectification de données inexactes</li>
                <li>L'effacement de vos données, sous réserve des obligations légales</li>
                <li>La limitation ou l'opposition à certains traitements</li>
                <li>La portabilité des données lorsque applicable</li>
                <li>Le retrait de votre consentement à tout moment</li>
              </ul>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-lg mb-3" style={{ color: '#2d5f54', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600 }}>
                Cookies
              </h2>
              <p style={{ color: '#3d3d3d' }}>
                Les cookies strictement nécessaires au fonctionnement du site sont activés par défaut. 
                Les cookies de mesure d'audience ou marketing sont conditionnés à votre consentement explicite.
                Vous pouvez modifier votre choix à tout moment depuis le bandeau cookies.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-lg mb-3" style={{ color: '#2d5f54', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600 }}>
                Exercer vos droits
              </h2>
              <p style={{ color: '#3d3d3d' }}>
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
