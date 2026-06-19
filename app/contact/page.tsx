'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCmsContent } from '@/hooks/useCmsContent'
import { useState } from 'react'

const DEFAULTS = {
  hero_image: '',
  page_title: 'Parlons de ce qui vous amène.',
  intro_text: "Que vous soyez en plein questionnement, en transition ou simplement curieux·se de voir si le dialogue peut aider — je vous invite à me contacter. Je réponds personnellement à chaque message.",
  photo:      '',
}

export default function ContactPage() {
  const c = useCmsContent('contact', DEFAULTS)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) setSent(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="relative flex h-[40vh] items-end overflow-hidden bg-stone-900">
          {c.hero_image && (
            <img src={c.hero_image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="relative z-10 max-w-3xl px-6 pb-12 md:px-16 md:pb-20">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Contact</p>
            <h1 className="text-3xl font-serif font-light leading-[1.1] text-white md:text-5xl">{c.page_title}</h1>
          </div>
        </section>

        {/* FORM */}
        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <div className="grid gap-16 md:grid-cols-[1fr_380px] items-start">
              <div>
                <p className="mb-8 text-base leading-relaxed text-stone-600">{c.intro_text}</p>
                {sent ? (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center">
                    <div className="text-4xl mb-3">✅</div>
                    <h3 className="text-lg font-semibold text-stone-900 mb-2">Message envoyé !</h3>
                    <p className="text-sm text-stone-600">Je vous répondrai sous 48h. Merci de votre confiance.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Nom</label>
                        <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2f6b61]" placeholder="Votre nom" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Email</label>
                        <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2f6b61]" placeholder="votre@email.com" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Sujet</label>
                      <input value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2f6b61]" placeholder="Objet de votre message" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Message</label>
                      <textarea required value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} rows={6} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2f6b61] resize-none" placeholder="Décrivez votre situation ou votre question…" />
                    </div>
                    <button type="submit" disabled={sending} className="rounded-full bg-[#2f6b61] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[#235249] transition disabled:opacity-60">
                      {sending ? 'Envoi…' : 'Envoyer le message'}
                    </button>
                  </form>
                )}
              </div>
              <div className="space-y-6">
                {c.photo ? (
                  <img src={c.photo} alt="Monica Schneider" className="rounded-2xl object-cover w-full h-64 shadow-lg" />
                ) : (
                  <div className="rounded-2xl bg-gradient-to-br from-stone-100 to-stone-200 h-64 flex items-center justify-center">
                    <span className="text-5xl opacity-20">👤</span>
                  </div>
                )}
                <div className="space-y-3 text-sm text-stone-600">
                  <p className="font-semibold text-stone-900">Monica Schneider</p>
                  <p>Executive Coach · Philosophical Counselling</p>
                  <p>🌍 Accompagnement en français, anglais et roumain</p>
                  <p>⏱️ Réponse sous 48h</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
