import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Réserver une séance — Happy Humans',
  description: "Réservez votre séance découverte gratuite (45 min) avec Monica Schneider. Coaching individuel, prise de poste, Happiness Design™. Confirmation immédiate via Calendly.",
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }