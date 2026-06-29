import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Contact — Monica Schneider · Happy Humans',
  description: "Écrivez à Monica Schneider, Executive Coach et philo-coaching. Réponse personnelle sous 48h. Coaching individuel, entreprises, Happiness Design™, Sparring Partner.",
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }