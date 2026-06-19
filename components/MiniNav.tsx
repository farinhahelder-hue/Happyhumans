'use client'
import Link from 'next/link'

export default function MiniNav() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-stone-200 bg-white/90 px-6 py-4 backdrop-blur-sm md:px-10">
      <Link href="/" className="text-lg font-serif font-semibold text-stone-900 hover:text-[#2f6b61] transition">
        Happy Humans
      </Link>
      <nav className="flex items-center gap-6 text-sm font-medium text-stone-600">
        <Link href="/relations" className="hover:text-[#2f6b61] transition">Relations</Link>
        <Link href="/contact" className="hover:text-[#2f6b61] transition">Contact</Link>
        <Link href="/booking" className="rounded-full bg-[#2f6b61] px-4 py-2 text-white hover:bg-[#235249] transition">
          Réserver
        </Link>
      </nav>
    </header>
  )
}
