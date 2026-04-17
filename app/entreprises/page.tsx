import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const offers = [
  {
    title: 'Coaching de dirigeants et managers',
    description:
      "Pour soutenir la posture, la présence, les décisions et l'alignement dans des environnements en mouvement.",
  },
  {
    title: 'Ateliers & séminaires',
    description:
      "Des formats pour remettre du lien, de la clarté et de la qualité de réflexion dans les équipes et les collectifs.",
  },
  {
    title: 'Transformation culturelle',
    description:
      "Quand il faut accompagner un changement sans perdre l'humain, la confiance ni la cohérence.",
  },
]

const principles = [
  'People, planet and profit peuvent se tenir ensemble.',
  "La transformation n'est durable que si elle est vécue, pas seulement annoncée.",
  "Les équipes ont besoin de cadre, de sens et de qualité relationnelle pour retrouver de l'élan.",
]

export const metadata: Metadata = {
  title: 'Entreprises & organisations',
  description:
    "Coaching, mentoring, ateliers et accompagnement de la transformation pour dirigeants, équipes et organisations.",
  alternates: {
    canonical: 'https://happy-humans.org/entreprises',
  },
}

export default function EntreprisesPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-[#18312d] py-24 text-white md:py-32">
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#d7c3a6]">
              Entreprises & organisations
            </p>
            <h1 className="max-w-4xl text-4xl font-serif font-light leading-tight md:text-6xl">
              Faire évoluer les personnes et les équipes,
              <span className="block italic text-[#d7c3a6]">sans sacrifier l&apos;humain au passage.</span>
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-white/75">
              Happy Humans accompagne les organisations qui veulent créer plus d&apos;alignement, de
              qualité relationnelle et de leadership conscient dans leurs transformations.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#18312d] transition-colors hover:bg-[#f4efe6]"
              >
                Parler de votre contexte
              </Link>
              <Link
                href="/coaching"
                className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition-colors hover:border-white/40"
              >
                Voir le coaching individuel
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            <div className="mb-12 max-w-3xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8d5d2f]">
                Formats
              </p>
              <h2 className="text-3xl font-serif font-light text-stone-900 md:text-4xl">
                Des interventions conçues pour être utiles, tenables et incarnées.
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {offers.map((item) => (
                <article key={item.title} className="rounded-[1.75rem] border border-stone-200 p-7">
                  <h3 className="text-xl font-serif font-light text-stone-900">{item.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-stone-600">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f7f5f0] py-20 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[0.95fr_1.05fr] md:px-10">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8d5d2f]">
                Intention
              </p>
              <h2 className="text-3xl font-serif font-light text-stone-900 md:text-4xl">
                Créer des environnements où la performance ne coupe pas du vivant.
              </h2>
            </div>
            <div className="space-y-4">
              {principles.map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-stone-200 bg-white p-5 text-sm leading-relaxed text-stone-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-24">
          <div className="mx-auto max-w-4xl px-6 text-center md:px-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
              Collaboration
            </p>
            <h2 className="text-3xl font-serif font-light text-stone-900 md:text-4xl">
              Un premier échange pour comprendre votre réalité avant de proposer un format.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-stone-700 md:text-lg">
              Chaque organisation a son contexte, son rythme, ses contraintes et sa culture. Le
              travail commence donc par une lecture fine de ce qui se joue vraiment.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex rounded-full bg-amber-900 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-800"
            >
              Nous écrire →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
