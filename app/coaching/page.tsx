'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import TemoignagesWidget from '@/components/TemoignagesWidget'
import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULTS = {
  hero_image:         '',
  hero_title:         "Il y a des moments où il faut réapprendre à habiter son rôle.",
  hero_subtitle:      "Executive Coach certifiée AoEC · EMCC Practitioner · Monica Schneider accompagne des managers, dirigeants et personnes en transition qui veulent retrouver clarté, confiance et une direction qui leur ressemble vraiment.",
  coaching_b2c_image: '',
  coaching_b2c_title: 'Coaching individuel',
  coaching_b2c_text:  "Un espace pour ralentir, regarder ce qui se passe vraiment — et construire un mouvement qui tient dans la durée.\n\nLe coaching que je propose n'est pas un conseil. C'est un accompagnement qui part de là où vous êtes vraiment : vos questionnements, vos tensions, vos ambitions telles que vous les vivez, pas comme elles devraient être.\n\nJe m'appuie sur des techniques classiques d'executive coaching (modèles GROW, Gestalt, Solutions Focused, Co-active…) mais aussi sur des outils rencontrés plus rarement — méditation, philosophie, psychologie, design thinking — pour travailler sur la transformation que vous devez accomplir au plus profond de vous pour réaliser vos objectifs.\n\nPour offrir du recul, de la clarté et de nouvelles perspectives.\nVous y voyez plus clair, y compris sur les prochaines actions à mettre en place.\nVous ressentez des moments de révélations, d'alignement profonds.\n\nVous vous retrouvez — et vous êtes prêt·e à accélérer avec un élan et une clarté revigorants.",
  coaching_b2b_image: '',
  coaching_b2b_title: 'Pour les organisations',
  coaching_b2b_text:  "Coaching de dirigeants, ateliers de cohésion, accompagnement du changement et séminaires sur mesure.\n\nQuand une équipe perd de sa cohérence, les résultats s'en ressentent toujours. Je travaille avec les dirigeants et les organisations pour remettre de l'alignement — entre les personnes, entre les objectifs et les moyens, entre ce qu'on dit et ce qu'on fait.",
  form_intro:         'Décrivez votre enjeu ou posez une question — je vous répondrai sous 48h.',
  reassurance:        '100% confidentiel · Sans engagement · Réponse sous 48h · Séance découverte offerte',
}

const PROGRAMS = [
  {
    label: 'Séance découverte',
    price: 'Gratuit',
    unit: '45 min',
    desc: 'Premier échange pour clarifier votre situation, vos attentes et voir si le coaching vous convient.',
    cta: 'Réserver maintenant',
    href: '/booking',
    highlight: false,
  },
  {
    label: 'Séance individuelle',
    price: '120 €',
    unit: '60 min',
    desc: 'Séance ponctuelle pour travailler sur un sujet précis ou maintenir une dynamique engagée.',
    cta: 'Prendre rendez-vous',
    href: '/booking',
    highlight: false,
  },
  {
    label: 'Programme prise de poste',
    price: '1 700 € TTC',
    unit: 'ou 3 × 567 €',
    desc: 'Structurer ses 90 premiers jours, asseoir son leadership et incarner pleinement son nouveau rôle — avec clarté et confiance.',
    format: '6 séances + 1 point hebdo de 30 min pendant les 90 premiers jours',
    cta: 'Réserver une séance découverte (45 min)',
    href: '/booking',
    highlight: true,
  },
  {
    label: 'Happiness Design',
    price: '',
    unit: '12 séances individuelles',
    desc: '12 séances pour reprendre les rênes de votre vie et de votre bonheur — au boulot et ailleurs.',
    cta: 'En savoir plus',
    href: '/happiness-design',
    highlight: false,
  },
]

export default function CoachingPage() {
  const c = useCmsContent('coaching', DEFAULTS)
  return (
    <>
      <Header />
      <main className="pt-[72px]">

        {/* HERO */}
        <section className="relative bg-gradient-to-br from-[#f7f2e9] via-white to-[#eef5f3] py-24 md:py-32 overflow-hidden">
          {c.hero_image && (
            <img src={c.hero_image} alt="Photo de fond" className="absolute inset-0 h-full w-full object-cover opacity-15" />
          )}
          <div className="relative mx-auto max-w-6xl px-6 md:px-10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#8d5d2f]">Coaching individuel</p>
            <h1 className="max-w-4xl text-4xl font-serif font-light leading-tight text-stone-900 md:text-6xl">{c.hero_title}</h1>
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-stone-700">{c.hero_subtitle}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/booking" className="rounded-full bg-[#2f6b61] px-7 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-[#235249] transition">
                Séance découverte gratuite (45 min)
              </Link>
              <Link href="/contact" className="rounded-full border border-[#2f6b61] px-7 py-3.5 text-sm font-semibold text-[#2f6b61] hover:bg-[#2f6b61] hover:text-white transition">
                Me contacter
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
                  {c.coaching_b2c_text.split('\n').map((p, i) => p.trim() ? <p key={i}>{p}</p> : null)}
                </div>
                <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b61] hover:underline">
                  Me contacter →
                </Link>
              </div>
              <img
                src={c.coaching_b2c_image || 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80&auto=format&fit=crop'}
                alt="Coaching individuel — introspection et clarté"
                className="rounded-2xl object-cover shadow-lg h-72 w-full"
              />
            </div>
          </div>
        </section>

        {/* PROGRAMMES */}
        <section className="bg-[#f7f4ef] py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Tarifs</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">Programmes & investissement</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {PROGRAMS.map(({ label, price, unit, desc, format, cta, href, highlight }) => (
                <div key={label} className={`rounded-2xl p-6 flex flex-col ${highlight ? 'bg-[#2f6b61] text-white shadow-lg ring-2 ring-[#2f6b61]' : 'bg-white text-stone-900 shadow-sm'}`}>
                  <p className={`text-xs font-bold uppercase tracking-[0.15em] mb-3 ${highlight ? 'text-emerald-200' : 'text-amber-800'}`}>{label}</p>
                  {price && <p className={`text-2xl font-serif font-semibold mb-0.5 ${highlight ? 'text-white' : 'text-stone-900'}`}>{price}</p>}
                  <p className={`text-xs mb-4 ${highlight ? 'text-emerald-200' : 'text-stone-500'}`}>{unit}</p>
                  <p className={`text-sm leading-relaxed flex-1 mb-3 ${highlight ? 'text-emerald-100' : 'text-stone-600'}`}>{desc}</p>
                  {format && <p className={`text-xs italic mb-4 ${highlight ? 'text-emerald-200' : 'text-stone-400'}`}>{format}</p>}
                  <Link href={href} className={`mt-auto rounded-full py-2.5 text-center text-sm font-semibold transition ${highlight ? 'bg-white text-[#2f6b61] hover:bg-stone-50' : 'bg-[#2f6b61] text-white hover:bg-[#235249]'}`}>
                    {cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COACHING B2B */}
        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <img
                src={c.coaching_b2b_image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop'}
                alt="Coaching d'équipe et leadership organisationnel"
                className="rounded-2xl object-cover shadow-lg h-72 w-full order-2 md:order-1"
              />
              <div className="space-y-5 order-1 md:order-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Organisations</p>
                <h2 className="text-3xl font-serif font-light leading-tight text-stone-900">{c.coaching_b2b_title}</h2>
                <div className="text-base leading-relaxed text-stone-600 space-y-3">
                  {c.coaching_b2b_text.split('\n').map((p, i) => p.trim() ? <p key={i}>{p}</p> : null)}
                </div>
                <Link href="/entreprises" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b61] hover:underline">
                  Voir les offres entreprises →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* TÉMOIGNAGES */}
        <TemoignagesWidget max={3} />

        {/* CTA */}
        <section className="bg-[#2f6b61] py-16">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="mb-3 text-2xl font-serif font-light text-white">Prêt·e à commencer ?</h2>
            <p className="mb-6 text-emerald-100 text-sm">{c.form_intro}</p>
            <Link href="/booking" className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#2f6b61] hover:bg-amber-50 transition">
              Séance découverte gratuite (45 min)
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
