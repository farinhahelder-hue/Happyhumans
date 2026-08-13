import type { Metadata } from 'next'
import { hreflangAlternates } from '@/lib/i18n'
export const metadata: Metadata = {
  title: 'About Monica Schneider — Executive Coach & Philosophical Counselling',
  description: "Ex-L'Oréal, ex-LVMH. AoEC-certified Executive Coach · EMCC Practitioner · Philosophical Counselling. Creator of the Happiness Design method. 5 languages, 12 cities.",
  alternates: hreflangAlternates('/a-propos', 'en'),
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
