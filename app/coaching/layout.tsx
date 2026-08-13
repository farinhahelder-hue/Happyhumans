import type { Metadata } from 'next'
import { hreflangAlternates } from '@/lib/i18n'
export const metadata: Metadata = {
  title: 'Coaching individuel & philo-coaching',
  description: "Monica Schneider, Executive Coach certifiée AoEC, accompagne managers, marketers et dirigeants en transition de poste. Méthode Happiness Design. Séance découverte gratuite.",
  alternates: hreflangAlternates('/coaching', 'fr'),
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
