import type { Metadata } from 'next'
import { getAllPosts, formatDate, localizePost } from '@/lib/blog-supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BlogClientPage from '@/components/BlogClientPage'
import Breadcrumb from '@/components/Breadcrumb'
import { LocaleProvider } from '@/contexts/LocaleContext'
import SetHtmlLang from '@/components/SetHtmlLang'
import { hreflangAlternates } from '@/lib/i18n'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Resources & Reflections',
  description: 'Articles and resources on coaching, relationships and leadership — by Monica Schneider, Happy Humans.',
  alternates: hreflangAlternates('/blog', 'en'),
}

export default async function EnBlogPage() {
  const posts = await getAllPosts()
  const localized = posts.map((post) => ({
    ...localizePost(post, 'en'),
    formattedDate: formatDate(post.published_at, 'en'),
  }))

  return (
    <LocaleProvider locale="en">
      <SetHtmlLang locale="en" />
      <Header />
      <Breadcrumb />
      <BlogClientPage posts={localized} />
      <Footer />
    </LocaleProvider>
  )
}
