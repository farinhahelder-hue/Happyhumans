'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULTS = {
  hero_image:  '',
  page_title:  'Ce que disent ceux qui ont osé ce pas.',
  intro_text:  "Des témoignages de personnes et d'organisations accompagnées par Monica Schneider dans leurs transitions et transformations.",
}

export default function TemoignagesPage() {
  const c = useCmsContent('temoignages', DEFAULTS)
  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="relative flex h-[45vh] items-end overflow-hidden bg-stone-900">
          {c.hero_image && (
            <img src={c.hero_image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="relative z-10 max-w-3xl px-6 pb-14 md:px-16 md:pb-24">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Témoignages</p>
            <h1 className="mb-5 text-3xl font-serif font-light leading-[1.1] text-white md:text-5xl">{c.page_title}</h1>
            <p className="max-w-xl text-sm leading-relaxed text-gray-300">{c.intro_text}</p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#2f6b61] py-14 text-center">
          <div className="mx-auto max-w-xl px-6">
            <h2 className="mb-4 text-xl font-serif font-light text-white">Prêt·e à commencer votre parcours ?</h2>
            <Link href="/contact" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#2f6b61] hover:bg-amber-50 transition">
              Prendre contact
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
