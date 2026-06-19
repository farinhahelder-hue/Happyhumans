'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULTS = {
  hero_image:    '',
  page_title:    "Remettre de l'alignement et de l'élan dans vos équipes.",
  intro_text:    "Happy Humans accompagne les organisations avec une approche qui combine coaching de leadership, philosophical counselling et design d'expériences collectives.",
  section_image: '',
  section_title: 'Ce que nous proposons',
  section_text:  "Coaching de dirigeants et managers · Ateliers de cohésion · Accompagnement du changement · Séminaires sur mesure",
}

export default function EntreprisesPage() {
  const c = useCmsContent('entreprises', DEFAULTS)
  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="relative flex h-[55vh] items-end overflow-hidden bg-stone-900 md:h-[65vh]">
          <img
            src={c.hero_image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80'}
            alt="Entreprises"
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="relative z-10 max-w-3xl px-6 pb-14 md:px-16 md:pb-24">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Entreprises & organisations</p>
            <h1 className="mb-5 text-4xl font-serif font-light leading-[1.1] text-white md:text-5xl">{c.page_title}</h1>
            <p className="max-w-xl text-base leading-relaxed text-gray-300">{c.intro_text}</p>
          </div>
        </section>

        {/* SECTION PRINCIPALE */}
        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div className="space-y-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Offres</p>
                <h2 className="text-3xl font-serif font-light leading-tight text-stone-900">{c.section_title}</h2>
                <div className="text-base leading-relaxed text-stone-600 space-y-4">
                  {c.section_text.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                </div>
                <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b61] hover:underline mt-2">
                  Discuter de votre projet →
                </Link>
              </div>
              {c.section_image ? (
                <img src={c.section_image} alt={c.section_title} className="rounded-2xl object-cover shadow-lg h-72 w-full" />
              ) : (
                <div className="rounded-2xl bg-gradient-to-br from-stone-100 to-stone-200 h-72 flex items-center justify-center">
                  <span className="text-6xl opacity-20">🏢</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#2f6b61] py-16 text-center">
          <div className="mx-auto max-w-xl px-6">
            <h2 className="mb-4 text-2xl font-serif font-light text-white">Un projet ? Une question ?</h2>
            <Link href="/contact" className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#2f6b61] hover:bg-amber-50 transition">
              Prendre contact
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
