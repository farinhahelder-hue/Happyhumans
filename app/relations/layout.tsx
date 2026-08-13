import type { Metadata } from 'next'
import { hreflangAlternates } from '@/lib/i18n'
export const metadata: Metadata = {
  title: "Relations & Attachement — Comprendre vos liens",
  description: "Découvrez votre style d'attachement (sécure, anxieux, évitant) et transformez durablement vos relations. Quiz gratuit · Ressources · Séance offerte avec Monica Schneider.",
  alternates: hreflangAlternates('/relations', 'fr'),
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
