import type { Metadata } from 'next'
import { hreflangAlternates } from '@/lib/i18n'
export const metadata: Metadata = {
  title: "Relationships & Attachment — Understand your bonds",
  description: "Discover your attachment style (secure, anxious, avoidant) and transform your relationships for good. Free quiz · Resources · Complimentary session with Monica Schneider.",
  alternates: hreflangAlternates('/relations', 'en'),
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
