'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

type Temoignage = { id: number; nom: string; role: string; texte: string; photo_url: string; note: number }
const STARS = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

export default function TemoignagesWidget({ max = 3 }: { max?: number }) {
  const [items, setItems] = useState<Temoignage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) { setLoading(false); return }
    createClient(url, key)
      .from('temoignages')
      .select('id, nom, role, texte, photo_url, note')
      .eq('visible', true)
      .order('sort_order', { ascending: true })
      .limit(max)
      .then(({ data }) => { setItems(data || []); setLoading(false) })
  }, [max])

  if (loading) return null
  if (items.length === 0) return null

  return (
    <section className="bg-[#f7f4ef] py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Témoignages</p>
          <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">Ce qu&apos;ils en disent</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map(t => (
            <div key={t.id} className="rounded-2xl bg-white p-6 shadow-sm flex flex-col">
              {t.note > 0 && <p className="mb-3 text-sm text-amber-500">{STARS(t.note)}</p>}
              <blockquote className="flex-1 mb-5 text-sm leading-relaxed text-stone-700 italic">
                &ldquo;{t.texte}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                {t.photo_url ? (
                  <img src={t.photo_url} alt={t.nom} className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2f6b61] text-xs font-bold text-white">
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
        <div className="mt-8 text-center">
          <Link href="/temoignages" className="text-sm font-semibold text-[#2f6b61] hover:underline">
            Voir tous les témoignages →
          </Link>
        </div>
      </div>
    </section>
  )
}
