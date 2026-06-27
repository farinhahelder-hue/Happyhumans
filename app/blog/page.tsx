import type { Metadata } from 'next'
import { getAllPosts, formatDate } from '@/lib/blog-supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BlogClientPage from '@/components/BlogClientPage'
import Breadcrumb from '@/components/Breadcrumb'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Ressources & Réflexions',
  description: 'Articles, réflexions et ressources sur le coaching, les relations et le leadership — par Monica Schneider, Happy Humans.',
  keywords: ['coaching', 'executive coaching', 'leadership', 'relations', 'happyhumans', 'Monica Schneider'],
  alternates: {
    canonical: 'https://happyhumans.vercel.app/blog',
  },
  openGraph: {
    title: 'Ressources & Réflexions | Happy Humans',
    description: 'Articles, réflexions et ressources sur le coaching, les relations et le leadership par Monica Schneider.',
    url: 'https://happyhumans.vercel.app/blog',
    siteName: 'Happy Humans',
    type: 'website',
    locale: 'fr_FR',
  },
}

export default async function BlogPage() {
  const posts = await getAllPosts()
  const postsWithFormattedDate = posts.map((post) => ({
    ...post,
    formattedDate: formatDate(post.published_at),
  }))

  return (
    <>
      <Header />
      <Breadcrumb />
      <BlogClientPage posts={postsWithFormattedDate} />
      <Footer />
    </>
  )
}
