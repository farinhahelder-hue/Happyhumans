import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const focuses = [
  {
    title: 'Leadership & posture',
    description:
      "Retrouver une posture qui vous ressemble — ni trop en retrait, ni en sursis dans un rôle qui ne vous porte plus.",
  },
  {
    title: 'Transitions & bifurcations',
    description:
      "Quand quelque chose a changé — ou doit changer — et qu'il faut trouver un nouvel équilibre entre ce qui était et ce qui vient.",
  },
  {
    title: 'Clarté & décision',
    description:
      "Quand le brouillard s'installe et qu'on a besoin de nommer ce qui compte vraiment pour avancer.",
  },
]

const approach = [
  'Executive coaching',
  'Philosophical counselling',
  'Approches centrées solutions',
  'Gestalt et créativité',
  'Psychologie positive & mindfulness',
]

const packages = [
  {
    name: 'Échange découverte',
    price: 'Gratuit',
    duration: '30 min',
    description: 'Pour clarifier votre enjeu et sentir si le dialogue a du sens.',
    features: ['Visioconférence ou téléphone', 'Sans engagement', 'Premier axe identifié'],
    cta: 'Réserver',
    highlighted: false,
  },
  {
    name: 'Parcours coaching',
    price: '350€',
    duration: '3 mois',
    description: 'Un accompagnement pour aller plus loin — là où une seule session ne suffit pas.',
    features: ['6 sessions de 1h', 'Entretiens par email', 'Entre les sessions', 'Bilan de fin'],
    cta: 'Réserver',
    highlighted: true,
  },
  {
    name: 'Session unique',
    price: '120€',
    duration: '1h',
    description: 'Pour gagner en clarté sur un sujet précis — et voir la suite si le besoin s\'en ressent.',
    features: ['1 session de 1h', 'Visioconférence', 'Compte-rendu écrit', 'Suite possible'],
    cta: 'Réserver',
    highlighted: false,
  },
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
              Il y a des moments où il faut
              <span className="block italic text-[#2f6b61]">réapprendre à habiter son rôle.</span>
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-stone-700">
              Monica Schneider accompagne des managers, dirigeants, entrepreneurs et personnes en transition 
              qui traversent une période de doute, de perte de repères ou de besoin de sens. 
              Le travail ne vise pas à performer davantage, mais à retrouver une posture plus claire, plus stable — et plus alignée avec ce qui compte vraiment.
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
                Ce qui vient le plus souvent
              </p>
              <h2 className="text-3xl font-serif font-light text-stone-900 md:text-4xl">
                Des questions qui n'ont pas de réponse évidente.
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
                Un espace pour penser, pas pour optimiser.
              </h2>
            </div>
            <div>
              <p className="text-base leading-relaxed text-stone-700">
                Le coaching ne consiste pas à trouver des solutions toutes faites. Il s&apos;agit plutôt de créer un espace où l&apos;on peut prendre du recul, clarifier ce qui compte vraiment, et retrouver une manière plus juste d&apos;habiter son rôle — dans le travail comme ailleurs.
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
              Comment ça commence
            </p>
            <h2 className="text-3xl font-serif font-light text-stone-900 md:text-4xl">
              Par un échange — sans engagement.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-stone-700 md:text-lg">
              Le premier rendez-vous permet de clarifier votre enjeu, de sentir comment travaille Monica, 
              et de voir si l'accompagnement a du sens. Après, le format se construit ensemble, selon votre situation.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex rounded-full bg-amber-900 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-800"
            >
              Prendre rendez-vous →
            </Link>
          </div>
        </section>

        <section className="bg-gradient-to-br from-[#f7f2e9] via-white to-[#eef5f3] py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8d5d2f]">
                Tarifs
              </p>
              <h2 className="text-3xl font-serif font-light text-stone-900 md:text-4xl">
                Un accompagnement à votre main
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {packages.map((pkg) => (
                <article 
                  key={pkg.name} 
                  className={`rounded-[1.75rem] p-7 ${
                    pkg.highlighted 
                      ? 'bg-[#2f6b61] text-white ring-2 ring-[#2f6b61]' 
                      : 'border border-stone-200 bg-white'
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] opacity-70">
                    {pkg.duration}
                  </p>
                  <h3 className="mt-2 text-xl font-serif font-light">{pkg.name}</h3>
                  <p className={`mt-3 text-3xl font-serif ${pkg.highlighted ? 'text-white' : 'text-stone-900'}`}>
                    {pkg.price}
                  </p>
                  <p className={`mt-4 text-sm leading-relaxed ${pkg.highlighted ? 'text-white/80' : 'text-stone-600'}`}>
                    {pkg.description}
                  </p>
                  <ul className="mt-6 space-y-2">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <span className={`text-lg ${pkg.highlighted ? 'text-white' : 'text-[#2f6b61]'}`}>✓</span>
                        <span className={pkg.highlighted ? 'text-white/90' : 'text-stone-600'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact?package=coaching"
                    className={`mt-8 block rounded-full px-6 py-3 text-center text-sm font-semibold transition-colors ${
                      pkg.highlighted
                        ? 'bg-white text-[#2f6b61] hover:bg-stone-100'
                        : 'bg-[#2f6b61] text-white hover:bg-[#275a52]'
                    }`}
                  >
                    {pkg.cta}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
