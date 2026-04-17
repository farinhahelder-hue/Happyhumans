import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact | Happy Humans',
  description:
    "Un sujet à explorer, une transition, un besoin d'accompagnement individuel ou collectif ? On lit tous les messages. On répond sous 48h.",
  alternates: {
    canonical: 'https://happy-humans.org/contact',
  },
  openGraph: {
    title: 'Contact | Happy Humans',
    description:
      "Coaching individuel, organisations, ateliers ou session découverte: on revient vers vous sous 48h.",
    url: 'https://happy-humans.org/contact',
    siteName: 'Happy Humans',
    locale: 'fr_FR',
  },
}

export default function Contact() {
  return (
    <>
      <Header />
      <Breadcrumb />
      <main>
        <section className="bg-gradient-to-br from-stone-50 via-amber-50/40 to-white py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6 md:px-10">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-amber-800">
              On lit tous les messages. On répond.
            </p>
            <h1 className="mb-6 text-4xl font-serif font-light leading-tight text-stone-900 md:text-5xl">
              Commençons par ce qui est vivant, là, maintenant.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-stone-700">
              Une transition de carrière, un rôle qui pèse, une équipe à réaligner, une question de
              sens, une envie de retrouver de l&apos;élan ou simplement le besoin de clarifier ce qui
              se joue: c&apos;est très bien comme point de départ.
            </p>
          </div>
        </section>

        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-3 md:px-10">
            <div className="md:col-span-2">
              <div className="mb-10 max-w-2xl">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
                  Ce qui aide
                </p>
                <h2 className="mb-4 text-3xl font-serif font-light leading-tight text-stone-900">
                  Quelques lignes suffisent pour commencer juste.
                </h2>
                <p className="text-base leading-relaxed text-stone-700">
                  Ce qui vous traverse, ce qui coince, ce que vous souhaitez faire évoluer, ce que
                  vous voulez éviter de reproduire. On repart de là.
                </p>
              </div>
              <ContactForm />
            </div>

            <aside className="space-y-8 md:pt-2">
              <div className="rounded-3xl border border-stone-200 bg-stone-50 p-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                  Email direct
                </p>
                <a
                  href="mailto:contactus@happy-humans.org"
                  className="text-lg font-semibold text-amber-800 transition-colors duration-200 hover:text-amber-700"
                >
                  contactus@happy-humans.org
                </a>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  Réponse humaine sous 48h, sans tunnel automatique.
                </p>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                  Langues & format
                </p>
                <p className="text-lg font-semibold text-amber-800">
                  Français · English · Română
                </p>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  Accompagnements en ligne, et selon les formats en France ou en Europe.
                </p>
              </div>

              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-amber-800">
                  Ce que l&apos;on accompagne
                </p>
                <ul className="space-y-3 text-sm leading-relaxed text-stone-700">
                  <li>Leadership, transitions, confiance et alignement personnel.</li>
                  <li>Coaching de dirigeants, entrepreneurs et managers.</li>
                  <li>Ateliers, séminaires et accompagnement des organisations.</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
