import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'À propos de Monica Schneider',
  description:
    "Le parcours de Monica Schneider, executive coach, entre leadership, branding, transformation et philosophical counselling.",
  alternates: {
    canonical: 'https://happy-humans.org/a-propos',
  },
  openGraph: {
    url: 'https://happy-humans.org/a-propos',
    title: 'À propos de Monica Schneider',
    description:
      "Executive coach certifiée, formée au philosophical counselling, Monica Schneider accompagne les personnes et les organisations dans leurs transitions et leurs transformations.",
    images: [
      {
        url: 'https://happy-humans.org/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Monica Schneider - Happy Humans',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
}

export default function AProposPage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative flex h-[55vh] items-end overflow-hidden bg-stone-900 md:h-[65vh]">
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1400&q=85"
            alt="Portrait lifestyle évoquant le coaching et la présence"
            className="absolute inset-0 h-full w-full object-cover opacity-40"
            width={1400}
            height={900}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="relative z-10 max-w-3xl px-6 pb-14 md:px-16 md:pb-24">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">À propos</p>
            <h1 className="mb-5 text-4xl font-serif font-light leading-[1.1] text-white md:text-6xl">
              Monica Schneider
              <br />
              <em className="text-amber-300">leadership, coaching et profondeur</em>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-gray-300 md:text-lg">
              Une pratique née au croisement de l&apos;entreprise, du branding, de la transformation
              humaine et du philosophical counselling.
            </p>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="grid items-center gap-12 md:grid-cols-5 md:gap-20">
              <div className="space-y-5 md:col-span-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Le parcours</p>
                <h2 className="text-3xl font-serif font-light leading-tight text-stone-900 md:text-4xl">
                  Une trajectoire
                  <br />
                  <span className="italic text-stone-500">entre direction, marque et accompagnement.</span>
                </h2>
                <p className="text-base leading-relaxed text-stone-600">
                  Monica Schneider a d&apos;abord évolué pendant plus de dix ans dans des univers
                  exigeants de marketing, product development et branding. Elle a contribué à créer
                  des produits, des expériences et des marques fortes tout en accompagnant des
                  équipes à travers des transformations parfois intenses.
                </p>
                <p className="text-base leading-relaxed text-stone-600">
                  Cette expérience l&apos;a menée jusqu&apos;à des fonctions de direction. Mais c&apos;est dans
                  l&apos;accompagnement du développement des personnes que quelque chose de plus profond
                  s&apos;est imposé.
                </p>
                <p className="text-base leading-relaxed text-stone-600">
                  En 2020, elle se tourne pleinement vers le coaching. Depuis, elle accompagne des
                  managers, dirigeants, entrepreneurs et organisations pour faire émerger plus de
                  clarté, de présence, d&apos;alignement et de confiance.
                </p>
                <p className="text-base leading-relaxed text-stone-600">
                  Son travail s&apos;appuie aujourd&apos;hui sur le coaching exécutif, mais aussi sur la
                  philosophie, la psychologie positive, la pleine conscience, le gestalt et des
                  approches centrées sur les solutions.
                </p>
              </div>
              <div className="md:col-span-2">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1515169067868-5387ec356754?w=700&q=85"
                    alt="Femme en réflexion dans un environnement apaisé"
                    className="aspect-[3/4] w-full rounded-2xl object-cover shadow-lg"
                    width={500}
                    height={667}
                    loading="lazy"
                  />
                  <div className="absolute -bottom-5 -left-5 hidden rounded-xl bg-amber-800 px-5 py-4 text-white shadow-lg md:block">
                    <p className="mb-1 text-xs font-bold uppercase tracking-wider">Aujourd&apos;hui</p>
                    <p className="text-2xl font-serif font-light">France · Europe · Online</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-stone-50 py-14">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
              {[
                { chiffre: '10+', label: "ans d'expérience en leadership" },
                { chiffre: '2020', label: 'bascule vers le coaching' },
                { chiffre: '5', label: 'pays vécus' },
                { chiffre: '3', label: 'langues de travail' },
              ].map((item) => (
                <div key={item.label} className="py-6">
                  <p className="mb-2 text-4xl font-serif font-light text-amber-800 md:text-5xl">{item.chiffre}</p>
                  <p className="text-xs uppercase tracking-wider text-stone-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <p className="mb-12 text-center text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Repères</p>
            <div className="grid gap-10 md:grid-cols-2 md:gap-16">
              <div className="group">
                <div className="relative mb-6 overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=80"
                    alt="Session de travail en petit groupe"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    width={600}
                    height={450}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 text-xs font-bold uppercase tracking-[0.15em] text-white">Certifications</span>
                </div>
                <h3 className="mb-3 text-2xl font-serif font-light text-stone-900">Un cadre solide</h3>
                <p className="mb-3 text-sm leading-relaxed text-stone-600">
                  Monica Schneider est formée à l&apos;Academy of Executive Coaching et accréditée EMCC
                  au niveau Practitioner.
                </p>
                <p className="text-sm leading-relaxed text-stone-600">
                  Elle complète cette base avec un Master en Philosophical Counselling and
                  Consultancy pour travailler les transformations avec davantage de profondeur.
                </p>
              </div>

              <div className="group">
                <div className="relative mb-6 overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=700&q=80"
                    alt="Réunion d'équipe et leadership"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    width={600}
                    height={450}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 text-xs font-bold uppercase tracking-[0.15em] text-white">Vision</span>
                </div>
                <h3 className="mb-3 text-2xl font-serif font-light text-stone-900">Aller vers plus de justesse</h3>
                <p className="mb-3 text-sm leading-relaxed text-stone-600">
                  Le travail ne consiste pas seulement à performer davantage. Il s&apos;agit aussi de
                  retrouver sa voix, sa capacité d&apos;agir et une façon plus juste d&apos;habiter son rôle.
                </p>
                <p className="text-sm leading-relaxed text-stone-600">
                  Happy Humans donne un cadre à cette ambition: aider des humains et des
                  organisations à se transformer sans se trahir.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-stone-50 py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6 md:px-10">
            <div className="mb-14">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Ce qui guide la pratique</p>
              <h2 className="text-3xl font-serif font-light leading-tight text-stone-900 md:text-4xl">
                Une approche qui cherche moins à lisser
                <br />
                <em className="text-amber-800">qu&apos;à faire émerger le vrai.</em>
              </h2>
            </div>
            <div className="space-y-10">
              {[
                {
                  num: '01',
                  titre: 'Présence et authenticité',
                  texte:
                    "Le coaching sert à retrouver une posture vivante et crédible, pas à ajouter une couche de discours sur une fatigue déjà présente.",
                },
                {
                  num: '02',
                  titre: 'Profondeur praticable',
                  texte:
                    "La philosophie aide à clarifier les tensions, les croyances et les contradictions. Le coaching transforme cette clarté en mouvement praticable.",
                },
                {
                  num: '03',
                  titre: 'Transformation durable',
                  texte:
                    "L'objectif n'est pas seulement de résoudre un sujet immédiat, mais d'installer un changement plus conscient, plus stable et plus aligné.",
                },
              ].map((item) => (
                <div key={item.num} className="grid items-start gap-6 md:grid-cols-[80px_1fr]">
                  <span className="select-none text-5xl font-serif font-light leading-none text-stone-200">{item.num}</span>
                  <div>
                    <h3 className="mb-2 text-base font-semibold text-stone-900">{item.titre}</h3>
                    <p className="text-sm leading-relaxed text-stone-500">{item.texte}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-stone-900 py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Conviction</p>
            <blockquote className="text-2xl font-serif font-light leading-relaxed text-white md:text-4xl">
              &ldquo;La clarté ne naît pas d&apos;une réponse toute faite, mais d&apos;un espace où l&apos;on peut enfin penser, sentir et choisir autrement.&rdquo;
            </blockquote>
            <p className="mt-8 text-sm text-stone-500">Monica Schneider</p>
          </div>
        </section>

        <section className="bg-[#f7f6f2] py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <p className="mb-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Et maintenant ?</p>
            <div className="grid gap-6 md:grid-cols-2">
              <Link
                href="/coaching"
                className="group block rounded-2xl border border-stone-100 bg-white p-8 shadow-sm transition-all hover:border-amber-200 hover:shadow-md"
              >
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-800">Coaching</p>
                <h3 className="mb-3 text-2xl font-serif font-light text-stone-900 transition-colors group-hover:text-amber-800">
                  Accompagnement individuel
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-stone-500">
                  Leadership, transitions, confiance, carrière, créativité, alignement et sens.
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 transition-all group-hover:gap-3">
                  Voir le coaching →
                </span>
              </Link>
              <Link
                href="/entreprises"
                className="group block rounded-2xl border border-stone-100 bg-white p-8 shadow-sm transition-all hover:border-amber-200 hover:shadow-md"
              >
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-800">Entreprises</p>
                <h3 className="mb-3 text-2xl font-serif font-light text-stone-900 transition-colors group-hover:text-amber-800">
                  Leadership, ateliers et transformation
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-stone-500">
                  Un cadre pour accompagner les dirigeants, les équipes et les cultures en mouvement.
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 transition-all group-hover:gap-3">
                  Explorer les offres →
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
