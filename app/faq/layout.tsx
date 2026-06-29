import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Questions fréquentes — Happy Humans',
  description: "Tout ce que vous vous demandez sur le coaching, le philo-coaching et la méthode Happiness Design™ de Monica Schneider. Séance découverte, tarifs, déroulé.",
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }