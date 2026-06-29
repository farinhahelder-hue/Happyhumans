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
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-400">Témoignages</p>
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
              <p className="text-center text-stone-500 py-16">Les témoignages arrivent bientôt.</p>
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

        {/* CTA */}
        <section className="bg-[#2f6b61] py-16 text-center">
          <div className="mx-auto max-w-xl px-6">
            <h2 className="mb-4 text-2xl font-serif font-light text-white">Prêt·e à écrire votre propre histoire ?</h2>
            <p className="mb-7 text-sm text-emerald-100">Réservez une séance découverte gratuite de 30 minutes.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/coaching" className="inline-block rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#2f6b61] shadow hover:bg-stone-50">
                Découvrir le coaching
              </a>
              <a href="/contact" className="inline-block rounded-full border border-white px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10">
                Prendre contact
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
