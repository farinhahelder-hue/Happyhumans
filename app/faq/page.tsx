'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useCmsContent } from '@/hooks/useCmsContent'

const DEFAULT_FAQS = [
  {
    q: "C'est quoi exactement une séance découverte ?",
    a: "C'est un premier échange gratuit de 45 minutes, sans engagement. On parle de vous, de votre situation, de ce qui vous amène. C'est l'occasion de voir si le coaching vous correspond et si on a envie de travailler ensemble.",
  },
  {
    q: "À qui s'adresse le coaching avec Monica ?",
    a: "Aux managers, dirigeants, entrepreneurs et personnes en transition — professionnelle ou personnelle. À celles et ceux qui sentent qu'il y a quelque chose à clarifier, à aligner ou à transformer, mais qui ne savent pas encore exactement par où commencer.",
  },
  {
    q: "En quoi le philo-coaching est différent d'une thérapie ?",
    a: "La thérapie travaille souvent sur les blessures du passé. Le coaching philo s'intéresse à ce qui est vivant maintenant — vos valeurs, vos directions, vos tensions actuelles — et construit vers l'action. C'est une approche orientée présent et futur, pas de guérison au sens clinique.",
  },
  {
    q: "Combien de séances faut-il en général ?",
    a: "Ça dépend vraiment de votre situation. Certaines personnes trouvent une clarté significative en 3 séances. Un accompagnement en profondeur dure souvent 3 à 6 mois, avec une séance toutes les 2 à 3 semaines. On ajuste ensemble.",
  },
  {
    q: "Comment se déroulent les séances ?",
    a: "Elles se font en visioconférence (Zoom ou Meet) ou en présentiel selon la disponibilité. Chaque séance dure 45 à 60 minutes. Monica prend des notes, mais l'essentiel du travail se fait dans l'échange — questions, silences, prises de conscience.",
  },
  {
    q: "Est-ce que le coaching sur les relations peut m'aider professionnellement aussi ?",
    a: "Absolument. Les styles d'attachement influencent directement la façon dont on manage, dont on collabore, dont on réagit au stress ou aux conflits. Comprendre ses schémas relationnels est l'une des clés du leadership.",
  },
  {
    q: "Comment réserver une séance ?",
    a: "Directement sur la page /booking — vous choisissez un créneau qui vous convient, vous remplissez vos coordonnées, et Monica vous confirme sous 48h. La séance découverte est gratuite.",
  },
  {
    q: "Puis-je annuler ou reporter une séance ?",
    a: "Oui, jusqu'à 48h avant la séance. Au-delà, la séance est due sauf cas de force majeure. On fait confiance à la bonne foi des deux côtés.",
  },
]

type FaqItem = { q: string; a: string }

function parseFaqs(jsonStr: string, fallback: FaqItem[]): FaqItem[] {
  if (!jsonStr) return fallback
  try {
    const parsed = JSON.parse(jsonStr)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback
  } catch {
    return fallback
  }
}

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null)
  const c = useCmsContent('faq', {
    page_title: "Ce qu'on nous demande souvent",
    page_subtitle: "Et si votre question n'est pas là, écrivez-nous directement.",
    cta_title: "Une autre question ?",
    cta_text: "Je réponds personnellement à chaque message sous 48h.",
    faqs_json: '',
  })

  // Parse FAQs from CMS or use defaults
  const faqs: FaqItem[] = parseFaqs(c.faqs_json, DEFAULT_FAQS)

  return (
    <>
      <Header />
      <main className="pt-[72px]">
        {/* Hero */}
        <section className="bg-[#f5f0e8] px-6 py-16 md:py-24 md:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Questions fréquentes</p>
            <h1 className="text-3xl font-serif font-light text-stone-900 md:text-5xl">{c.page_title}</h1>
            <p className="mt-5 text-base text-stone-500 leading-relaxed">{c.page_subtitle}</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white px-6 py-16 md:py-20 md:px-10">
          <div className="mx-auto max-w-3xl divide-y divide-stone-100">
            {faqs.map((faq, i) => (
              <div key={i} className="py-5">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-start justify-between gap-4 text-left"
                >
                  <span className="text-base font-medium text-stone-900 leading-snug pr-4">{faq.q}</span>
                  <span className={`flex-shrink-0 mt-0.5 text-[#2d5f54] transition-transform duration-200 ${open === i ? 'rotate-45' : ''}`} style={{ fontSize: '1.4rem', lineHeight: 1 }}>+</span>
                </button>
                {open === i && (
                  <p className="mt-4 text-sm text-stone-500 leading-relaxed border-l-2 border-[#2d5f54] pl-4">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#f5f0e8] px-6 py-14 md:px-10 text-center">
          <div className="mx-auto max-w-xl">
            <h2 className="text-xl font-serif font-light text-stone-900 mb-2">{c.cta_title}</h2>
            <p className="text-sm text-stone-500 mb-6">{c.cta_text}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact" className="inline-block rounded-full border border-[#2d5f54] px-6 py-3 text-sm font-semibold text-[#2d5f54] hover:bg-[#2d5f54] hover:text-white transition">
                Écrire à Monica →
              </Link>
              <Link href="/booking" className="inline-block rounded-full bg-[#2d5f54] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1e3a34] transition">
                Réserver une séance
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
