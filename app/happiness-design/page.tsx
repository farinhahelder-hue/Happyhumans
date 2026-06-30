'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULTS = {
  // Hero
  hero_badge:    'Programme',
  page_title:    'Happiness Design',
  page_subtitle: '12 séances pour reprendre les rênes de votre vie et de votre bonheur — au boulot et ailleurs.',
  intro_text:    "Neurosciences, psychologie positive, philosophie pratique, design thinking — toutes les disciplines au service d'une transformation durable, pour que vous repreniez pleinement les rênes de votre vie.",
  hero_cta:      'Séance découverte gratuite (45 min)',
  // Pour qui section
  pourqui_badge:   'Pour qui',
  pourqui_title:   'Ce programme est fait pour vous si…',
  pourqui_1_title: 'Vous traversez une transition',
  pourqui_1_desc:  "Prise de poste, reconversion, promotion, départ, retraite, parentalité, séparation. Un nouveau chapitre s'ouvre — vous voulez l'aborder avec clarté.",
  pourqui_2_title: 'Vous avez perdu le fil',
  pourqui_2_desc:  "Le boulot tourne, mais quelque chose sonne creux. Vous fonctionnez, mais vous n'habitez plus vraiment votre vie.",
  pourqui_3_title: 'Vous voulez reprendre les rênes',
  pourqui_3_desc:  "Pas juste 'aller mieux' — reprendre activement en main votre bonheur, vos relations, votre impact. Avec des outils concrets, pas du développement personnel vague.",
  // Program section
  program_badge:       'Le programme',
  program_title:       '12 séances + 4 follow-ups',
  step_01_num: '01', step_01_title: 'Comment ça marche',       step_01_desc: 'Neurosciences + gratitude',
  step_02_num: '02', step_02_title: 'Audit de sa vie',         step_02_desc: 'Life Design / Bonheur',
  step_03_num: '03', step_03_title: 'Audit du boulot',         step_03_desc: 'Design Thinking appliqué à votre vie professionnelle',
  step_04_num: '04', step_04_title: 'Audit des forces',       step_04_desc: 'Identifier vos ressources et atouts profonds',
  step_05_num: '05', step_05_title: 'Forces pratiquées',       step_05_desc: "Via Character Strengths — lesquelles activez-vous vraiment ?",
  step_06_num: '06', step_06_title: "L'échec",                 step_06_desc: "Changer son rapport à l'échec — audit des freins",
  step_07_num: '07', step_07_title: 'Audit des freins',       step_07_desc: "Syndrome de l'imposteur · Attachement (TA) · Peurs (fears)",
  step_08_num: '08', step_08_title: 'Homo risibilis',          step_08_desc: "Imparfait mais impactant — l'action salvatrice",
  step_09_num: '09', step_09_title: 'V1 / V2',                step_09_desc: 'Qui je suis, qui je veux devenir',
  step_10_num: '10', step_10_title: 'Les 3 métamorphoses',    step_10_desc: 'Les trois transformations clés de votre parcours',
  step_11_num: '11', step_11_title: "Child's Plan",            step_11_desc: 'Jalons avec rappels pour ancrer les engagements',
  step_12_num: '12', step_12_title: 'Follow-ups × 4',         step_12_desc: '4 sessions de suivi pour consolider et ancrer le changement',
  // Boîte à outils
  tools_badge:       'Programme',
  tools_title:       'Une boîte à outils multidisciplinaire',
  tools_intro_1:     "Ce n'est pas le bonheur qui fait la différence, mais comment on réagit dans l'adversité. Et une seule discipline ne suffit pas.",
  tools_intro_2:     "Happiness Design mêle neurosciences, psychologie positive, psychologie classique, méditation, pratique philosophique et design thinking — pour coller au plus près de votre chemin unique.",
  tools_origin_label:'L\'origine',
  tools_origin_text: "Cette méthode est née d'un mémoire de Master de Pratique Philosophique sur le bonheur, et de 6 ans d'expérimentation personnelle par Monica Schneider.",
  tools_conclusions_label: "Deux conclusions fondatrices :",
  tools_conclusion_1: "Ce n'est pas le bonheur qui fait la différence, c'est comment on réagit dans l'adversité.",
  tools_conclusion_2: "Une seule discipline ne suffit pas. Il faut comprendre son cerveau, savoir créer son bonheur, repérer quand l'inconscient reprend le dessus, entraîner son cerveau à réduire le cortisol et challenger ses pensées.",
  tools_claim:       "Happy Humans est la seule pratique de coaching en France qui intègre ces 6 disciplines dans un programme cohérent.",
  // Pricing section
  pricing_badge:           'Investissement',
  pricing_title:           'Un programme sur mesure',
  format_label:            'Format',
  format_value:            '12 séances + 4 follow-ups',
  duration_label:          'Durée',
  duration_value:          '60 min',
  rhythm_label:            'Rythme',
  rhythm_value:            '1 séance / 2 semaines',
  price_label:             'Tarif',
  price_value:             'Sur devis',
  cta_label:               'Demander un devis →',
  program_complete_features: "12 séances d'1h en individuel\n4 sessions de suivi post-programme\nOutils et exercices entre les séances\nEn ligne ou en présentiel (Paris)",
  program_complete_cta:    'Réserver une séance découverte →',
  discovery_label:         'Séance découverte',
  discovery_price:         'Offerte',
  discovery_unit:          '45 min · Sans engagement',
  discovery_features:      "Échange sur votre situation\nPrésentation du programme\nQuestions / réponses\nDécision libre à l'issue",
  discovery_cta:           'Réserver maintenant →',
  // CTA
  cta_title:    "Prêt·e à reprendre les rênes ?",
  cta_subtitle: 'Commençons par une séance découverte de 45 min — gratuite et sans engagement.',
  cta_button:   'Réserver ma séance découverte →',
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

  const getStep = (i: number) => {
    const num = String(i + 1).padStart(2, '0')
    const titleKey = `step_${num}_title` as keyof typeof DEFAULTS
    const descKey = `step_${num}_desc` as keyof typeof DEFAULTS
    return {
      n: num,
      title: (c[titleKey] as string) || (DEFAULTS[titleKey] as string) || '',
      desc: (c[descKey] as string) || (DEFAULTS[descKey] as string) || '',
    }
  }

  const steps = Array.from({ length: 12 }, (_, i) => getStep(i))

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
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-amber-400">{c.get('hero_badge')}</p>
            <h1 className="text-4xl font-serif font-light leading-tight text-white md:text-6xl">{c.get('page_title')}</h1>
            <p className="mt-5 text-xl font-serif font-light text-amber-300 md:text-2xl">{c.get('page_subtitle', undefined, { multiline: true })} <em className="text-stone-400 text-base">— par Happy Humans</em></p>
            <p className="mt-7 text-base leading-relaxed text-stone-300 max-w-2xl mx-auto">{c.get('intro_text', undefined, { multiline: true })}</p>
            <div className="mt-10">
              <Link href="/booking?from=happiness-design" className="rounded-full bg-[#2d5f54] px-8 py-3.5 text-sm font-semibold text-white shadow hover:bg-[#1e3a34] transition">
                {c.get('hero_cta')}
              </Link>
            </div>
          </div>
        </section>

        {/* POUR QUI ? */}
        <section className="bg-white px-6 py-16 md:py-20 md:px-10">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">{c.get('pourqui_badge')}</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">{c.get('pourqui_title')}</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-[#f7f4ef] rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                </div>
                <h3 className="text-sm font-semibold text-stone-900 mb-2">{c.get('pourqui_1_title')}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{c.get('pourqui_1_desc', undefined, { multiline: true })}</p>
              </div>
              <div className="bg-[#f7f4ef] rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="11" y2="16"/></svg>
                </div>
                <h3 className="text-sm font-semibold text-stone-900 mb-2">{c.get('pourqui_2_title')}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{c.get('pourqui_2_desc', undefined, { multiline: true })}</p>
              </div>
              <div className="bg-[#f7f4ef] rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                </div>
                <h3 className="text-sm font-semibold text-stone-900 mb-2">{c.get('pourqui_3_title')}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{c.get('pourqui_3_desc', undefined, { multiline: true })}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 12 ÉTAPES */}
        <section className="bg-[#f5f0e8] px-6 py-20 md:py-28 md:px-10">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">{c.get('program_badge')}</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">{c.get('program_title')}</h2>
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
          </div>
        </section>

        {/* BOÎTE À OUTILS */}
        <section className="bg-white px-6 py-16 md:py-20 md:px-10">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">{c.get('tools_badge')}</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 mb-6 md:text-3xl">{c.get('tools_title')}</h2>
              <p className="text-base leading-relaxed text-stone-600 mb-4">{c.get('tools_intro_1')}</p>
              <p className="text-base leading-relaxed text-stone-600">{c.get('tools_intro_2')}</p>
            </div>

            {/* L'ORIGINE */}
            <div className="rounded-2xl bg-[#f5f0e8] border border-amber-200 p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800 mb-4">{c.get('tools_origin_label')}</p>
              <div className="text-sm leading-relaxed text-stone-600 space-y-4">
                <p>{c.get('tools_origin_text', undefined, { multiline: true })}</p>
                <p><strong className="text-stone-800">{c.get('tools_conclusions_label')}</strong></p>
                <ol className="space-y-2 ml-4 list-decimal">
                  <li>{c.get('tools_conclusion_1')}</li>
                  <li>{c.get('tools_conclusion_2')}</li>
                </ol>
                <p className="font-medium text-stone-700">{c.get('tools_claim')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* FORMAT & TARIF */}
        <section className="bg-[#f7f4ef] px-6 py-16 md:py-20 md:px-10">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">{c.get('pricing_badge')}</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">{c.get('pricing_title')}</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Programme complet */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-800 mb-2 mt-3">{c.get('pricing_title')}</p>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">{c.get('format_label')}</span>
                    <span className="font-medium text-stone-900">{c.get('format_value')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">{c.get('duration_label')}</span>
                    <span className="font-medium text-stone-900">{c.get('duration_value')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">{c.get('rhythm_label')}</span>
                    <span className="font-medium text-stone-900">{c.get('rhythm_value')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">{c.get('price_label')}</span>
                    <span className="font-medium text-stone-900">{c.get('price_value')}</span>
                  </div>
                </div>
                <Link href="/contact" className="block rounded-full bg-[#2d5f54] py-3 text-center text-sm font-semibold text-white hover:bg-[#1e3a34] transition">
                  {c.get('cta_label')}
                </Link>
              </div>
              {/* Séance découverte */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-800 mb-2 mt-3">{c.get('discovery_label')}</p>
                <p className="text-3xl font-serif font-semibold text-stone-900">{c.get('discovery_price')}</p>
                <p className="text-xs text-stone-400 mb-6">{c.get('discovery_unit')}</p>
                <ul className="space-y-2 mb-8">
                  {c.discovery_features.split('\n').map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                      <span className="text-[#2d5f54] font-bold mt-0.5">✓</span>{item}
                    </li>
                  ))}
                </ul>
                <Link href="/booking?from=happiness-design" className="block rounded-full border border-[#2d5f54] py-3 text-center text-sm font-semibold text-[#2d5f54] hover:bg-[#2d5f54] hover:text-white transition">
                  {c.get('discovery_cta')}
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* CTA FINAL */}
        <section className="bg-[#2d5f54] py-16 text-center">
          <div className="mx-auto max-w-xl px-6">
            <h2 className="mb-4 text-2xl font-serif font-light text-white">{c.get('cta_title')}</h2>
            <p className="text-sm text-emerald-100 mb-7">{c.get('cta_subtitle', undefined, { multiline: true })}</p>
            <Link href="/booking?from=happiness-design" className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#2d5f54] hover:bg-amber-50 transition">
              {c.get('cta_button')}
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
