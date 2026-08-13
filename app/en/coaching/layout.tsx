import type { Metadata } from 'next'
import { hreflangAlternates } from '@/lib/i18n'
export const metadata: Metadata = {
  title: 'Individual coaching & philo-coaching',
  description: "Monica Schneider, AoEC-certified Executive Coach, supports managers, marketers and leaders in career transitions. Happiness Design method. Free discovery session.",
  alternates: hreflangAlternates('/coaching', 'en'),
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
