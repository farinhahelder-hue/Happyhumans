'use client'
import { Fragment, type ReactNode } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useCmsContent } from '@/hooks/useCmsContent'
import { HAPPINESS_DESIGN_DEFAULTS } from '@/lib/cms-defaults/happiness-design'
import { PAGE_SECTIONS, resolveSections } from '@/lib/cms-sections'

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
  const c = useCmsContent('happiness-design', HAPPINESS_DESIGN_DEFAULTS)

  const getStep = (i: number) => {
    const num = String(i + 1).padStart(2, '0')
    const titleKey = `step_${num}_title` as keyof typeof HAPPINESS_DESIGN_DEFAULTS
    const descKey = `step_${num}_desc` as keyof typeof HAPPINESS_DESIGN_DEFAULTS
    return {
      n: num,
      title: (c[titleKey] as string) || (HAPPINESS_DESIGN_DEFAULTS[titleKey] as string) || '',
      desc: (c[descKey] as string) || (HAPPINESS_DESIGN_DEFAULTS[descKey] as string) || '',
    }
  }

  const steps = Array.from({ length: 12 }, (_, i) => getStep(i))

  // ── Sections centrales réordonnables via le CMS ──────────────
  const sectionsJsx: Record<string, ReactNode> = {
    hero: (
      <section className="bg-stone-900 px-6 py-24 md:py-32 md:px-10 text-center relative overflow-hidden">
        <img
          src={c.hero_image}
          alt={c.t_lumiere_doree_symbolisant_la}
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-amber-400">{c.get('hero_badge')}</p>
          <h1 className="text-4xl font-serif font-light leading-tight text-white md:text-6xl">{c.get('page_title')}</h1>
          <p className="mt-5 text-xl font-serif font-light text-amber-300 md:text-2xl">{c.get('page_subtitle', undefined, { multiline: true })} <em className="text-stone-400 text-base">{c.t_par_happy_humans}</em></p>
          <p className="mt-7 text-base leading-relaxed text-stone-300 max-w-2xl mx-auto">{c.get('intro_text', undefined, { multiline: true })}</p>
          <div className="mt-10">
            <Link href="/booking?from=happiness-design" className="rounded-full bg-[#2d5f54] px-8 py-3.5 text-sm font-semibold text-white shadow hover:bg-[#1e3a34] transition">
              {c.get('hero_cta')}
            </Link>
          </div>
        </div>
      </section>
    ),
    pourqui: (
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
    ),
    program: (
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
          <p className="mt-8 text-center text-sm font-medium text-amber-800">{c.get('program_followups_note')}</p>
        </div>
      </section>
    ),
    tools: (
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
    ),
    pricing: (
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
              <ul className="space-y-2 mb-6 border-t border-stone-100 pt-5">
                {c.program_complete_features.split('\n').filter(Boolean).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                    <span className="text-[#2d5f54] font-bold mt-0.5">✓</span>{item}
                  </li>
                ))}
              </ul>
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
    ),
    cta: (
      <section className="bg-[#2d5f54] py-16 text-center">
        <div className="mx-auto max-w-xl px-6">
          <h2 className="mb-4 text-2xl font-serif font-light text-white">{c.get('cta_title')}</h2>
          <p className="text-sm text-emerald-100 mb-7">{c.get('cta_subtitle', undefined, { multiline: true })}</p>
          <Link href="/booking?from=happiness-design" className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#2d5f54] hover:bg-amber-50 transition">
            {c.get('cta_button')}
          </Link>
        </div>
      </section>
    ),
  }

  // Ordre et affichage des sections : modifiables dans le CMS (admin → page → Structure)
  const sectionIds = resolveSections(PAGE_SECTIONS['happiness-design'], c.sections_layout)

  return (
    <>
      <Header />
      <main className="pt-[72px]">
        {sectionIds.map(id => (
          <Fragment key={id}>{sectionsJsx[id]}</Fragment>
        ))}
      </main>
      <Footer />
    </>
  )
}
