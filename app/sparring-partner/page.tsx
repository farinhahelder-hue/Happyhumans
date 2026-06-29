'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

const USECASES = [
  { title: 'Preparer un pitch', desc: 'Monica joue le contre-argument, affute vos arguments et renforce votre posture.' },
  { title: 'Challenger une strategie', desc: 'Un regard exterieur de quelqu un qui connait vos enjeux metier.' },
  { title: 'Prise de poste', desc: 'Nouvelle equipe, nouvelles attentes. Prendre de la hauteur rapidement.' },
  { title: 'Communication multiculturelle', desc: '5 pays, 5 langues. Les codes implicites qui font ou defont une relation.' },
  { title: 'Decision difficile', desc: 'Partir ? Rester ? Negocier ? Un interlocuteur de confiance pour y voir clair.' },
]

export default function SparringPartnerPage() {
  return (
    <>
      <Header />
      <main className="pt-[72px]">
        <section className="relative overflow-hidden bg-stone-900 px-6 py-24 text-center md:py-32 md:px-10">
          <img src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1600&q=80&auto=format&fit=crop" alt="Discussion strategique" className="absolute inset-0 h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/40 to-stone-900/70" />
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-amber-400">Sparring Partner</p>
            <h1 className="text-4xl font-serif font-light leading-tight text-white md:text-6xl">Un regard exterieur strategique par une pair qui comprend vos enjeux</h1>
            <p className="mt-6 text-lg leading-relaxed text-stone-300 max-w-xl mx-auto">Ex-L&apos;Oreal, ex-LVMH, 5 langues, philo-coaching. Monica vous offre le recul qu&apos;un manager ne peut pas toujours trouver en interne.</p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Link href="/booking" className="rounded-full bg-[#2f6b61] px-7 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-[#235249] transition">Reserver une session</Link>
              <Link href="/contact" className="rounded-full border border-stone-400 px-7 py-3.5 text-sm font-semibold text-stone-200 hover:border-white hover:text-white transition">Poser une question</Link>
            </div>
          </div>
        </section>

        <section className="bg-[#f5f0e8] px-6 py-16 md:py-20 md:px-10">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Pour quoi faire ?</p>
              <h2 className="text-2xl font-serif font-light text-stone-900 md:text-3xl">Les situations qui appellent un sparring partner</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {USECASES.map(({ title, desc }) => (
                <div key={title} className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-stone-900 mb-2">{title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-16 md:py-20 md:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Pourquoi Monica ?</p>
            <h2 className="text-2xl font-serif font-light text-stone-900 mb-8 md:text-3xl">Ex-L&apos;Oreal, ex-LVMH, philo-coach et Happiness Design</h2>
            <div className="grid gap-4 sm:grid-cols-2 text-left mb-8">
              {['10 ans marketing — Henkel, LVMH, L Oreal', 'Executive Coach certifiee AoEC & EMCC', 'Master en Philosophical Counselling', '5 langues : FR, EN, RO, DE, ES', 'Methode Happiness Design', '5 pays, 12 villes'].map(item => (
                <div key={item} className="flex items-start gap-2 text-sm text-stone-600">
                  <span className="text-[#2f6b61] font-bold mt-0.5 flex-shrink-0">+</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#2f6b61] py-16 text-center">
          <div className="mx-auto max-w-xl px-6">
            <h2 className="mb-3 text-2xl font-serif font-light text-white">Pret a challenger vos idees ?</h2>
            <p className="text-sm text-emerald-200 mb-8">Session 60 a 90 min. Conversation decouverte de 30 min offerte.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking" className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#2f6b61] hover:bg-amber-50 transition shadow">Reserver une session</Link>
              <Link href="/contact" className="rounded-full border border-white px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition">Poser une question</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}