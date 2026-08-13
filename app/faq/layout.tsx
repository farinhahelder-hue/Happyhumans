import type { Metadata } from 'next'
import { hreflangAlternates } from '@/lib/i18n'
export const metadata: Metadata = {
  title: 'Questions fréquentes — Happy Humans',
  description: "Tout ce que vous vous demandez sur le coaching, le philo-coaching et la méthode Happiness Design de Monica Schneider. Séance découverte, tarifs, déroulé.",
  alternates: hreflangAlternates('/faq', 'fr'),
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
