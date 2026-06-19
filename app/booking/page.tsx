import BookingWidget from '@/components/BookingWidget'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Réserver une séance — Happy Humans',
  description: 'Choisissez un créneau pour votre séance découverte gratuite ou votre programme de coaching avec Monica Schneider.',
}

export default function BookingPage() {
  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="relative flex h-[38vh] items-end overflow-hidden bg-stone-900">
          <div className="relative mx-auto w-full max-w-5xl px-6 pb-12 md:px-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-400">Réservation</p>
            <h1 className="text-4xl font-serif font-light text-white md:text-5xl">Choisissez votre créneau</h1>
            <p className="mt-4 max-w-xl text-base text-stone-300">
              Séance découverte gratuite (30 min) ou programme de coaching — choisissez la date qui vous convient.
            </p>
          </div>
        </section>

        {/* BOOKING WIDGET */}
        <section className="bg-[#f7f4ef] py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-6 md:px-10">
            <BookingWidget />
          </div>
        </section>

        {/* RÉASSURANCE */}
        <section className="bg-white py-12">
          <div className="mx-auto max-w-3xl px-6 md:px-10">
            <div className="grid gap-6 sm:grid-cols-3 text-center">
              {[
                { emoji: '🎁', title: 'Séance découverte gratuite', desc: '30 minutes sans engagement pour vous présenter et voir si le coaching vous correspond.' },
                { emoji: '📅', title: 'Confirmation sous 48h', desc: 'Monica confirme chaque réservation manuellement et vous répond par email.' },
                { emoji: '🔄', title: 'Annulation libre', desc: 'Vous pouvez reporter ou annuler jusqu'à 48h avant la séance, sans frais.' },
              ].map(({ emoji, title, desc }) => (
                <div key={title} className="rounded-2xl bg-[#f7f4ef] p-6">
                  <div className="text-2xl mb-3">{emoji}</div>
                  <h3 className="text-sm font-semibold text-stone-900 mb-2">{title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
