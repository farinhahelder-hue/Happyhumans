import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/page-seo'
import { FAQ_DEFAULTS } from '@/lib/cms-defaults/faq'
export const revalidate = 300 // la page est régénérée au plus toutes les 5 min (+ immédiatement à chaque sauvegarde du CMS)
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('faq', FAQ_DEFAULTS)
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }