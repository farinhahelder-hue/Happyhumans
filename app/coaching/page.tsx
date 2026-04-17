import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const focuses = [
  {
    title: 'Leadership & posture',
    description:
      "Prendre sa place avec plus de justesse, de présence et de stabilité, sans forcer un rôle qui ne vous ressemble pas.",
  },
  {
    title: 'Transitions & bifurcations',
    description:
      "Changement de poste, perte de repères, besoin de sens, envie d'une autre manière d'habiter son travail ou sa vie.",
  },
  {
    title: 'Confiance & clarté',
    description:
      "Sortir du brouillard intérieur, nommer ce qui bloque, reprendre de la puissance d'action et de décision.",
  },
]

const approach = [
  'Executive coaching',
  'Philosophical counselling',
  'Approches centrées solutions',
  'Gestalt et créativité',
  'Psychologie positive & mindfulness',
]

export const metadata: Metadata = {
  title: 'Coaching individuel',
  description:
    "Un accompagnement pour managers, dirigeants, entrepreneurs et personnes en transition qui veulent retrouver clarté, confiance et alignement.",
  alternates: {
    canonical: 'https://happy-humans.org/coaching',
  },
}

export default function CoachingPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-br from-[#f7f2e9] via-white to-[#eef5f3] py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#8d5d2f]">
              Coaching individuel
            </p>
            <h1 className="max-w-4xl text-4xl font-serif font-light leading-tight text-stone-900 md:text-6xl">
              Un espace pour penser plus clair,
              <span className="block italic text-[#2f6b61]">choisir plus juste et agir plus librement.</span>
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-stone-700">
              Monica Schneider accompagne des managers, dirigeants, entrepreneurs et personnes en
              transition qui veulent faire évoluer leur posture, traverser une période de doute ou
              redonner du sens et du souffle à leur trajectoire.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-[#2f6b61] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#275a52]"
              >
                Réserver un échange découverte
              </Link>
              <Link
                href="/a-propos"
                className="rounded-full border border-[#2f6b61]/30 px-7 py-3 text-sm font-semibold text-[#2f6b61] transition-colors hover:border-[#2f6b61]"
              >
                Lire le parcours de Monica
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            <div className="mb-12 max-w-3xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8d5d2f]">
                Quand ce coaching aide le plus
              </p>
              <h2 className="text-3xl font-serif font-light text-stone-900 md:text-4xl">
                Quand quelque chose appelle à se réaligner.
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {focuses.map((item) => (
                <article key={item.title} className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-7">
                  <h3 className="text-xl font-serif font-light text-stone-900">{item.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-stone-600">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f7f5f0] py-20 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[0.9fr_1.1fr] md:px-10">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8d5d2f]">
                L&apos;approche
              </p>
              <h2 className="text-3xl font-serif font-light text-stone-900 md:text-4xl">
                Coaching, philosophie et transformation humaine.
              </h2>
            </div>
            <div>
              <p className="text-base leading-relaxed text-stone-700">
                Le travail s&apos;ancre dans un dialogue exigeant et bienveillant. Il ne s&apos;agit pas
                seulement de résoudre un problème immédiat, mais de faire émerger des appuis plus
                solides: conscience de soi, clarté intérieure, meilleure qualité de choix et manière
                plus habitée d&apos;exercer son rôle.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {approach.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm text-stone-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-24">
          <div className="mx-auto max-w-4xl px-6 text-center md:px-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
              Modalité
            </p>
            <h2 className="text-3xl font-serif font-light text-stone-900 md:text-4xl">
              Un premier échange de découverte pour voir si c&apos;est le bon cadre.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-stone-700 md:text-lg">
              Le premier rendez-vous permet de clarifier l&apos;enjeu, de sentir la qualité du dialogue
              et de vérifier si l&apos;accompagnement a du sens pour vous. Ensuite, le format se construit
              selon votre contexte.
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
