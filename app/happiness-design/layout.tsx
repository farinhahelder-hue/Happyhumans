import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Happiness Design — Programme 12 séances',
  description: "Programme Happiness Design créé par Monica Schneider : 12 séances combinant neurosciences, philosophie pratique, psychologie positive et design thinking pour reprendre les rênes de votre vie.",
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }