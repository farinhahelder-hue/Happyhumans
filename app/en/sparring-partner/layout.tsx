import type { Metadata } from 'next'
import { hreflangAlternates } from '@/lib/i18n'
export const metadata: Metadata = {
  title: 'Sparring Partner — Monica Schneider · Happy Humans',
  description: "Monica Schneider as a strategic sparring partner for marketers and leaders. Ex-L'Oréal, ex-LVMH. Challenge your ideas, prepare your pitches, navigate your transitions.",
  alternates: hreflangAlternates('/sparring-partner', 'en'),
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
