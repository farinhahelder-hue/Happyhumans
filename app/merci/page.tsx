'use client'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function MerciPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-[72px] bg-[#f5f0e8] flex items-center justify-center px-6 py-24">
        <div className="max-w-xl mx-auto text-center">

          {/* Icône succès SVG */}
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-[#eef5f3] flex items-center justify-center">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="#2d5f54" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <p className="text-amber-800 text-xs font-bold tracking-[0.22em] uppercase mb-4">Message reçu</p>
          <h1 className="text-3xl md:text-4xl font-serif font-light text-stone-900 mb-5 leading-tight">
            Merci pour votre message.
          </h1>
          <p className="text-stone-600 leading-relaxed mb-4">
            Monica vous répondra personnellement <strong>sous 48h</strong> à l&apos;adresse que vous avez indiquée.
          </p>
          <p className="text-stone-500 text-sm mb-10">
            En attendant, vous pouvez explorer les ressources sur les relations et le coaching.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/relations"
              className="px-6 py-3 bg-[#2d5f54] hover:bg-[#1e3a34] text-white rounded-full font-semibold text-sm transition"
            >
              Explorer les relations
            </Link>
            <Link
              href="/booking"
              className="px-6 py-3 border border-[#2d5f54] text-[#2d5f54] hover:bg-[#2d5f54] hover:text-white rounded-full font-semibold text-sm transition"
            >
              Réserver une séance
            </Link>
          </div>

          <div className="mt-12 p-5 bg-white border border-stone-200 rounded-2xl text-sm text-stone-600">
            <p className="font-semibold text-stone-800 mb-1">Pas de réponse reçue ?</p>
            <p>Vérifiez votre dossier spam ou écrivez directement à{' '}
              <a href="mailto:happyhumans.coaching@gmail.com" className="text-[#2d5f54] underline">
                happyhumans.coaching@gmail.com
              </a>
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
