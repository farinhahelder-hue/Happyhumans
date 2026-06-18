import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Relations & Événement | Happy Humans',
  description:
    "Rejoignez Monica Schneider pour un événement unique sur les relations humaines ce samedi. Découvrez aussi votre style d'attachement.",
};

// ── TODO: adapter ces valeurs selon les infos réelles de Monica ──────────────
const EVENT = {
  title: 'Cercle des Relations Conscientes',
  subtitle: "Une soirée pour explorer, partager et se reconnecter à l'essentiel",
  date: 'Samedi 21 juin 2026',
  time: '18h00 – 21h00',
  location: 'Paris — adresse communiquée sur inscription',
  host: 'Monica Schneider',
  hostTitle: 'Coach & Facilitatrice',
  spots: 12,
  price: 'Entrée libre sur inscription',
  registrationUrl: 'https://happyhumans.fr/contact',
  qrTarget: 'https://happyhumans.fr/relations',
};

export default function RelationsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-950 via-pink-900 to-purple-950">

      {/* ── HERO EVENT ──────────────────────────────────────────────────────── */}
      <section className="relative px-4 py-16 md:py-24 text-center overflow-hidden">
        <div
          aria-hidden
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-400/30 rounded-full px-4 py-1.5 text-rose-300 text-sm font-medium mb-6">
            ✨ Événement · {EVENT.date}
          </span>

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
            {EVENT.title}
          </h1>
          <p className="text-white/70 text-lg md:text-xl mb-8 max-w-xl mx-auto">
            {EVENT.subtitle}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { icon: '📅', text: EVENT.date },
              { icon: '⏰', text: EVENT.time },
              { icon: '📍', text: EVENT.location },
              { icon: '👥', text: `${EVENT.spots} places max` },
            ].map(({ icon, text }) => (
              <span
                key={text}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white/80 text-sm"
              >
                {icon} {text}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={EVENT.registrationUrl}
              className="px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-2xl text-base transition-all shadow-lg shadow-rose-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
            >
              Je m'inscris →
            </a>
            <Link
              href="/test-attachement"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-2xl text-base transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              🪢 Faire le test d'attachement
            </Link>
          </div>
        </div>
      </section>

      {/* ── QR CODE ─────────────────────────────────────────────────────────── */}
      <section className="px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-rose-300 text-sm font-semibold uppercase tracking-widest mb-3">
                Partage l'événement
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Scanner pour rejoindre
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Ce QR code mène directement à cette page. Partagez-le avec vos proches pour les inviter à l'événement ou à découvrir leur style d'attachement.
              </p>
              <p className="text-white/40 text-sm font-mono">{EVENT.qrTarget}</p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(EVENT.qrTarget)}&margin=0`}
                  alt={`QR code vers ${EVENT.qrTarget}`}
                  width={220}
                  height={220}
                  loading="lazy"
                  className="rounded-lg"
                />
              </div>
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(EVENT.qrTarget)}&margin=20`}
                download="qr-happy-humans-relations.png"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-rose-300 hover:text-rose-200 underline underline-offset-2 transition-colors"
              >
                ↓ Télécharger le QR code HD
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOST ────────────────────────────────────────────────────────────── */}
      <section className="px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-white text-3xl font-bold shrink-0 shadow-lg">
              M
            </div>
            <div>
              <p className="text-rose-300 text-sm font-semibold uppercase tracking-widest mb-1">
                {EVENT.hostTitle}
              </p>
              <h3 className="text-2xl font-bold text-white mb-2">{EVENT.host}</h3>
              <p className="text-white/70 leading-relaxed">
                Monica accompagne les individus et les groupes vers une meilleure compréhension d'eux-mêmes et de leurs relations. Sa démarche allie bienveillance, rigueur et une vraie joie de connecter les gens entre eux.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TEST CTA ────────────────────────────────────────────────────────── */}
      <section className="px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-pink-900/60 to-purple-900/60 border border-white/20 rounded-3xl p-8 md:p-12">
            <div className="text-5xl mb-4">🪢</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Et si vous découvriez votre style d'attachement ?
            </h2>
            <p className="text-white/70 mb-6 max-w-lg mx-auto">
              Un test doux de 16 questions, conçu pour vous inviter à mieux comprendre comment vous vous reliez aux autres. Gratuit, en français, résultats immédiats.
            </p>
            <Link
              href="/test-attachement"
              className="inline-flex px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-2xl text-base transition-all shadow-lg shadow-rose-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
            >
              Faire le test gratuit →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="px-4 py-8 text-center">
        <p className="text-white/30 text-xs">© 2026 Happy Humans · Tous droits réservés</p>
      </footer>
    </main>
  );
}
