import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/page-seo'
import { COACHING_DEFAULTS } from '@/lib/cms-defaults/coaching'
export const revalidate = 300 // la page est régénérée au plus toutes les 5 min (+ immédiatement à chaque sauvegarde du CMS)
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('coaching', COACHING_DEFAULTS)
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }