import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Monica Schneider — Executive Coach & Philosophical Counselling',
  description: "Ex-L'Oréal, ex-LVMH. Executive Coach certifiée AoEC · EMCC Practitioner · Philosophical Counselling. Créatrice de la méthode Happiness Design. 5 langues, 12 villes.",
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }