'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULTS = {
  hero_image:         '',
  hero_badge:         'Coaching',
  hero_title:         "Il y a des moments où il faut réapprendre à habiter son rôle.",
  hero_subtitle:      "Executive Coach certifiée AoEC · EMCC Practitioner · Monica Schneider accompagne des managers, dirigeants et personnes en transition qui veulent retrouver clarté, confiance et une direction qui leur ressemble vraiment.",
  hero_cta_primary:   'Séance découverte gratuite (45 min)',
  hero_cta_contact:   'Me contacter',
  coaching_b2c_image: '',
  coaching_b2c_badge: 'Individuel',
  coaching_b2c_title: 'Coaching individuel',
  coaching_b2c_text:  "Un espace pour ralentir, regarder ce qui se passe vraiment — et construire un mouvement qui tient dans la durée.\n\nLe coaching que je propose n'est pas un conseil. C'est un accompagnement qui part de là où vous êtes vraiment.\n\nJe m'appuie sur des techniques classiques d'executive coaching (modèles GROW, Gestalt, Solutions Focused, Co-active…) mais aussi sur des outils rencontrés plus rarement — méditation, philosophie, psychologie, design thinking — pour travailler sur la transformation que vous devez accomplir au plus profond de vous pour réaliser vos objectifs.\n\nPour offrir du recul, de la clarté et de nouvelles perspectives. Vous y voyez plus clair, y compris sur les prochaines actions à mettre en place.\n\nVous vous retrouvez — et vous êtes prêt·e à accélérer avec un élan et une clarté revigorants.",
  coaching_b2c_cta_link: 'Me contacter →',
  coaching_b2b_image: '',
  coaching_b2b_badge: 'Organisations',
  coaching_b2b_title: 'Pour les organisations',
  coaching_b2b_text:  "Coaching de dirigeants, ateliers de cohésion, accompagnement du changement et séminaires sur mesure.\n\nQuand une équipe perd de sa cohérence, les résultats s'en ressentent toujours. Je travaille avec les dirigeants et les organisations pour remettre de l'alignement — entre les personnes, entre les objectifs et les moyens, entre ce qu'on dit et ce qu'on fait.",
  coaching_b2b_cta_link: 'Découvrir →',
  form_intro:         'Décrivez votre enjeu ou posez une question — je vous répondrai sous 48h.',
  reassurance:        '100% confidentiel · Sans engagement · Réponse sous 48h · Séance découverte offerte',
  // Programs
  programs_badge:     'Tarifs',
  programs_title:     'Programmes & investissement',
  program_discovery_price:  'Gratuit',
  program_discovery_unit:    '45 min',
  program_single_price:      '120 €',
  program_single_unit:       '60 min',
  program_poste_price:       '1 700 € TTC',
  program_poste_unit:        'ou 3 × 567 €',
  program_hd_label:   'Happiness Design',
  program_hd_unit:    '12 séances individuelles',
  program_hd_desc:    '12 séances pour reprendre les rênes de votre vie et de votre bonheur — au boulot et ailleurs.',
  program_hd_cta:    'En savoir plus',
  // CTA tunnel
  tunnel_title:              'Prête à commencer ?',
  tunnel_cta_primary:        'Réserver maintenant →',
  tunnel_cta_secondary:       'Poser une question',
  tunnel_reassurance:        'Séance découverte gratuite · 45 min · Sans engagement · Confirmation immédiate',
  // Témoignages
  testimonials_badge:     'Témoignages',
  testimonials_title:     "Ce qu'ils en disent",
  testimonials_footnote: "* Prénom modifié",
  // CTA final
  cta_title:         'Prêt·e à commencer ?',
  form_cta_title:    "Commençons par une séance découverte de 45 min — gratuite et sans engagement.",
  form_cta_button:   'Séance découverte gratuite (45 min)',
}

const DEFAULTS_TEMOIGNAGES = {
  testimonial_1_quote:  "J'étais le bon élève typique : attendre d'avoir tout compris et tout structuré avant d'agir, ce qui me freinait clairement dans mon rôle. Grâce à mes échanges avec Monica, j'ai compris mes mécanismes limitants et découvert de nouvelles perspectives. Le déclic du « cancre intelligent » m'a permis de voir mes forces autrement : j'ose proposer, tester, décider plus vite. Résultat : plus d'impact, plus de visibilité, et des résultats business concrets.",
  testimonial_1_name:   "Thibault*",
  testimonial_1_title:  "Directeur Marketing, Tech",
  testimonial_2_quote:  "I highly recommend the coaching sessions that Monica Schneider offers. My experience with her has been greatly satisfactory and has allowed me to achieve goals and mindsets that would have been very difficult to accomplish otherwise. She has a vast knowledge of the questioning technique and made every session worth and developmental. Monica's coaching style reflects her professionalism and her engaging nature that has allowed me to express myself openly. She provided a psychological safe environment.",
  testimonial_2_name:   "Maria*",
  testimonial_2_title:  "Learning & Development Director, Banking",
  testimonial_3_quote:  "I want to thank Monica for her inspiring, relieving, insightful and energizing sessions! She opened up valuable new perspectives on my current situation and helped me get to know myself better. It is amazing, but just in a few sessions I was able to view my situation from a completely new angle, and suddenly see the road to my new self.",
  testimonial_3_name:   "David*",
  testimonial_3_title:  "Governmental Think Tank",
}

const DEFAULTS_PROGRAMS = {
  program_1_label: 'Séance découverte',
  program_1_desc:  'Premier échange pour clarifier votre situation, vos attentes et voir si le coaching vous convient.',
  program_1_cta:   'Réserver une séance découverte',
  program_2_label: 'Séance individuelle',
  program_2_desc:  'Séance ponctuelle pour travailler sur un sujet précis ou maintenir une dynamique engagée.',
  program_2_cta:   'Réserver une séance',
  program_3_label: 'Programme prise de poste',
  program_3_desc:  'Structurer ses 90 premiers jours, asseoir son leadership et incarner pleinement son nouveau rôle — avec clarté et confiance.',
  program_3_format: '6 séances + 1 point hebdo de 30 min pendant les 90 premiers jours',
  program_3_cta:   'Réserver une séance découverte',
}

export default function CoachingPage() {
  const c = useCmsContent('coaching', { ...DEFAULTS_TEMOIGNAGES, ...DEFAULTS, ...DEFAULTS_PROGRAMS })

  const programs = [
    {
      label: c.program_1_label || 'Séance découverte',
      price: c.program_discovery_price || 'Gratuit',
      unit: c.program_discovery_unit || '45 min',
      desc: c.program_1_desc,
      cta: c.program_1_cta || 'Réserver une séance découverte',
      href: '/booking',
      highlight: false,
    },
    {
      label: c.program_2_label || 'Séance individuelle',
      price: c.program_single_price || '120 €',
      unit: c.program_single_unit || '60 min',
      desc: c.program_2_desc,
      cta: c.program_2_cta || 'Réserver une séance',
      href: '/booking',
      highlight: false,
    },
    {
      label: c.program_3_label || 'Programme prise de poste',
      price: c.program_poste_price || '1 700 € TTC',
      unit: c.program_poste_unit || 'ou 3 × 567 €',
      desc: c.program_3_desc,
      format: c.program_3_format,
      cta: c.program_3_cta || 'Réserver une séance découverte',
      href: '/booking',
      highlight: true,
    },
    {
      label: c.program_hd_label || 'Happiness Design',
      price: '',
      unit: c.program_hd_unit || '12 séances individuelles',
      desc: c.program_hd_desc,
      cta: c.program_hd_cta || 'En savoir plus',
      href: '/happiness-design',
      highlight: false,
    },
  ]

  const temoignages = [
    {
      quote: c.testimonial_1_quote,
      name: c.testimonial_1_name || 'Témoignage 1',
      title: c.testimonial_1_title || '',
    },
    {
      quote: c.testimonial_2_quote,
      name: c.testimonial_2_name || 'Témoignage 2',
      title: c.testimonial_2_title || '',
    },
    {
      quote: c.testimonial_3_quote,
      name: c.testimonial_3_name || 'Témoignage 3',
      title: c.testimonial_3_title || '',
    },
  ]

  return (
    <>
      <Header />
      <main className="pt-[72px]">

        {/* HERO */}
        <section className="relative overflow-hidden bg-stone-900 px-6 py-24 text-center md:py-32 md:px-10">
          <img
            src={c.hero_image || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600&q=80&auto=format&fit=crop'}
            alt="Bureau élégant, ambiance coaching professionnel"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/40 to-stone-900/70" />
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-amber-400">{c.get('hero_badge')}</p>
            <h1 className="text-4xl font-serif font-light leading-tight text-white md:text-6xl">{c.get('hero_title')}</h1>
            <p className="mt-6 text-lg leading-relaxed text-stone-300">{c.get('hero_subtitle', undefined, { multiline: true })}</p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Link href="/booking?from=coaching" className="rounded-full bg-[#2f6b61] px-7 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-[#235249] transition">
                {c.get('hero_cta_primary')}
              </Link>
              <Link href="/contact" className="rounded-full border border-stone-400 px-7 py-3.5 text-sm font-semibold text-stone-200 hover:border-white hover:text-white transition">
                {c.get('hero_cta_contact')}
              </Link>
            </div>
          </div>
        </section>

        {/* COACHING INDIVIDUEL */}
        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div className="space-y-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">{c.get('coaching_b2c_badge')}</p>
                <h2 className="text-3xl font-serif font-light leading-tight text-stone-900">{c.get('coaching_b2c_title')}</h2>
                <div className="text-base leading-relaxed text-stone-600 space-y-3">
                  {c.coaching_b2c_text.split('\n').map((p, i) => p.trim() ? <p key={i}>{p}</p> : null)}
                </div>
                <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b61] hover:underline">
                  {c.get('coaching_b2c_cta_link')}
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

        {/* TÉMOIGNAGES */}
        <section className="bg-[#f7f4ef] py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-800">{c.get('testimonials_badge')}</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">{c.get('testimonials_title')}</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {temoignages.map((t, i) => {
                const isEn = !t.quote.match(/[àâäéèêëîïôùûüœç«»]/);
                return (
                  <div key={i} className="bg-white rounded-2xl p-7 shadow-sm flex flex-col">
                    <span className="text-4xl font-serif leading-none text-[#2f6b61] mb-4 select-none">&ldquo;</span>
                    <blockquote lang={isEn ? 'en' : 'fr'} className="flex-1 text-sm leading-relaxed text-stone-600 italic mb-5">
                      {t.quote}
                    </blockquote>
                    <footer>
                      <p className="text-sm font-semibold text-stone-900">{t.name}</p>
                      <p className="text-xs text-stone-500 italic mt-0.5">{t.title}</p>
                      {isEn && <p className="text-xs text-stone-400 mt-1">Version originale</p>}
                    </footer>
                  </div>
                );
              })}
            </div>
            <p className="text-center text-xs text-stone-400 mt-6">{c.get('testimonials_footnote')}</p>
          </div>
        </section>

        {/* TUNNEL RAPIDE */}
        <section className="bg-[#eef5f3] border-y border-[#2d5f54]/15 py-8 px-6 md:px-10">
          <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-stone-900">{c.get('tunnel_title')}</p>
              <p className="text-xs text-stone-500 mt-0.5">{c.get('tunnel_reassurance')}</p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Link href="/booking?from=coaching" className="rounded-full bg-[#2f6b61] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#235249] transition shadow-sm">
                {c.get('tunnel_cta_primary')}
              </Link>
              <Link href="/contact" className="rounded-full border border-[#2f6b61] px-6 py-2.5 text-sm font-semibold text-[#2f6b61] hover:bg-[#2f6b61] hover:text-white transition">
                {c.get('tunnel_cta_secondary')}
              </Link>
            </div>
          </div>
        </section>

        {/* PROGRAMMES */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-800">{c.get('programs_badge')}</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">{c.get('programs_title')}</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {programs.map(({ label, price, unit, desc, format, cta, href, highlight }) => (
                <div key={label} className={`rounded-2xl p-6 flex flex-col ${highlight ? 'bg-[#2f6b61] text-white shadow-lg ring-2 ring-[#2f6b61]' : 'bg-[#f7f4ef] text-stone-900 shadow-sm'}`}>
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
        <section className="bg-[#f7f4ef] py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <img
                src={c.coaching_b2b_image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop'}
                alt="Coaching d'équipe et leadership organisationnel"
                className="rounded-2xl object-cover shadow-lg h-72 w-full order-2 md:order-1"
              />
              <div className="space-y-5 order-1 md:order-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">{c.get('coaching_b2b_badge')}</p>
                <h2 className="text-3xl font-serif font-light leading-tight text-stone-900">{c.get('coaching_b2b_title')}</h2>
                <div className="text-base leading-relaxed text-stone-600 space-y-3">
                  {c.coaching_b2b_text.split('\n').map((p, i) => p.trim() ? <p key={i}>{p}</p> : null)}
                </div>
                <Link href="/entreprises" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f6b61] hover:underline">
                  {c.get('coaching_b2b_cta_link')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#2f6b61] py-16">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="mb-3 text-2xl font-serif font-light text-white">{c.get('cta_title')}</h2>
            <p className="mb-6 text-emerald-100 text-sm">{c.get('form_cta_title', undefined, { multiline: true })}</p>
            <Link href="/booking?from=coaching" className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#2f6b61] hover:bg-amber-50 transition">
              {c.get('form_cta_button')}
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
