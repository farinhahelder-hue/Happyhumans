import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Sparring Partner — Monica Schneider · Happy Humans',
  description: "Monica Schneider comme sparring partner stratégique pour marketers et dirigeants. Ex-L'Oréal, ex-LVMH. Challenger vos idées, préparer vos pitchs, naviguer vos transitions.",
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
