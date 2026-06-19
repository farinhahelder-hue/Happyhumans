'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULTS = {
  hero_image:         '',
  hero_title:         "Il y a des moments où il faut réapprendre à habiter son rôle.",
  hero_subtitle:      "Monica Schneider accompagne des managers, dirigeants et personnes en transition qui veulent retrouver clarté, confiance et alignement.",
  coaching_b2c_image: '',
  coaching_b2c_title: 'Coaching individuel',
  coaching_b2c_text:  "Un espace pour ralentir, regarder ce qui se passe vraiment et construire un mouvement qui tient dans la durée.",
  coaching_b2b_image: '',
  coaching_b2b_title: 'Pour les entreprises',
  coaching_b2b_text:  "Coaching de dirigeants, ateliers de cohésion, accompagnement du changement et séminaires sur mesure.",
  form_intro:         'Décrivez votre enjeu ou posez une question — je vous répondrai sous 48h.',
  reassurance:        '100% confidentiel · Sans engagement · Réponse sous 48h',
}

export default function CoachingPage() {
  const c = useCmsContent('coaching', DEFAULTS)
  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="relative bg-gradient-to-br from-[#f7f2e9] via-white to-[#eef5f3] py-24 md:py-32 overflow-hidden">
          {c.hero_image && (
            <img src={c.hero_image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-15" />
          )}
          <div className="relative mx-auto max-w-6xl px-6 md:px-10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#8d5d2f]">Coaching individuel</p>
            <h1 className="max-w-4xl text-4xl font-serif font-light leading-tight text-stone-900 md:text-6xl">{c.hero_title}</h1>
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-stone-700">{c.hero_subtitle}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/contact" className="rounded-full bg-[#2f6b61] px-7 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-[#235249] transition">
                Prendre rendez-vous
              </Link>
            </div>
          </div>
        </section>

        {/* COACHING INDIVIDUEL */}
        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div className="space-y-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Individuel</p>
                <h2 className="text-3xl font-serif font-light leading-tight text-stone-900">{c.coaching_b2c_title}</h2>
                <div className="text-base leading-relaxed text-stone-600 space-y-3">
                  {c.coaching_b2c_text.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                </div>
                <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b61] hover:underline">
                  Me contacter →
                </Link>
              </div>
              {c.coaching_b2c_image ? (
                <img src={c.coaching_b2c_image} alt={c.coaching_b2c_title} className="rounded-2xl object-cover shadow-lg h-72 w-full" />
              ) : (
                <div className="rounded-2xl bg-gradient-to-br from-[#eef5f3] to-[#dde8e5] h-72 flex items-center justify-center">
                  <span className="text-6xl opacity-30">🌱</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* COACHING B2B */}
        <section className="bg-[#f7f4ef] py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              {c.coaching_b2b_image ? (
                <img src={c.coaching_b2b_image} alt={c.coaching_b2b_title} className="rounded-2xl object-cover shadow-lg h-72 w-full order-2 md:order-1" />
              ) : (
                <div className="rounded-2xl bg-gradient-to-br from-[#e8e0d5] to-[#d5ccc0] h-72 flex items-center justify-center order-2 md:order-1">
                  <span className="text-6xl opacity-30">🏢</span>
                </div>
              )}
              <div className="space-y-5 order-1 md:order-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Organisations</p>
                <h2 className="text-3xl font-serif font-light leading-tight text-stone-900">{c.coaching_b2b_title}</h2>
                <div className="text-base leading-relaxed text-stone-600 space-y-3">
                  {c.coaching_b2b_text.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                </div>
                <Link href="/entreprises" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b61] hover:underline">
                  Voir les offres entreprises →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT CTA */}
        <section className="bg-[#2f6b61] py-16">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="mb-3 text-2xl font-serif font-light text-white">Prêt·e à commencer ?</h2>
            <p className="mb-6 text-emerald-100 text-sm">{c.form_intro}</p>
            <Link href="/contact" className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#2f6b61] hover:bg-amber-50 transition">
              Prendre contact
            </Link>
            <p className="mt-4 text-xs text-emerald-200">{c.reassurance}</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
