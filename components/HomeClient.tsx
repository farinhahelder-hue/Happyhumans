'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

const credentials = [
  '10+ ans de leadership en marketing, branding et transformation',
  'Executive Coach certifiee AoEC et EMCC Practitioner',
  'Master en Philosophical Counselling and Consultancy',
  'Accompagnement en francais, anglais et roumain',
]

const audiences = [
  {
    title: 'Pour les individus',
    description:
      "Managers, dirigeants, entrepreneurs ou personnes en transition qui veulent retrouver de la clarte, de la confiance et une direction qui leur ressemble vraiment.",
    href: '/coaching',
    cta: "Decouvrir le coaching",
  },
  {
    title: 'Pour les organisations',
    description:
      "Coaching de leadership, ateliers, seminaires et accompagnement du changement pour remettre de l'alignement, de la qualite relationnelle et de l'elan dans les equipes.",
    href: '/entreprises',
    cta: 'Voir les offres entreprises',
  },
]

const pillars = [
  {
    title: 'Authentic alignment',
    description:
      "Retrouver un cap fidele a ses valeurs, a son energie et a ce qui compte vraiment, sans se couper des exigences du reel.",
  },
  {
    title: 'Questionnement en profondeur',
    description:
      "La philosophie et le coaching se rencontrent pour faire emerger des prises de conscience durables, pas seulement des reponses rapides.",
  },
  {
    title: 'Transformation tenable',
    description:
      "L'objectif n'est pas de produire un declic spectaculaire mais un mouvement solide, concret et soutenable dans le temps.",
  },
]

export default function HomeClient() {
  return (
    <>
      <Header />

      <main>
        <section className="relative overflow-hidden bg-[#f4efe6]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(182,140,94,0.22),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(43,111,98,0.16),_transparent_32%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-24 md:grid-cols-[1.2fr_0.8fr] md:px-10 md:py-32">
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#8d5d2f]">
                Monica Schneider · Executive Coach · Happy Humans
              </p>
              <h1 className="max-w-4xl text-4xl font-serif font-light leading-[1.05] text-stone-900 md:text-6xl">
                Retrouver de la clarte,
                <span className="block italic text-[#2f6b61]">sans se perdre en route.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-stone-700">
                Happy Humans accompagne les personnes et les organisations dans les moments ou
                quelque chose doit bouger: posture de leadership, transition, perte d'elan,
                questionnement de sens ou besoin de realignement.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-stone-600">
                L'approche de Monica Schneider mele executive coaching, philosophical counselling
                et outils de transformation humaine pour creer des changements profonds, concrets
                et durables.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="rounded-full bg-[#2f6b61] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#275a52]"
                >
                  Reserver un echange decouverte
                </Link>
                <Link
                  href="/coaching"
                  className="rounded-full border border-[#2f6b61]/30 px-7 py-3 text-sm font-semibold text-[#2f6b61] transition-colors hover:border-[#2f6b61] hover:bg-white/70"
                >
                  Explorer l'accompagnement
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                En bref
              </p>
              <ul className="space-y-4">
                {credentials.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-stone-700">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#b48c5e]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-2xl bg-[#f7f5f0] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                  Ce que l'on travaille souvent
                </p>
                <p className="mt-3 text-sm leading-relaxed text-stone-700">
                  Leadership, confiance, transitions de carriere, presence, communication,
                  creativite, alignement, culture d'equipe et transformation des blocages en
                  points d'appui.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            <div className="mb-12 max-w-3xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8d5d2f]">
                Deux chemins, une meme intention
              </p>
              <h2 className="text-3xl font-serif font-light text-stone-900 md:text-4xl">
                Aider a faire emerger ce qui est deja la, mais encore empeche.
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {audiences.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[2rem] border border-stone-200 bg-stone-50 p-8 transition-transform hover:-translate-y-1"
                >
                  <h3 className="text-2xl font-serif font-light text-stone-900">{item.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-stone-700">
                    {item.description}
                  </p>
                  <Link
                    href={item.href}
                    className="mt-6 inline-flex text-sm font-semibold text-[#2f6b61] transition-colors hover:text-[#244f49]"
                  >
                    {item.cta} →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f7f5f0] py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-start">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8d5d2f]">
                  A propos de Monica
                </p>
                <h2 className="text-3xl font-serif font-light text-stone-900 md:text-4xl">
                  Une pratique de coaching nourrie par le leadership, la marque et la philosophie.
                </h2>
              </div>
              <div className="space-y-5 text-base leading-relaxed text-stone-700">
                <p>
                  Avant le coaching, Monica Schneider a passe plus de dix ans dans des fonctions de
                  marketing, de developpement produit et de branding, jusqu'a des responsabilites de
                  direction. C'est au contact des equipes, des transformations et des tensions du
                  monde professionnel que s'est affirmee sa vocation d'accompagnement.
                </p>
                <p>
                  Depuis 2020, elle accompagne des personnes et des organisations qui veulent faire
                  evoluer leur posture sans se deconnecter d'elles-memes. Sa pratique est enrichie
                  par un Master en Philosophical Counselling and Consultancy, et par des approches
                  comme le Co-active coaching, le Solutions Focused model, le Gestalt, la pleine
                  conscience et la psychologie positive.
                </p>
                <p>
                  Elle a vecu dans cinq pays, dans dix villes differentes, et travaille en
                  francais, anglais ou roumain.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            <div className="mb-12 max-w-3xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8d5d2f]">
                La demarche
              </p>
              <h2 className="text-3xl font-serif font-light text-stone-900 md:text-4xl">
                Une transformation humaine, pas un vernis de plus.
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {pillars.map((item) => (
                <article key={item.title} className="rounded-[1.75rem] border border-stone-200 p-7">
                  <h3 className="text-xl font-serif font-light text-stone-900">{item.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-stone-600">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#1f3a35] py-20 text-white md:py-24">
          <div className="mx-auto max-w-4xl px-6 text-center md:px-10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#d7c3a6]">
              Premier pas
            </p>
            <h2 className="text-3xl font-serif font-light leading-tight md:text-5xl">
              Un echange pour clarifier ce qui appelle a bouger.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
              Si tu traverses une transition, si ton leadership a besoin d'un nouveau souffle, ou si
              ton organisation cherche un cadre plus vivant, commencons par une conversation simple.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#1f3a35] transition-colors hover:bg-[#f3eee5]"
              >
                Nous ecrire
              </Link>
              <Link
                href="/a-propos"
                className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition-colors hover:border-white/50"
              >
                En savoir plus sur Monica
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
