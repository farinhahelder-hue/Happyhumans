import Link from 'next/link'
import Script from 'next/script'
import type { BlogPost } from '@/lib/blog-supabase'
import { formatDate } from '@/lib/blog-supabase'
import { localizedHref, type Locale } from '@/lib/i18n'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SetHtmlLang from '@/components/SetHtmlLang'
import NewsletterForm from '@/components/NewsletterForm'
import ShareButtons from '@/components/ShareButtons'
import EnhancedRichContent from '@/components/EnhancedRichContent'
import { sanitizeHtml } from '@/lib/sanitize-html'

const SITE_URL = 'https://happyhumans.fr'
const DEFAULT_OG = `${SITE_URL}/og-default.jpg`

const STRINGS = {
  fr: {
    back: '← Retour aux carnets',
    opening: 'Ouverture',
    readSuffix: 'min de lecture',
    notPublished: "Le récit n'est pas encore publié en entier.",
    fieldNote: 'Détail terrain',
    tags: 'Tags',
    relatedEyebrow: 'Continuer',
    relatedTitle: 'Dans la même veine',
    relatedDesc:
      "D'autres récits qui avancent au même rythme : un moment précis, un lieu, un détail qui reste.",
  },
  en: {
    back: '← Back to articles',
    opening: 'Opening',
    readSuffix: 'min read',
    notPublished: 'This article is not fully published yet.',
    fieldNote: 'Field note',
    tags: 'Tags',
    relatedEyebrow: 'Keep reading',
    relatedTitle: 'In the same vein',
    relatedDesc:
      'More reflections at the same pace: a precise moment, a place, a detail that stays.',
  },
} as const

const HERO_FALLBACK: Record<string, string> = {
  'Carnets Voyage': 'bg-gradient-to-br from-teal-900 via-stone-800 to-emerald-900',
  'Découvertes Locales': 'bg-gradient-to-br from-amber-900 via-orange-900 to-stone-800',
  'Guides Pratiques': 'bg-gradient-to-br from-slate-900 via-stone-800 to-zinc-900',
}

function calcReadTime(content: string | null): number {
  if (!content) return 0
  const words = content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

function buildArticleLd(post: BlogPost, readTime: number, locale: Locale) {
  const url = `${SITE_URL}${localizedHref(`/blog/${post.slug}`, locale)}`
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt ?? '',
    image: post.featured_image ? [post.featured_image] : [DEFAULT_OG],
    datePublished: post.published_at ?? '',
    dateModified: post.updated_at ?? post.published_at ?? '',
    author: { '@type': 'Person', name: post.author ?? 'Happy Humans', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'Happy Humans',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    url,
    mainEntityOfPage: url,
    keywords: post.tags?.join(', ') ?? '',
    articleSection: post.category ?? '',
    timeRequired: readTime > 0 ? `PT${readTime}M` : undefined,
    inLanguage: locale === 'en' ? 'en' : 'fr-FR',
  }
}

/**
 * Renders a blog article for a given locale. `post` and `related` must already
 * be localised by the caller (localizePost); `locale` drives the UI chrome,
 * dates and internal links.
 */
export default function BlogArticleView({
  post,
  related,
  locale,
}: {
  post: BlogPost
  related: BlogPost[]
  locale: Locale
}) {
  const t = STRINGS[locale]
  const heroImage = post.featured_image ?? null
  const fallbackBg = HERO_FALLBACK[post.category ?? ''] ?? 'bg-gradient-to-br from-stone-900 to-amber-900'
  const readTime = calcReadTime(post.content)
  const articleLd = buildArticleLd(post, readTime, locale)
  const canonicalUrl = `${SITE_URL}${localizedHref(`/blog/${post.slug}`, locale)}`
  const safeContent = sanitizeHtml(post.content)
  const blogHref = localizedHref('/blog', locale)

  return (
    <>
      {locale === 'en' && <SetHtmlLang locale="en" />}
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      <Header />
      <main className="min-h-screen bg-white">
        <div className={`relative h-[56vh] w-full overflow-hidden md:h-[68vh] ${!heroImage ? fallbackBg : 'bg-stone-900'}`}>
          {heroImage && (
            <img
              src={heroImage}
              alt={post.title}
              width={1920}
              height={1080}
              className="absolute inset-0 h-full w-full object-cover opacity-75"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="mx-auto max-w-4xl">
              <Link
                href={blogHref}
                className="mb-5 inline-flex items-center gap-2 text-sm text-white/65 transition-colors duration-200 hover:text-white"
              >
                {t.back}
              </Link>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {post.category && (
                  <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                    {post.category}
                  </span>
                )}
                {post.tags?.slice(0, 2).map((tag) => (
                  <span key={tag} className="rounded-full bg-white/15 px-2.5 py-1 text-xs text-white/80 backdrop-blur-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="mb-4 text-3xl font-serif font-light leading-tight text-white md:text-5xl">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/65">
                <span>{post.author ?? 'Happy Humans'}</span>
                <span>•</span>
                <span>{formatDate(post.published_at, locale)}</span>
                {readTime > 0 && (
                  <>
                    <span>•</span>
                    <span>{readTime} {t.readSuffix}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
          {post.excerpt && (
            <div className="mb-10 rounded-[2rem] border border-amber-200 bg-amber-50 px-6 py-6 md:px-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">{t.opening}</p>
              <p className="text-xl font-light leading-relaxed text-stone-800">{post.excerpt}</p>
            </div>
          )}

          {safeContent ? (
            <EnhancedRichContent
              html={safeContent}
              className="prose prose-lg max-w-none
                prose-headings:font-serif prose-headings:font-light prose-headings:text-stone-900
                prose-h2:mt-12 prose-h2:mb-5 prose-h2:text-3xl
                prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-2xl
                prose-p:mb-6 prose-p:text-stone-700 prose-p:leading-8
                prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline
                prose-img:mx-auto prose-img:my-10 prose-img:rounded-[1.75rem] prose-img:shadow-lg
                prose-strong:text-stone-900 prose-strong:font-semibold
                prose-blockquote:rounded-r-2xl prose-blockquote:border-l-4 prose-blockquote:border-amber-400 prose-blockquote:bg-amber-50 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:not-italic prose-blockquote:text-stone-700
                prose-ul:space-y-3 prose-li:text-stone-700
                prose-hr:border-stone-200"
            />
          ) : (
            <div className="rounded-[2rem] border border-stone-200 bg-stone-50 px-6 py-12 text-center">
              <p className="text-lg leading-relaxed text-stone-500">{t.notPublished}</p>
            </div>
          )}

          {post.voice_notes && (
            <aside className="mt-10 rounded-[2rem] border border-stone-200 bg-stone-50 px-6 py-6 md:px-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{t.fieldNote}</p>
              <p className="text-base leading-relaxed text-stone-700">{post.voice_notes}</p>
            </aside>
          )}

          <div className="mt-10 border-t border-stone-100 pt-8">
            <ShareButtons title={post.title} url={canonicalUrl} />
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 border-t border-stone-100 pt-6">
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-stone-400">{t.tags}</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full bg-stone-100 px-3 py-1.5 text-xs text-stone-600">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 border-t border-stone-100 pt-6">
            <Link
              href={blogHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 transition-colors duration-200 hover:text-amber-800"
            >
              {t.back}
            </Link>
          </div>
        </div>

        {related.length > 0 && (
          <section className="bg-stone-50 py-16">
            <div className="mx-auto max-w-6xl px-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">{t.relatedEyebrow}</p>
              <h2 className="mb-3 text-3xl font-serif font-light text-stone-900">{t.relatedTitle}</h2>
              <p className="mb-8 max-w-2xl text-sm leading-relaxed text-stone-600">{t.relatedDesc}</p>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {related.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={localizedHref(`/blog/${relatedPost.slug}`, locale)}
                    className="group block transition-all duration-200"
                  >
                    <article className="overflow-hidden rounded-[1.5rem] bg-white shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md">
                      {relatedPost.featured_image ? (
                        <img
                          src={relatedPost.featured_image}
                          alt={relatedPost.title}
                          width={400}
                          height={176}
                          className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className={`flex h-44 items-center justify-center ${HERO_FALLBACK[relatedPost.category ?? ''] ?? 'bg-stone-200'}`}>
                          <span className="font-serif text-4xl text-white/40">H</span>
                        </div>
                      )}
                      <div className="p-5">
                        {relatedPost.category && (
                          <span className="text-xs font-semibold text-amber-700">{relatedPost.category}</span>
                        )}
                        <h3 className="mt-2 text-base font-semibold leading-snug text-stone-900 transition-colors duration-200 group-hover:text-amber-700">
                          {relatedPost.title}
                        </h3>
                        <p className="mt-3 text-xs text-stone-400">{formatDate(relatedPost.published_at, locale)}</p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <NewsletterForm variant="blog" />
      </main>
      <Footer />
    </>
  )
}
