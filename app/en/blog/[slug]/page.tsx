import { getPostBySlug, getAllSlugs, getRelatedPosts, localizePost } from '@/lib/blog-supabase'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogArticleView from '@/components/BlogArticleView'
import { hreflangAlternates } from '@/lib/i18n'

export const revalidate = 60

const SITE_URL = 'https://happyhumans.fr'
const DEFAULT_OG = `${SITE_URL}/og-default.jpg`

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const raw = await getPostBySlug(params.slug)
  if (!raw) return { title: 'Article not found | Happy Humans' }
  const post = localizePost(raw, 'en')

  const ogImage = post.og_image ?? post.featured_image ?? DEFAULT_OG
  const description = post.seo_description ?? post.excerpt ?? 'A Happy Humans article — coaching, leadership and wellbeing.'
  const seoTitle = post.seo_title ?? `${post.title} | Happy Humans`

  return {
    title: seoTitle,
    description,
    alternates: hreflangAlternates(`/blog/${post.slug}`, 'en'),
    authors: post.author ? [{ name: post.author }] : [{ name: 'Happy Humans' }],
    openGraph: {
      title: post.title,
      description,
      url: `${SITE_URL}/en/blog/${post.slug}`,
      siteName: 'Happy Humans',
      type: 'article',
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at ?? undefined,
      authors: post.author ? [post.author] : ['Happy Humans'],
      tags: post.tags ?? undefined,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [ogImage],
    },
  }
}

export default async function EnBlogPostPage({ params }: Props) {
  const raw = await getPostBySlug(params.slug)
  if (!raw) notFound()
  const rawRelated = await getRelatedPosts(raw.slug, raw.category, 3)
  const post = localizePost(raw, 'en')
  const related = rawRelated.map((p) => localizePost(p, 'en'))
  return <BlogArticleView post={post} related={related} locale="en" />
}
