import type { Metadata } from 'next'
import { hreflangAlternates } from '@/lib/i18n'
export const metadata: Metadata = {
  title: 'Happiness Design — 12-session programme',
  description: "The Happiness Design programme created by Monica Schneider: 12 sessions combining neuroscience, practical philosophy, positive psychology and design thinking to take back the reins of your life.",
  alternates: hreflangAlternates('/happiness-design', 'en'),
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
