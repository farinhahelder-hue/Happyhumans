'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULTS = {
  hero_image:       '',
  hero_badge:       'À propos',
  page_title:       'Leadership coaching en profondeur',
  intro_text:       "Une pratique née au croisement de l'entreprise, du branding, de la transformation humaine et de la pratique philosophique.",
  // Parcours section
  parcours_badge:   'Parcours',
  parcours_title:   'Le parcours',
  parcours_subtitle: 'Deviens qui tu es',
  // Bio paragraphs
  bio_p1: "Les 10 premières années de ma carrière ont été dédiées au marketing international : développement de produits, de marques, d'histoires et d'expériences inoubliables, en Allemagne, en France, au Royaume-Uni et en Europe de l'Est pour Henkel, LVMH et L'Oréal.",
  bio_p2: "En 2020, j'ai mis fin à l'aventure L'Oréal et j'ai exploré de nouvelles vies. Je me suis formée à l'Executive Coaching. Une des choses qui m'avait le plus animée a été le développement des individus et des équipes. À travers cette formation et le début de ma pratique, j'ai découvert que ce métier était fait pour moi.",
  bio_p3: "Dans le coaching, j'arrivais à créer un espace où mes clients trouvent le courage de se confronter à leurs limites, à leurs doutes et à leurs vulnérabilités pour réaliser une transformation libératrice qui les rapproche de qui ils sont, de leur puissance et de leur sourire le plus confiant. Être témoin et guide dans cette démarche est un honneur qui m'anime plus que tout.",
  bio_p4: "Pour enrichir mon approche et retrouver un de mes amours de jeunesse, j'ai également entrepris un Master de Pratique Philosophique. J'ai fait mon mémoire sur le bonheur. Deux grandes conclusions : 1. Ce n'est pas le bonheur qui fait la différence mais comment on réagit dans l'adversité / quand la vie ne va pas comme on veut. 2. Une discipline ne suffit pas. Il faut comprendre son cerveau (neurosciences), savoir créer son bonheur (psychologie positive), repérer quand son inconscient reprend le dessus (psychologie classique), entraîner le cerveau à réduire le cortisol (méditation) et à challenger ses pensées (pratique philosophique).",
  bio_p5: "Je me suis construit une boîte à outils que j'ai appliquée à ma propre vie au cours des 6 dernières années — Happiness Design. Je l'ai aussi intégrée dans mes coachings et cela a fait la différence pour mes clients.",
  bio_p6: "Aujourd'hui je continue à accompagner des individus ou des entreprises aux moments clés des carrières (promotion et prise de poste, transitions, reconversion), pour booster le sens et l'engagement (conseil en communication interne, team coaching) et même pendant les moments clés du reste de la vie (mariage, séparation, parentalité, deuil, retraite, fin de vie).",
  bio_p7: "Ma conviction, ligne directrice dans toutes mes interventions, est simple. Pour chaque nouvelle étape, nous devons entreprendre une transformation en tant qu'individu ou en tant qu'équipe. Je suis à vos côtés avec ma boîte à outils multidisciplinaire pour coller au mieux à votre chemin unique.",
  bio_p8: "Je souhaite aussi rendre cette boîte à outils du bonheur — même dans une vie chaotique — accessible au plus grand nombre. Ce projet s'appelle Happiness Design.",
  photo:            '',
  // Accompagnement section
  acc_badge:       'Accompagnement',
  acc_title:       'Mes coachings et mentorings',
  acc_subtitle:    '2 approches complémentaires',
  coaching_label:   'Coaching',
  coaching_text:    "Le coaching est une danse entre le coach et le coaché. À travers les questions du coach, le coaché réfléchit, change de perspective, fait l'expérience de révélations, de aha moments et d'eurekas ! Il ou elle trouve en soi les meilleures solutions pour avancer sereinement vers son objectif. Le coaché design un plan d'action clair et daté. Il ressort de la séance avec un sentiment de clarté, une énergie renouvelée et souvent un sourire confiant. À noter que ma pratique de coaching est enrichie, quand la situation s'y prête, par de la philosophie pratique.",
  coaching_cta:    'Voir le coaching →',
  mentoring_label: 'Mentoring',
  mentoring_text:  "Je vous offre mes conseils sur une problématique alignée avec mon expertise. — Comment être visible tout en restant authentique ? — Comment démontrer du leadership et signaler que nous sommes prêts pour la next step ? — Quel plan de communication interne mettre en place pour rebooster l'engagement ? — Comment naviguer les différences de communication au sein d'environnements multiculturels ?",
  mentoring_cta:   'Me contacter →',
  // Happiness Design CTA
  hd_badge:        'Happiness Design',
  hd_text:         'Je souhaite rendre cette boîte à outils du bonheur, même dans une vie chaotique, accessible au plus grand nombre. Ce projet s\'appelle Happiness Design.',
  hd_cta:          "Pour en savoir plus, c'est par ici →",
  // Final CTA
  footer_cta_title: "Envie d'en savoir plus ?",
  footer_cta_coaching: 'Voir le coaching',
  footer_cta_booking:  'Réserver une séance (45 min)',
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
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">{c.get('hero_badge')}</p>
            <h1 className="mb-5 text-4xl font-serif font-light leading-[1.1] text-white md:text-6xl">{c.get('page_title')}</h1>
            <p className="max-w-xl text-base leading-relaxed text-gray-300">{c.get('intro_text', undefined, { multiline: true })}</p>
          </div>
        </section>

        {/* LE PARCOURS */}
        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="grid items-start gap-12 md:grid-cols-5 md:gap-20">
              <div className="space-y-5 md:col-span-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">{c.get('parcours_badge')}</p>
                <h2 className="text-3xl font-serif font-light leading-tight text-stone-900 md:text-4xl">{c.get('parcours_title')}</h2>
                <p className="text-lg text-stone-500 italic">{c.get('parcours_subtitle')}</p>
                <div className="text-base leading-relaxed text-stone-600 space-y-4">
                  <p>{c.get('bio_p1')}</p>
                  <p>{c.get('bio_p2')}</p>
                  <p>{c.get('bio_p3')}</p>
                  <p>{c.get('bio_p4')}</p>
                  <p>{c.get('bio_p5')}</p>
                  <p>{c.get('bio_p6')}</p>
                  <p>{c.get('bio_p7')}</p>
                  <p>{c.get('bio_p8')}</p>
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

        {/* MES COACHINGS ET MENTORINGS */}
        <section className="bg-[#f7f4ef] py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-800">{c.get('acc_badge')}</p>
              <h2 className="text-3xl font-serif font-light text-stone-900 md:text-4xl">{c.get('acc_title')}</h2>
              <p className="mt-3 text-stone-500 text-sm">{c.get('acc_subtitle', undefined, { multiline: true })}</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {/* Coaching */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#eef5f3]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
                </div>
                <h3 className="text-xl font-serif font-semibold text-stone-900 mb-4">{c.get('coaching_label')}</h3>
                <p className="text-sm leading-relaxed text-stone-600">{c.get('coaching_text')}</p>
                <Link href="/coaching" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b61] hover:underline">
                  {c.get('coaching_cta')}
                </Link>
              </div>

              {/* Mentoring */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#eef5f3]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <h3 className="text-xl font-serif font-semibold text-stone-900 mb-4">{c.get('mentoring_label')}</h3>
                <p className="text-sm leading-relaxed text-stone-600">{c.get('mentoring_text')}</p>
                <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b61] hover:underline">
                  {c.get('mentoring_cta')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* HAPPINESS DESIGN CTA */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-6 md:px-10">
            <div className="rounded-2xl bg-[#f5f0e8] border border-amber-200 p-8 md:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800 mb-3">{c.get('hd_badge')}</p>
              <p className="text-base leading-relaxed text-stone-700 mb-6">
                {c.get('hd_text', undefined, { multiline: true })}
              </p>
              <Link href="/happiness-design" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b61] hover:underline">
                {c.get('hd_cta')}
              </Link>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="bg-[#2f6b61] py-16 text-center">
          <div className="mx-auto max-w-2xl px-6">
            <h2 className="mb-4 text-2xl font-serif font-light text-white">{c.get('footer_cta_title')}</h2>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Link href="/coaching" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#2f6b61] hover:bg-amber-50 transition">
                {c.get('footer_cta_coaching')}
              </Link>
              <Link href="/booking" className="rounded-full border border-white px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition">
                {c.get('footer_cta_booking')}
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
