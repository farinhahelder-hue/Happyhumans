import type { Metadata } from 'next'
import { hreflangAlternates } from '@/lib/i18n'
export const metadata: Metadata = {
  title: 'Monica Schneider — Executive Coach & Philosophical Counselling',
  description: "Ex-L'Oréal, ex-LVMH. Executive Coach certifiée AoEC · EMCC Practitioner · Philosophical Counselling. Créatrice de la méthode Happiness Design. 5 langues, 12 villes.",
  alternates: hreflangAlternates('/a-propos', 'fr'),
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
