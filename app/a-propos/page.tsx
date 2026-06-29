'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULTS = {
  hero_image:       '',
  page_title:       'Leadership coaching en profondeur',
  intro_text:       "Une pratique née au croisement de l'entreprise, du branding, de la transformation humaine et de la pratique philosophique.",
  bio_title:        'Deviens qui tu es',
  bio_text:         "Les 10 premières années de ma carrière ont été dédiées au marketing international : développement de produits, de marques, d'histoires et d'expériences inoubliables, en Allemagne, en France, au Royaume-Uni et en Europe de l'Est pour Henkel, LVMH et L'Oréal.\n\nEn 2020, j'ai mis fin à l'aventure L'Oréal et j'ai exploré de nouvelles vies.\n\nJe me suis formée à l'Executive Coaching. Une des choses qui m'avait le plus animée a été le développement des individus et des équipes. À travers cette formation et le début de ma pratique, j'ai découvert que ce métier était fait pour moi.\n\nDans le coaching, j'arrivais à créer un espace où mes clients trouvent le courage de se confronter à leurs limites, à leurs doutes et à leurs vulnérabilités pour réaliser une transformation libératrice qui les rapproche de qui ils sont, de leur puissance et de leur sourire le plus confiant.\n\nÊtre témoin et guide dans cette démarche est un honneur qui m'anime plus que tout.\n\nPour enrichir mon approche et retrouver un de mes amours de jeunesse, j'ai également entrepris un Master de Pratique Philosophique. J'ai fait mon mémoire sur le bonheur.\n\nDeux grandes conclusions :\n1. Ce n'est pas le bonheur qui fait la différence, mais comment on réagit dans l'adversité — quand la vie ne va pas comme on veut.\n2. Une discipline ne suffit pas. Il faut comprendre son cerveau (neurosciences), savoir créer son bonheur (psychologie positive), repérer quand son inconscient reprend le dessus (psychologie classique), entraîner le cerveau à réduire le cortisol (méditation) et challenger ses pensées (pratique philosophique).\n\nJe me suis construit une boîte à outils que j'ai appliquée à ma propre vie au cours des 6 dernières années — Happiness Design. Je l'ai aussi intégrée dans mes coachings, et cela a fait la différence pour mes clients.\n\nAujourd'hui je continue à accompagner des individus ou des entreprises aux moments clés des carrières (promotion et prise de poste, transitions, reconversion), pour booster le sens et l'engagement (conseil en communication interne, team coaching) et même pendant les moments clés du reste de la vie (mariage, séparation, parentalité, deuil, retraite, fin de vie).\n\nMa conviction, ligne directrice dans toutes mes interventions, est simple. Pour chaque nouvelle étape, nous devons entreprendre une transformation en tant qu'individu ou en tant qu'équipe. Je suis à vos côtés avec ma boîte à outils multidisciplinaire pour coller au mieux à votre chemin unique.\n\nJe souhaite aussi rendre cette boîte à outils du bonheur, même dans une vie chaotique, accessible au plus grand nombre. Ce projet s'appelle Happiness Design.",
  photo:            '',
  mentoring_text:   "Je vous offre mes conseils sur une problématique alignée avec mon expertise : comment être visible tout en restant authentique, comment démontrer du leadership, quel plan de communication interne mettre en place, comment naviguer les différences culturelles.",
  coaching_text1:  "Le coaching est une danse entre le coach et le coaché. À travers les questions du coach, le coaché réfléchit, change de perspective, fait l'expérience de révélations. Il ou elle trouve en soi les meilleures solutions pour avancer sereinement vers son objectif.",
  coaching_text2:  "À noter : ma pratique de coaching est enrichie, quand la situation s'y prête, par de la philosophie pratique.",
}

export default function AProposPage() {
  const c = useCmsContent('a-propos', DEFAULTS)

  return (
    <>
      <Header />
      <main className="pt-[72px]">

        {/* HERO */}
        <section className="relative flex h-[55vh] items-end overflow-hidden bg-stone-900 md:h-[65vh]">
          <img
            src={c.hero_image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1400&q=80&auto=format&fit=crop'}
            alt="Monica Schneider — Executive Coach"
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="relative z-10 max-w-3xl px-6 pb-14 md:px-16 md:pb-24">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">À propos</p>
            <h1 className="mb-5 text-4xl font-serif font-light leading-[1.1] text-white md:text-6xl">{c.page_title}</h1>
            <p className="max-w-xl text-base leading-relaxed text-gray-300">{c.intro_text}</p>
          </div>
        </section>

        {/* MON HISTOIRE */}
        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="grid items-start gap-12 md:grid-cols-5 md:gap-20">
              <div className="space-y-5 md:col-span-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Mon histoire</p>
                <h2 className="text-3xl font-serif font-light leading-tight text-stone-900 md:text-4xl">{c.bio_title}</h2>
                <div className="text-base leading-relaxed text-stone-600 space-y-4">
                  {c.bio_text.split('\n').map((p, i) => p.trim() ? <p key={i}>{p}</p> : null)}
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                {c.photo ? (
                  <img src={c.photo} alt="Monica Schneider" className="rounded-2xl object-cover shadow-lg w-full h-80" />
                ) : (
                  <div className="rounded-2xl bg-gradient-to-br from-[#f5f0e8] to-[#eef5f3] h-80 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-[#2d5f54] flex items-center justify-center text-white text-2xl font-serif font-bold mx-auto mb-3">MS</div>
                      <p className="text-sm text-stone-500">Monica Schneider</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section className="bg-[#f5f0e8] py-16 md:py-20 px-6 md:px-10">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Parcours</p>
              <h2 className="text-3xl font-serif font-light text-stone-900 md:text-4xl">Une trajectoire entre deux continents et trois disciplines</h2>
            </div>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-[#2d5f54]/20 md:left-1/2" />
              <div className="space-y-8">
                {[
                  { year: '2008–2013', role: 'Brand Manager — Henkel', place: 'Allemagne · France · UK', desc: 'Développement de marques FMCG en Europe. Premières expériences de management multiculturel et de communication internationale.' },
                  { year: '2013–2017', role: 'Marketing Director — LVMH', place: 'Paris · Europe de l\'Est', desc: 'Direction marketing pour des marques de luxe. Management d\'équipes transversales, lancements produits, stratégie de communication.' },
                  { year: '2017–2020', role: 'Senior Director — L\'Oréal', place: 'Paris · International', desc: 'Responsabilité de P&L, équipes internationales, présence devant les comités de direction. La pression du haut niveau, vécue de l\'intérieur.' },
                  { year: '2020', role: 'Transition & exploration', place: 'Paris', desc: 'Fin de l\'aventure L\'Oréal. Exploration de nouvelles directions : coaching, philosophie, design du bonheur.' },
                  { year: '2021–2022', role: 'Formation Executive Coaching — AoEC', place: 'Paris · London', desc: 'Certification executive coaching. EMCC Practitioner. Début de la pratique de coaching avec les premiers clients.' },
                  { year: '2022–2024', role: 'Master Pratique Philosophique', place: 'Paris', desc: 'Mémoire sur le bonheur. Naissance de la méthode Happiness Design™ — fruit de 6 ans d\'expérimentation personnelle et professionnelle.' },
                  { year: '2024 →', role: 'Happy Humans', place: 'Paris · Distanciel', desc: 'Coaching individuel, sparring partner, Happiness Design™. Accompagnement de marketers, managers et dirigeants en transition.', current: true },
                ].map(({ year, role, place, desc, current }, i) => (
                  <div key={year} className={`relative flex gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="bg-white rounded-2xl p-5 shadow-sm ml-12 md:ml-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-bold text-[#2d5f54]">{year}</span>
                          {current && <span className="bg-[#2d5f54] text-white text-xs px-2 py-0.5 rounded-full font-semibold">Aujourd&apos;hui</span>}
                        </div>
                        <p className="text-sm font-semibold text-stone-900">{role}</p>
                        <p className="text-xs text-amber-700 mb-2">{place}</p>
                        <p className="text-xs text-stone-500 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                    <div className="absolute left-5 md:left-1/2 w-4 h-4 rounded-full border-2 border-[#2d5f54] bg-white transform md:-translate-x-1/2 mt-4 z-10 flex-shrink-0" style={{ background: current ? '#2d5f54' : 'white' }} />
                    <div className="flex-1 hidden md:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* MES COACHINGS ET MENTORINGS */}
        <section className="bg-[#f7f4ef] py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Accompagnement</p>
              <h2 className="text-3xl font-serif font-light text-stone-900 md:text-4xl">Mes coachings et mentorings</h2>
              <p className="mt-3 text-stone-500 text-sm">2 approches complémentaires</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {/* Coaching */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#eef5f3]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
                </div>
                <h3 className="text-xl font-serif font-semibold text-stone-900 mb-4">Coaching</h3>
                <div className="text-sm leading-relaxed text-stone-600 space-y-3">
                  {(c.coaching_text1 || '').split('\n').map((p, i) => p.trim() ? <p key={`a-${i}`}>{p}</p> : null)}
                  {(c.coaching_text2 || '').split('\n').map((p, i) => p.trim() ? <p key={`b-${i}`}>{p}</p> : null)}
                </div>
                <Link href="/coaching" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b61] hover:underline">
                  Voir le coaching →
                </Link>
              </div>

              {/* Mentoring */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#eef5f3]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <h3 className="text-xl font-serif font-semibold text-stone-900 mb-4">Mentoring</h3>
                <div className="text-sm leading-relaxed text-stone-600 space-y-2">
                  {(c.mentoring_text || '').split('\n').map((p, i) => p.trim() ? <p key={i}>{p}</p> : null)}
                </div>
                <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b61] hover:underline">
                  Me contacter →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* HAPPINESS DESIGN CTA */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-6 md:px-10">
            <div className="rounded-2xl bg-[#f5f0e8] border border-amber-200 p-8 md:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800 mb-3">Happiness Design</p>
              <p className="text-base leading-relaxed text-stone-700 mb-6">
                Je souhaite rendre cette boîte à outils du bonheur, même dans une vie chaotique, accessible au plus grand nombre. Ce projet s&apos;appelle Happiness Design.
              </p>
              <Link href="/happiness-design" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b61] hover:underline">
                Pour en savoir plus, c&apos;est par ici →
              </Link>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="bg-[#2f6b61] py-16 text-center">
          <div className="mx-auto max-w-2xl px-6">
            <h2 className="mb-4 text-2xl font-serif font-light text-white">Envie d&apos;en savoir plus ?</h2>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Link href="/coaching" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#2f6b61] hover:bg-amber-50 transition">
                Voir le coaching
              </Link>
              <Link href="/booking" className="rounded-full border border-white px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition">
                Réserver une séance (45 min)
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
