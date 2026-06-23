'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULTS = {
  hero_image:    '',
  page_title:    'Monica Schneider — leadership, coaching et profondeur',
  intro_text:    "Une pratique née au croisement de l'entreprise, du branding, de la transformation humaine et du philosophical counselling.",
  bio_title:     'Une trajectoire entre direction, marque et accompagnement.',
  bio_text:      "10+ ans de leadership en marketing et transformation. Executive Coach certifiée AoEC et EMCC Practitioner. Master en Philosophical Counselling and Consultancy. Accompagnement en français, anglais et roumain.",
  valeurs_title: 'Ce qui oriente la pratique',
  valeurs_text:  "Authenticité, rigueur intellectuelle, présence et transformation durable.",
  photo:   '',
  photo_1: '',
  photo_2: '',
  photo_3: '',
}

export default function AProposPage() {
  const c = useCmsContent('a-propos', DEFAULTS)
  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="relative flex h-[55vh] items-end overflow-hidden bg-stone-900 md:h-[65vh]">
          <img
            src={c.hero_image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1400&q=80&auto=format&fit=crop'}
            alt="Portrait Monica Schneider"
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="relative z-10 max-w-3xl px-6 pb-14 md:px-16 md:pb-24">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">À propos</p>
            <h1 className="mb-5 text-4xl font-serif font-light leading-[1.1] text-white md:text-6xl">{c.page_title}</h1>
            <p className="max-w-xl text-base leading-relaxed text-gray-300">{c.intro_text}</p>
          </div>
        </section>

        {/* BIO */}
        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="grid items-center gap-12 md:grid-cols-5 md:gap-20">
              <div className="space-y-5 md:col-span-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Le parcours</p>
                <h2 className="text-3xl font-serif font-light leading-tight text-stone-900 md:text-4xl">{c.bio_title}</h2>
                <div className="text-base leading-relaxed text-stone-600 space-y-4">
                  {c.bio_text.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </div>
              <div className="md:col-span-2">
                {c.photo_1 ? (
                  <img src={c.photo_1} alt="Monica Schneider" className="rounded-2xl object-cover shadow-lg w-full h-80" />
                ) : (
                  <div className="rounded-2xl bg-gradient-to-br from-stone-100 to-stone-200 h-80 flex items-center justify-center">
                    <span className="text-6xl opacity-20">👤</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* VALEURS */}
        <section className="bg-[#f7f4ef] py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Approche</p>
                <h2 className="mb-6 text-3xl font-serif font-light leading-tight text-stone-900">{c.valeurs_title}</h2>
                <div className="text-base leading-relaxed text-stone-600 space-y-4">
                  {c.valeurs_text.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </div>
              {(c.photo_2 || c.photo_3) && (
                <div className="grid grid-cols-2 gap-4">
                  {c.photo_2 && <img src={c.photo_2} alt="Illustration" className="rounded-xl object-cover h-48 w-full" />}
                  {c.photo_3 && <img src={c.photo_3} alt="Illustration" className="rounded-xl object-cover h-48 w-full" />}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#2f6b61] py-16 text-center">
          <div className="mx-auto max-w-2xl px-6">
            <h2 className="mb-4 text-2xl font-serif font-light text-white">Envie d'en savoir plus sur mon accompagnement ?</h2>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Link href="/coaching" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#2f6b61] hover:bg-amber-50 transition">
                Voir le coaching
              </Link>
              <Link href="/contact" className="rounded-full border border-white px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition">
                Me contacter
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
