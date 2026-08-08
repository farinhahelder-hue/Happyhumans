import Link from "next/link";
import { getContentBlocks } from "@/lib/getContentBlocks";
import { localizedHref, type Locale } from "@/lib/i18n";
import SetHtmlLang from "@/components/SetHtmlLang";

// Border/link colours cycle across the service cards to preserve the
// original visual rhythm regardless of how many cards are configured.
const CARD_STYLES = [
  { border: "border-brand", link: "text-brand" },
  { border: "border-accent", link: "text-accent" },
  { border: "border-accent", link: "text-accent" },
];

export default async function HomeContent({ locale }: { locale: Locale }) {
  const content = await getContentBlocks("home", locale);
  const hero = content.hero as Record<string, string>;
  const headings = content.headings as Record<string, string>;
  const bio = content.bio as Record<string, string>;
  const cta = content.cta as Record<string, string>;
  const services = content.services as {
    title: string;
    description: string;
    link: string;
    linkLabel: string;
  }[];

  const bioParagraphs = bio.paragraphs.split("\n\n").filter(Boolean);
  const stats = bio.stats.split("\n").filter(Boolean);

  return (
    <main>
      <SetHtmlLang locale={locale} />
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-brand/5 to-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1
                className="text-4xl md:text-6xl font-bold mb-6 text-gray-900"
                style={{ whiteSpace: "pre-line" }}
              >
                {hero.title}
              </h1>
              <p className="text-lg md:text-2xl text-gray-600 mb-8">
                {hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                <Link
                  href={localizedHref("/coaching", locale)}
                  className="px-8 py-4 bg-brand text-white rounded-lg font-bold hover:bg-brand-dark transition"
                >
                  {headings.heroButtonPrimary}
                </Link>
                <Link
                  href={localizedHref("/entreprises", locale)}
                  className="px-8 py-4 border-2 border-brand text-brand rounded-lg font-bold hover:bg-brand/5 transition"
                >
                  {headings.heroButtonSecondary}
                </Link>
              </div>
            </div>

            {hero.image && (
              <img
                src={hero.image}
                alt={hero.imageAlt || ""}
                className="w-full h-72 md:h-96 object-cover rounded-2xl shadow-xl"
              />
            )}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">{headings.bioHeading}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">{bio.name}</h3>
              {bioParagraphs.map((paragraph, i) => (
                <p key={i} className="text-gray-600 mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="space-y-6">
              {bio.photo ? (
                <img
                  src={bio.photo}
                  alt={bio.photoAlt || bio.name}
                  className="w-full h-72 object-cover rounded-lg shadow-lg"
                />
              ) : (
                <div className="bg-gradient-to-br from-brand/10 to-accent/10 rounded-lg h-72 flex items-center justify-center text-6xl">
                  🎯
                </div>
              )}
              <div className="bg-gradient-to-br from-brand/5 to-accent/5 rounded-lg p-6 text-center">
                <p className="text-gray-700 font-semibold">
                  {stats.map((stat, i) => (
                    <span key={i}>
                      {stat}
                      {i < stats.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">{headings.servicesHeading}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, i) => {
              const style = CARD_STYLES[i % CARD_STYLES.length];
              return (
                <Link
                  key={i}
                  href={service.link}
                  className={`bg-white p-8 rounded-lg shadow hover:shadow-lg transition border-t-4 ${style.border}`}
                >
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  {service.linkLabel && (
                    <span className={`${style.link} font-semibold`}>
                      {service.linkLabel}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-brand to-accent text-white text-center">
        <h2 className="text-4xl font-bold mb-6">{cta.title}</h2>
        <p className="text-xl mb-8 text-white/80">{cta.subtitle}</p>
        <Link
          href={localizedHref("/contact", locale)}
          className="inline-block px-8 py-4 bg-white text-brand rounded-lg font-bold hover:bg-gray-100 transition"
        >
          {cta.buttonText}
        </Link>
      </section>
    </main>
  );
}
