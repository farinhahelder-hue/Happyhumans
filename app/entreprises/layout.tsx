import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Coaching entreprises & leadership — Happy Humans',
  description: "Coaching de dirigeants, prise de poste, ateliers de cohésion et séminaires sur mesure. Monica Schneider accompagne les équipes et organisations pour remettre de l'alignement.",
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }