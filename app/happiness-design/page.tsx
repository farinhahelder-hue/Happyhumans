'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULTS = {
  page_title:    'Happiness Design™',
  page_subtitle: '12 séances pour reprendre les rênes de votre vie et de votre bonheur — au boulot et ailleurs.',
  intro_text:    "Neurosciences, psychologie positive, philosophie pratique, design thinking — toutes les disciplines au service d'une transformation durable, pour que vous repreniez pleinement les rênes de votre vie.",
  program_hd_price:    'À partir de 2 400 €',
  program_poste_price: 'À partir de 1 700 €',
  step_01_title: 'Comment ça marche',
  step_02_title: 'Audit de sa vie',
  step_03_title: 'Audit du boulot',
  step_04_title: 'Audit des forces',
  step_05_title: 'Forces pratiquées',
  step_06_title: "L'échec",
  step_07_title: 'Audit des freins',
  step_08_title: 'Homo risibilis',
  step_09_title: 'V1 / V2',
  step_10_title: 'Les 3 métamorphoses',
  step_11_title: "Child's Plan",
  step_12_title: 'Follow-ups × 4',
}

const STEP_DESCS = [
  'Neurosciences + gratitude',
  'Life Design / Bonheur',
  'Design Thinking appliqué à votre vie professionnelle',
  'Identifier vos ressources et atouts profonds',
  "Via Character Strengths — lesquelles activez-vous vraiment ?",
  "Changer son rapport à l'échec — audit des freins",
  "Syndrome de l'imposteur · Attachement (TA) · Peurs (fears)",
  "Imparfait mais impactant — l'action salvatrice",
  'Qui je suis, qui je veux devenir',
  'Les trois transformations clés de votre parcours',
  'Jalons avec rappels pour ancrer les engagements',
  '4 sessions de suivi pour consolider et ancrer le changement',
]

const POUR_QUI = [
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
    title: 'Vous traversez une transition',
    text: "Prise de poste, reconversion, promotion, départ, retraite, parentalité, séparation. Un nouveau chapitre s'ouvre — vous voulez l'aborder avec clarté.",
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="11" y2="16"/></svg>,
    title: 'Vous avez perdu le fil',
    text: 'Le boulot tourne, mais quelque chose sonne creux. Vous fonctionnez, mais vous n\'habitez plus vraiment votre vie.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
    title: 'Vous voulez reprendre les rênes',
    text: "Pas juste 'aller mieux' — reprendre activement en main votre bonheur, vos relations, votre impact. Avec des outils concrets, pas du développement personnel vague.",
  },
]

export default function HappinessDesignPage() {
  const c = useCmsContent('happiness-design', DEFAULTS)

  const getStepTitle = (i: number): string => {
    const key = `step_${String(i + 1).padStart(2, '0')}_title` as keyof typeof DEFAULTS
    return (c[key] as string) || (DEFAULTS[key] as string) || ''
  }

  const steps = STEP_DESCS.map((desc, i) => ({
    n: String(i + 1).padStart(2, '0'),
    title: getStepTitle(i),
    desc,
  }))

  return (
    <>
      <Header />
      <main className="pt-[72px]">

        {/* HERO */}
        <section className="bg-stone-900 px-6 py-24 md:py-32 md:px-10 text-center relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1600&q=80&auto=format&fit=crop"
            alt="Lumière dorée symbolisant la transformation et le bonheur"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-amber-400">Programme</p>
            <h1 className="text-4xl font-serif font-light leading-tight text-white md:text-6xl">{c.page_title}</h1>
            <p className="mt-5 text-xl font-serif font-light text-amber-300 md:text-2xl">{c.page_subtitle} <em className="text-stone-400 text-base">— par Happy Humans</em></p>
            <p className="mt-7 text-base leading-relaxed text-stone-300 max-w-2xl mx-auto">{c.intro_text}</p>
            <div className="mt-10">
              <Link href="/booking?from=happiness-design" className="rounded-full bg-[#2d5f54] px-8 py-3.5 text-sm font-semibold text-white shadow hover:bg-[#1e3a34] transition">
                Séance découverte gratuite (45 min)
              </Link>
            </div>
          </div>
        </section>

        {/* POUR QUI ? */}
        <section className="bg-white px-6 py-16 md:py-20 md:px-10">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Pour qui</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">Ce programme est fait pour vous si…</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {POUR_QUI.map(({ icon, title, text }) => (
                <div key={title} className="bg-[#f7f4ef] rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                    {icon}
                  </div>
                  <h3 className="text-sm font-semibold text-stone-900 mb-2">{title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 12 ÉTAPES */}
        <section className="bg-[#f5f0e8] px-6 py-20 md:py-28 md:px-10">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Le programme</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">12 séances, 12 transformations</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {steps.map(({ n, title, desc }) => (
                <div key={n} className="flex gap-5 bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#2d5f54] flex items-center justify-center text-white text-xs font-bold">
                    {n}
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 mb-1">{title}</h3>
                    <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 p-6 text-center">
              <p className="text-sm text-stone-700">
                <strong className="text-[#2d5f54]">+ 4 sessions de suivi</strong> incluses pour ancrer durablement les changements.
              </p>
            </div>
          </div>
        </section>

        {/* BOÎTE À OUTILS */}
        <section className="bg-white px-6 py-16 md:py-20 md:px-10">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Programme</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 mb-6 md:text-3xl">Une boîte à outils multidisciplinaire</h2>
              <p className="text-base leading-relaxed text-stone-600 mb-4">
                Ce n&apos;est pas le bonheur qui fait la différence, mais comment on réagit dans l&apos;adversité. Et une seule discipline ne suffit pas.
              </p>
              <p className="text-base leading-relaxed text-stone-600">
                Happiness Design mêle <strong>neurosciences</strong>, <strong>psychologie positive</strong>, <strong>psychologie classique</strong>, <strong>méditation</strong>, <strong>pratique philosophique</strong> et <strong>design thinking</strong> — pour coller au plus près de votre chemin unique.
              </p>
            </div>

            {/* L'ORIGINE */}
            <div className="rounded-2xl bg-[#f5f0e8] border border-amber-200 p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800 mb-4">L&apos;origine</p>
              <div className="text-sm leading-relaxed text-stone-600 space-y-4">
                <p>Cette méthode est née d&apos;un mémoire de Master de Pratique Philosophique sur le bonheur, et de 6 ans d&apos;expérimentation personnelle par Monica Schneider.</p>
                <p><strong className="text-stone-800">Deux conclusions fondatrices :</strong></p>
                <ol className="space-y-2 ml-4 list-decimal">
                  <li>Ce n&apos;est pas le bonheur qui fait la différence, c&apos;est comment on réagit dans l&apos;adversité.</li>
                  <li>Une seule discipline ne suffit pas. Il faut comprendre son cerveau, savoir créer son bonheur, repérer quand l&apos;inconscient reprend le dessus, entraîner son cerveau à réduire le cortisol et challenger ses pensées.</li>
                </ol>
                <p className="font-medium text-stone-700">Happy Humans est la seule pratique de coaching en France qui intègre ces 6 disciplines dans un programme cohérent.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FORMAT & TARIF */}
        <section className="bg-[#f7f4ef] px-6 py-16 md:py-20 md:px-10">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Investissement</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">Un programme sur mesure</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Programme complet */}
              <div className="bg-white rounded-2xl p-8 shadow-sm relative">
                <div className="absolute -top-3 left-6">
                  <span className="bg-[#2d5f54] text-white text-xs font-semibold px-3 py-1 rounded-full">Le plus populaire</span>
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-800 mb-2 mt-3">Programme complet</p>
                <p className="text-3xl font-serif font-semibold text-stone-900">{c.program_hd_price || 'À partir de 2 400 €'}</p>
                <p className="text-xs text-stone-400 mb-6">soit 200€/séance · 12 séances + 4 follow-ups</p>
                <ul className="space-y-2 mb-8">
                  {["12 séances d'1h en individuel", '4 sessions de suivi post-programme', 'Outils et exercices entre les séances', 'En ligne ou en présentiel (Paris)'].map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-stone-600">
                      <span className="text-[#2d5f54] font-bold mt-0.5">✓</span>{item}
                    </li>
                  ))}
                </ul>
                <Link href="/booking?from=happiness-design" className="block rounded-full bg-[#2d5f54] py-3 text-center text-sm font-semibold text-white hover:bg-[#1e3a34] transition">
                  Réserver une séance découverte →
                </Link>
              </div>
              {/* Séance découverte */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-800 mb-2 mt-3">Séance découverte</p>
                <p className="text-3xl font-serif font-semibold text-stone-900">Offerte</p>
                <p className="text-xs text-stone-400 mb-6">45 min · Sans engagement</p>
                <ul className="space-y-2 mb-8">
                  {['Échange sur votre situation', 'Présentation du programme', 'Questions / réponses', 'Décision libre à l\'issue'].map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-stone-600">
                      <span className="text-[#2d5f54] font-bold mt-0.5">✓</span>{item}
                    </li>
                  ))}
                </ul>
                <Link href="/booking?from=happiness-design" className="block rounded-full border border-[#2d5f54] py-3 text-center text-sm font-semibold text-[#2d5f54] hover:bg-[#2d5f54] hover:text-white transition">
                  Réserver maintenant →
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* CTA FINAL */}
        <section className="bg-[#2d5f54] py-16 text-center">
          <div className="mx-auto max-w-xl px-6">
            <h2 className="mb-4 text-2xl font-serif font-light text-white">Prêt·e à reprendre les rênes ?</h2>
            <p className="text-sm text-emerald-100 mb-7">Commençons par une séance découverte de 45 min — gratuite et sans engagement.</p>
            <Link href="/booking?from=happiness-design" className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#2d5f54] hover:bg-amber-50 transition">
              Réserver ma séance découverte →
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
