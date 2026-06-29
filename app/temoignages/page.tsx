'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCmsContent } from '@/hooks/useCmsContent'

type Temoignage = { id: number; nom: string; role: string; texte: string; photo_url: string; note: number }

const DEFAULTS = {
  hero_image:  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1400&q=80&auto=format&fit=crop',
  page_title:  'Ils témoignent',
  intro_text:  'Des parcours différents, une même expérience : retrouver de la clarté et avancer avec confiance.',
  // Grid
  grid_badge:      'Témoignages',
  grid_empty_state: 'Les témoignages arrivent bientôt.',
  // LinkedIn section
  linkedin_badge:       'Témoignages LinkedIn',
  linkedin_title:       "Ce qu'ils écrivent en public",
  linkedin_subtitle:    'Verbatim issus des recommandations LinkedIn — en version originale.',
  linkedin_footnote:    '* Prénom modifié · Témoignages publiés avec accord',
  linkedin_intro_note:  '',
  // CTA
  cta_title:     "Prêt·e à écrire votre propre histoire ?",
  cta_subtitle:  'Réservez une séance découverte gratuite de 30 minutes.',
  cta_coaching: 'Découvrir le coaching',
  cta_contact:  'Prendre contact',
}

const STARS = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

export default function TemoignagesPage() {
  const c = useCmsContent('temoignages', DEFAULTS)
  const [items, setItems] = useState<Temoignage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cms/public-temoignages')
      .then(r => r.ok ? r.json() : { items: [] })
      .then(({ items: data }) => { setItems(data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="relative flex h-[55vh] items-end overflow-hidden bg-stone-900 md:h-[65vh]">
          {c.hero_image && <img src={c.hero_image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />}
          <div className="relative mx-auto w-full max-w-5xl px-6 pb-12 md:px-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-400">{c.grid_badge}</p>
            <h1 className="text-4xl font-serif font-light leading-[1.1] text-white md:text-6xl">{c.page_title}</h1>
            <p className="mt-4 max-w-xl text-base text-stone-300">{c.intro_text}</p>
          </div>
        </section>

        {/* GRILLE TÉMOIGNAGES */}
        <section className="bg-[#f7f4ef] py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2f6b61] border-t-transparent" />
              </div>
            ) : items.length === 0 ? (
              <p className="text-center text-stone-500 py-16">{c.grid_empty_state}</p>
            ) : (
              <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
                {items.map(t => (
                  <div key={t.id} className="break-inside-avoid mb-6 rounded-2xl bg-white p-7 shadow-sm">
                    {t.note > 0 && (
                      <p className="mb-3 text-sm text-amber-500 tracking-wide">{STARS(t.note)}</p>
                    )}
                    <blockquote className="mb-5 text-sm leading-relaxed text-stone-700 italic">
                      &ldquo;{t.texte}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-3">
                      {t.photo_url ? (
                        <img src={t.photo_url} alt={t.nom} className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2f6b61] text-sm font-bold text-white">
                          {t.nom.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-stone-900">{t.nom}</p>
                        {t.role && <p className="text-xs text-stone-500">{t.role}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* TÉMOIGNAGES LINKEDIN */}
        <section className="bg-white py-16 md:py-20 px-6 md:px-10">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 text-center">
              <div className="inline-flex items-center gap-2 bg-[#0077b5] text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                {c.linkedin_badge}
              </div>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">{c.linkedin_title}</h2>
              <p className="mt-3 text-sm text-stone-500">{c.linkedin_subtitle}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { quote: "J'étais le bon élève typique : attendre d'avoir tout compris et tout structuré avant d'agir, ce qui me freinait clairement dans mon rôle. Grâce à mes échanges avec Monica, j'ai compris mes mécanismes limitants et découvert de nouvelles perspectives. Le déclic du « cancre intelligent » m'a permis de voir mes forces autrement : j'ose proposer, tester, décider plus vite. Résultat : plus d'impact, plus de visibilité, et des résultats business concrets.", name: "Thibault*", role: "Directeur Marketing, Tech", lang: "fr" },
                { quote: "I highly recommend the coaching sessions that Monica Schneider offers. My experience with her has been greatly satisfactory and has allowed me to achieve goals and mindsets that would have been very difficult to accomplish otherwise. She has a vast knowledge of the questioning technique and made every session worth and developmental. Monica's coaching style reflects her professionalism and her engaging nature that has allowed me to express myself openly. She provided a psychological safe environment.", name: "Maria*", role: "Learning & Development Director, Banking", lang: "en" },
                { quote: "I want to thank Monica for her inspiring, relieving, insightful and energizing sessions! She opened up valuable new perspectives on my current situation and helped me get to know myself better. It is amazing, but just in a few sessions I was able to view my situation from a completely new angle, and suddenly see the road to my new self.", name: "David*", role: "Governmental Think Tank", lang: "en" },
                { quote: "On a eu un super feedback sur la réunion de présentation que nous avons préparée ensemble. Jérôme (le n+1 de ma cliente) nous a dit : « Champagne ! »", name: "Dorothée*", role: "Directrice Achats Beauty Retail", lang: "fr" },
              ].map(({ quote, name, role, lang }) => (
                <div key={name} className="bg-[#f7f4ef] rounded-2xl p-7 flex flex-col">
                  <span className="text-3xl font-serif leading-none text-[#2f6b61] mb-4 select-none">&ldquo;</span>
                  <blockquote lang={lang} className="flex-1 text-sm leading-relaxed text-stone-700 italic mb-5">{quote}</blockquote>
                  <footer>
                    <p className="text-sm font-semibold text-stone-900">{name}</p>
                    <p className="text-xs text-stone-500 italic mt-0.5">{role}</p>
                    {lang === 'en' && <p className="text-xs text-stone-400 mt-1">Version originale</p>}
                  </footer>
                </div>
              ))}
            </div>
            {c.linkedin_footnote && <p className="text-center text-xs text-stone-400 mt-6">{c.linkedin_footnote}</p>}
            {c.linkedin_intro_note && <p className="text-center text-xs text-stone-400 mt-4">{c.linkedin_intro_note}</p>}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#2f6b61] py-16 text-center">
          <div className="mx-auto max-w-xl px-6">
            <h2 className="mb-4 text-2xl font-serif font-light text-white">{c.cta_title}</h2>
            <p className="mb-7 text-sm text-emerald-100">{c.cta_subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/coaching" className="inline-block rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#2f6b61] shadow hover:bg-stone-50">
                {c.cta_coaching}
              </a>
              <a href="/contact" className="inline-block rounded-full border border-white px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10">
                {c.cta_contact}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
