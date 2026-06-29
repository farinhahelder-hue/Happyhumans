import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Coaching individuel & philo-coaching',
  description: "Monica Schneider, Executive Coach certifiée AoEC, accompagne managers, marketers et dirigeants en transition de poste. Méthode Happiness Design™. Séance découverte gratuite.",
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }