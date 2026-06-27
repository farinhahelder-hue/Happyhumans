import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="pt-[72px] min-h-screen bg-[#f5f0e8] flex flex-col items-center justify-center px-6 py-24 text-center">

        {/* Numéro sobre */}
        <p className="text-[120px] md:text-[180px] font-serif font-light text-stone-200 leading-none select-none">
          404
        </p>

        <div className="-mt-8 relative z-10 max-w-lg">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-amber-800">Page introuvable</p>
          <h1 className="text-3xl font-serif font-light text-stone-900 mb-5 md:text-4xl leading-snug">
            Cette page n&apos;existe plus ou a changé d&apos;adresse.
          </h1>
          <p className="text-base text-stone-500 leading-relaxed mb-10">
            Elle a peut-être été déplacée ou renommée. Pas d&apos;inquiétude —
            vous trouverez votre chemin depuis l&apos;accueil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="rounded-full bg-[#2d5f54] px-7 py-3 text-sm font-semibold text-white hover:bg-[#1e3a34] transition"
            >
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-stone-300 px-7 py-3 text-sm font-semibold text-stone-700 hover:border-[#2d5f54] hover:text-[#2d5f54] transition"
            >
              Prendre contact
            </Link>
          </div>
        </div>

        {/* Liens utiles */}
        <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3 justify-center text-sm text-stone-400">
          {[
            { href: '/coaching',          label: 'Coaching' },
            { href: '/relations',         label: 'Relations' },
            { href: '/happiness-design',  label: 'Happiness Design' },
            { href: '/booking',           label: 'Réserver une séance' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="hover:text-[#2d5f54] transition">{l.label}</Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
