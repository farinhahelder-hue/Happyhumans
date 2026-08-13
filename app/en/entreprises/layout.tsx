import type { Metadata } from 'next'
import { hreflangAlternates } from '@/lib/i18n'
export const metadata: Metadata = {
  title: 'Coaching for organisations & leadership — Happy Humans',
  description: "Executive coaching, onboarding, team cohesion workshops and bespoke seminars. Monica Schneider helps teams and organisations realign.",
  alternates: hreflangAlternates('/entreprises', 'en'),
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
