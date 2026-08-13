import { localizedHref, type Locale } from "@/lib/i18n";
import SetHtmlLang from "@/components/SetHtmlLang";
import type { BlogPost } from "@/lib/types";

const STRINGS = {
  fr: {
    readingSuffix: "min de lecture",
    noteAngle: "Note d'angle :",
    ctaTitle: "Prêt à passer à l'action ?",
    ctaSubtitle:
      "Réservez une séance découverte gratuite pour explorer vos défis",
    ctaButton: "Réserver une séance",
    related: "Articles similaires",
    relatedText: "Retrouvez d'autres articles dans la catégorie",
    relatedTail: "sur le blog.",
    dateLocale: "fr-FR",
  },
  en: {
    readingSuffix: "min read",
    noteAngle: "Angle note:",
    ctaTitle: "Ready to take action?",
    ctaSubtitle: "Book a free discovery session to explore your challenges",
    ctaButton: "Book a session",
    related: "Related articles",
    relatedText: "Find more articles in the",
    relatedTail: "category on the blog.",
    dateLocale: "en-US",
  },
} as const;

export default function BlogArticleContent({
  post,
  locale,
}: {
  post: BlogPost;
  locale: Locale;
}) {
  const s = STRINGS[locale];
  const title = (locale === "en" && post.title_en) || post.title;
  const excerpt = (locale === "en" && post.excerpt_en) || post.excerpt;
  const content = (locale === "en" && post.content_en) || post.content;

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <SetHtmlLang locale={locale} />
      <article>
        {post.featured_image && (
          <img
            src={post.featured_image}
            alt={title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        <header className="mb-8">
          <div className="flex gap-2 mb-4">
            {post.tags?.map((tag: string) => (
              <span
                key={tag}
                className="text-xs bg-brand/10 text-brand-dark px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-5xl font-bold mb-4">{title}</h1>

          <div className="flex items-center gap-4 text-gray-600 mb-8">
            <span>
              {new Date(post.created_at).toLocaleDateString(s.dateLocale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            {post.reading_time && (
              <span>
                • {post.reading_time} {s.readingSuffix}
              </span>
            )}
          </div>

          {excerpt && (
            <p className="text-xl text-gray-700 leading-relaxed">{excerpt}</p>
          )}
        </header>

        {/* Content */}
        <div
          className="article-content text-gray-800 text-lg mb-12"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Metadata */}
        {post.note_angle && (
          <div className="bg-brand/5 border-l-4 border-brand p-6 rounded my-8">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">{s.noteAngle}</span>{" "}
              {post.note_angle}
            </p>
          </div>
        )}

        {/* Call to action */}
        <div className="bg-gradient-to-r from-brand to-accent text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">{s.ctaTitle}</h2>
          <p className="mb-6 text-white/80">{s.ctaSubtitle}</p>
          <a
            href={`${localizedHref("/contact", locale)}#discovery`}
            className="inline-block px-8 py-3 bg-white text-brand rounded-lg font-bold hover:bg-gray-100 transition"
          >
            {s.ctaButton}
          </a>
        </div>
      </article>

      {/* Related articles */}
      <div className="mt-16 pt-8 border-t">
        <h3 className="text-2xl font-bold mb-6">{s.related}</h3>
        <p className="text-gray-600">
          {s.relatedText}{" "}
          <span className="font-semibold">{post.tags?.[0]}</span> {s.relatedTail}
        </p>
      </div>
    </main>
  );
}
