'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULTS = {
  hero_badge:         'Sparring Partner',
  hero_title:         "Un regard extérieur stratégique par une pair qui comprend vos enjeux",
  hero_desc:          "Ex-L'Oreal, ex-LVMH, 5 langues, philo-coaching. Monica vous offre le recul qu'un manager ne peut pas toujours trouver en interne.",
  hero_cta_primary:   'Réserver une session',
  hero_cta_secondary: 'Poser une question',
  section_badge:      "Pour quoi faire ?",
  section_title:      'Les situations qui appellent un sparring partner',
  use_case_1_title:  'Préparer un pitch',
  use_case_1_desc:   'Monica joue le contre-argument, affûte vos arguments et renforce votre posture.',
  use_case_2_title:  'Challenger une stratégie',
  use_case_2_desc:   "Un regard extérieur de quelqu'un qui connaît vos enjeux métier.",
  use_case_3_title:  'Prise de poste',
  use_case_3_desc:   'Nouvelle équipe, nouvelles attentes. Prendre de la hauteur rapidement.',
  use_case_4_title:  'Communication multiculturelle',
  use_case_4_desc:   '5 pays, 5 langues. Les codes implicites qui font ou défont une relation.',
  use_case_5_title:  'Décision difficile',
  use_case_5_desc:   'Partir ? Rester ? Négocier ? Un interlocuteur de confiance pour y voir clair.',
  why_section_badge: 'Pourquoi Monica ?',
  why_section_title: "Ex-L'Oreal, ex-LVMH, philo-coach et Happiness Design",
  experience_items:   "10 ans marketing — Henkel, LVMH, L'Oréal\nExecutive Coach certifiée AoEC & EMCC\nMaster en Philosophical Counselling\n5 langues : FR, EN, RO, DE, ES\nMéthode Happiness Design\n5 pays, 12 villes",
  cta_title:          'Prêt à challenger vos idées ?',
  cta_desc:           'Session 60 à 90 min. Conversation découverte de 30 min offerte.',
  cta_primary:       'Réserver une session',
  cta_secondary:     'Poser une question',
}

export default function SparringPartnerPage() {
  const c = useCmsContent('sparring-partner', DEFAULTS)

  const useCases = [
    { title: c.use_case_1_title, desc: c.use_case_1_desc },
    { title: c.use_case_2_title, desc: c.use_case_2_desc },
    { title: c.use_case_3_title, desc: c.use_case_3_desc },
    { title: c.use_case_4_title, desc: c.use_case_4_desc },
    { title: c.use_case_5_title, desc: c.use_case_5_desc },
  ]

  const experienceItems = c.experience_items.split('\n').filter(Boolean)

  return (
    <>
      <Header />
      <main className="pt-[72px]">
        <section className="relative overflow-hidden bg-stone-900 px-6 py-24 text-center md:py-32 md:px-10">
          <img src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1600&q=80&auto=format&fit=crop" alt="Discussion stratégique" className="absolute inset-0 h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/40 to-stone-900/70" />
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-amber-400">{c.hero_badge}</p>
            <h1 className="text-4xl font-serif font-light leading-tight text-white md:text-6xl">{c.hero_title}</h1>
            <p className="mt-6 text-lg leading-relaxed text-stone-300 max-w-xl mx-auto">{c.hero_desc}</p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Link href="/booking?from=sparring-partner" className="rounded-full bg-[#2f6b61] px-7 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-[#235249] transition">{c.hero_cta_primary}</Link>
              <Link href="/contact" className="rounded-full border border-stone-400 px-7 py-3.5 text-sm font-semibold text-stone-200 hover:border-white hover:text-white transition">{c.hero_cta_secondary}</Link>
            </div>
          </div>
        </section>

        <section className="bg-[#f5f0e8] px-6 py-16 md:py-20 md:px-10">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">{c.section_badge}</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">{c.section_title}</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {useCases.map(({ title, desc }) => (
                <div key={title} className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-stone-900 mb-2">{title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-16 md:py-20 md:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">{c.why_section_badge}</p>
            <h2 className="text-2xl font-serif font-light text-stone-900 mb-8 md:text-3xl">{c.why_section_title}</h2>
            <div className="grid gap-4 sm:grid-cols-2 text-left mb-8">
              {experienceItems.map(item => (
                <div key={item} className="flex items-start gap-2 text-sm text-stone-600">
                  <span className="text-[#2f6b61] font-bold mt-0.5 flex-shrink-0">+</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#2f6b61] py-16 text-center">
          <div className="mx-auto max-w-xl px-6">
            <h2 className="mb-3 text-2xl font-serif font-light text-white">{c.cta_title}</h2>
            <p className="text-sm text-emerald-200 mb-8">{c.cta_desc}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking?from=sparring-partner" className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#2f6b61] hover:bg-amber-50 transition shadow">{c.cta_primary}</Link>
              <Link href="/contact" className="rounded-full border border-white px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition">{c.cta_secondary}</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
