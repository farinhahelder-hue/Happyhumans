import type { Metadata } from 'next'
import { hreflangAlternates } from '@/lib/i18n'
export const metadata: Metadata = {
  title: 'Contact — Monica Schneider · Happy Humans',
  description: "Write to Monica Schneider, Executive Coach and philo-coaching. Personal reply within 48h. Individual coaching, organisations, Happiness Design, Sparring Partner.",
  alternates: hreflangAlternates('/contact', 'en'),
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
