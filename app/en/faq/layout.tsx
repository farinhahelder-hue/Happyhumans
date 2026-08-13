import type { Metadata } from 'next'
import { hreflangAlternates } from '@/lib/i18n'
export const metadata: Metadata = {
  title: 'Frequently asked questions — Happy Humans',
  description: "Everything you might wonder about coaching, philo-coaching and Monica Schneider's Happiness Design method. Discovery session, pricing, how it works.",
  alternates: hreflangAlternates('/faq', 'en'),
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
