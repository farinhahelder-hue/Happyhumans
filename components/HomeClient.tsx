'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULTS: Record<string, string> = {
  hero_title:          'Retrouver de la clarté, sans se perdre en route.',
  hero_subtitle:       "Happy Humans accompagne les personnes et les organisations dans les moments où quelque chose doit bouger : posture de leadership, transition, perte d'élan, questionnement de sens ou besoin de réalignement.",
  hero_cta:            'Découvrir le coaching',
  hero_image:          '',
  section_about_image: '',
  section_about_title: 'Monica Schneider',
  section_about_text:  "Executive Coach certifiée AoEC, EMCC Practitioner et formée au Philosophical Counselling.",
  services_title:      'Un accompagnement pour deux contextes',
  services_subtitle:   "Que vous soyez un individu en quête de clarté ou une organisation qui veut remettre de l'alignement dans ses équipes.",
  services_image:      '',
  newsletter_title:    'La lettre Happy Humans',
  newsletter_subtitle: 'Réflexions sur le leadership, la transformation et la qualité de présence.',
}

export default function HomeClient() {
  const c = useCmsContent('home', DEFAULTS)

  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#f4efe6]">
          {c.hero_image && (
            <img src={c.hero_image} alt="Hero" className="absolute inset-0 h-full w-full object-cover opacity-20" />
          )}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(182,140,94,0.22),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(43,111,98,0.16),_transparent_32%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-24 md:grid-cols-[1.2fr_0.8fr] md:px-10 md:py-32">
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#8d5d2f]">
                Monica Schneider · Executive Coach · Happy Humans
              </p>
              <h1 className="max-w-4xl text-4xl font-serif font-light leading-[1.05] text-stone-900 md:text-6xl">
                {c.hero_title}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-stone-700">{c.hero_subtitle}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/coaching" className="rounded-full bg-[#2f6b61] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#235249]">
                  {c.hero_cta}
                </Link>
                <Link href="/contact" className="rounded-full border border-stone-400 px-7 py-3.5 text-sm font-semibold text-stone-700 transition hover:border-stone-600">
                  Prendre contact
                </Link>
              </div>
            </div>
            <div className="hidden items-center justify-center md:flex">
              {c.section_about_image ? (
                <img src={c.section_about_image} alt="Monica Schneider" className="h-[420px] w-full rounded-2xl object-cover shadow-xl" />
              ) : (
                <div className="flex h-[380px] w-full max-w-xs items-center justify-center rounded-2xl bg-gradient-to-br from-[#e8ddd0] to-[#ccd9d5]">
                  <span className="text-6xl opacity-40">🌿</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* À PROPOS */}
        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div className="space-y-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Monica Schneider</p>
                <h2 className="text-3xl font-serif font-light leading-tight text-stone-900 md:text-4xl">{c.section_about_title}</h2>
                <p className="text-base leading-relaxed text-stone-600">{c.section_about_text}</p>
                <Link href="/a-propos" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b61] hover:underline">
                  En savoir plus →
                </Link>
              </div>
              {c.section_about_image ? (
                <img src={c.section_about_image} alt={c.section_about_title} className="rounded-2xl object-cover shadow-lg h-72 w-full" />
              ) : (
                <div className="h-72 w-full rounded-2xl bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                  <span className="text-5xl opacity-30">👤</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="bg-[#f7f4ef] py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            <div className="mb-14 max-w-2xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Accompagnement</p>
              <h2 className="text-3xl font-serif font-light leading-tight text-stone-900 md:text-4xl">{c.services_title}</h2>
              <p className="mt-4 text-base leading-relaxed text-stone-600">{c.services_subtitle}</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-8 shadow-sm">
                <h3 className="mb-3 text-xl font-serif font-semibold text-stone-900">Pour les particuliers</h3>
                <p className="mb-4 text-sm leading-relaxed text-stone-600">Managers, dirigeants, entrepreneurs ou personnes en transition qui veulent retrouver de la clarté, de la confiance et une direction qui leur ressemble vraiment.</p>
                <Link href="/coaching" className="text-sm font-semibold text-[#2f6b61] hover:underline">Découvrir le coaching →</Link>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-sm">
                <h3 className="mb-3 text-xl font-serif font-semibold text-stone-900">Pour les organisations</h3>
                <p className="mb-4 text-sm leading-relaxed text-stone-600">Coaching de leadership, ateliers, séminaires et accompagnement du changement pour remettre de l&apos;alignement et de l&apos;élan dans les équipes.</p>
                <Link href="/entreprises" className="text-sm font-semibold text-[#2f6b61] hover:underline">Voir les offres entreprises →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="bg-[#2f6b61] py-20">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="mb-4 text-3xl font-serif font-light text-white">{c.newsletter_title}</h2>
            <p className="mb-8 text-base leading-relaxed text-emerald-100">{c.newsletter_subtitle}</p>
            <form className="flex flex-col gap-3 sm:flex-row sm:gap-0" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Votre adresse email" className="flex-1 rounded-full px-5 py-3 text-sm text-stone-900 outline-none sm:rounded-r-none" />
              <button type="submit" className="rounded-full bg-amber-500 px-7 py-3 text-sm font-semibold text-white transition hover:bg-amber-400 sm:rounded-l-none">
                S&apos;inscrire
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
