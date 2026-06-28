'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCmsContent } from '@/hooks/useCmsContent'
import { useState } from 'react'

const DEFAULTS = {
  hero_badge:           'Contact',
  hero_image:           '',
  page_title:           'Parlons de ce qui vous amène.',
  intro_text:           "Que vous soyez en plein questionnement, en transition ou simplement curieux·se de voir si le dialogue peut aider — je vous invite à me contacter. Je réponds personnellement à chaque message.",
  photo:                '',
  form_name_label:      'Votre nom',
  form_email_label:     'Votre email',
  form_subject_label:   'Sujet (optionnel)',
  form_message_label:   'Votre message',
  form_submit_label:    'Envoyer →',
  success_title:        'Message envoyé !',
  success_text:         'Monica vous répondra sous 48h.',
  sidebar_name:         'Monica Schneider',
  sidebar_title:        'Executive Coach · Philo-coaching',
}

export default function ContactPage() {
  const c = useCmsContent('contact', DEFAULTS)
  const [form, setForm] = useState({ name: '', email: '', type: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: form.type }),
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
          <img
            src={c.hero_image || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1400&q=80&auto=format&fit=crop'}
            alt="Espace d'échange calme et chaleureux"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
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
                  <div className="rounded-2xl bg-[#eef5f3] border border-[#2d5f54]/20 p-8 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#2d5f54] flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-stone-900 mb-2">Message envoyé !</h3>
                    <p className="text-sm text-stone-600">Je vous répondrai sous 48h. Merci de votre confiance.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Nom</label>
                        <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2d5f54]" placeholder="Votre nom" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Email</label>
                        <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2d5f54]" placeholder="votre@email.com" />
                      </div>
                    </div>
                    <div>
                      
                      <div>
                        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Type de demande</label>
                        <select required value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2d5f54] bg-white">
                          <option value="">Sélectionnez...</option>
                          <option value="coaching-individuel">Coaching individuel</option>
                          <option value="coaching-entreprises">Coaching & accompagnement entreprises</option>
                          <option value="relations">Accompagnement Relations</option>
                          <option value="conference">Conférence / Formation</option>
                          <option value="autre">Autre question</option>
                        </select>
                      </div>
                      <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Sujet</label>
                      <input value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2d5f54]" placeholder="Objet de votre message" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Message</label>
                      <textarea required value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} rows={6} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2d5f54] resize-none" placeholder="Décrivez votre situation ou votre question…" />
                    </div>
                    <button type="submit" disabled={sending} className="rounded-full bg-[#2d5f54] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[#1e3a34] transition disabled:opacity-60">
                      {sending ? 'Envoi…' : 'Envoyer le message'}
                    </button>
                  </form>
                )}
              </div>
              <div className="space-y-6">
                {c.photo ? (
                  <img src={c.photo} alt="Monica Schneider" className="rounded-2xl object-cover w-full h-64 shadow-lg" />
                ) : (
                  <div className="rounded-2xl bg-gradient-to-br from-[#eef5f3] to-[#f5f0e8] h-64 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-[#2d5f54] flex items-center justify-center text-white text-2xl font-serif font-bold">MS</div>
                  </div>
                )}
                <div className="space-y-3 text-sm text-stone-600">
                  <p className="font-semibold text-stone-900">Monica Schneider</p>
                  <p>Executive Coach · Philosophical Counselling</p>
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    <span>Français, anglais et roumain</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d5f54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span>Réponse sous 48h</span>
                  </div>
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
