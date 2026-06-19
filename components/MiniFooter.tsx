import Link from 'next/link'

export default function MiniFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-stone-800 bg-stone-900 px-6 py-8 md:px-10">
      <div className="mx-auto max-w-5xl flex flex-col items-center justify-between gap-4 text-xs text-stone-400 md:flex-row">
        <Link href="/" className="font-serif text-base text-stone-300 font-semibold hover:text-white transition">Happy Humans</Link>
        <p>© {year} Happy Humans — Monica Schneider. Tous droits réservés.</p>
        <div className="flex gap-6">
          <Link href="/mentions-legales" className="hover:text-stone-200 transition">Mentions légales</Link>
          <Link href="/politique-confidentialite" className="hover:text-stone-200 transition">Confidentialité</Link>
        </div>
      </div>
    </footer>
  )
}
