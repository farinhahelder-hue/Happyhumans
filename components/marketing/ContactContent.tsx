import { calendly, siteConfig } from "@/lib/integrations";
import { createClient } from "@/lib/supabase/server";
import { getContentBlocks } from "@/lib/getContentBlocks";
import { type Locale } from "@/lib/i18n";
import SetHtmlLang from "@/components/SetHtmlLang";
import ContactFormClient from "@/components/ContactFormClient";

async function getContactSettings() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cms_settings_kv")
    .select("key, value")
    .in("key", [
      "contact-email",
      "contact-phone",
      "business-address-locality",
      "business-service-area",
    ]);

  const settings = Object.fromEntries(
    (data || []).map(({ key, value }) => [key, value])
  );

  return {
    email: settings["contact-email"] || siteConfig.email,
    phone: settings["contact-phone"] || siteConfig.phone,
    location:
      settings["business-service-area"] ||
      settings["business-address-locality"] ||
      siteConfig.location,
  };
}

export default async function ContactContent({ locale }: { locale: Locale }) {
  const [contact, content] = await Promise.all([
    getContactSettings(),
    getContentBlocks("contact", locale),
  ]);

  const hero = content.hero as Record<string, string>;
  const labels = content.labels as Record<string, string>;
  const social = content.social as { label: string; url: string }[];

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand/5 to-white">
      <SetHtmlLang locale={locale} />
      {/* Hero */}
      <section className="py-16 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{hero.title}</h1>
          <p className="text-lg md:text-xl text-gray-600">{hero.subtitle}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold mb-8">{labels.coordinatesHeading}</h2>

            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-lg mb-2">{labels.emailLabel}</h3>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-brand hover:text-brand-dark"
                >
                  {contact.email}
                </a>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">{labels.phoneLabel}</h3>
                <a href={`tel:${contact.phone}`} className="text-brand hover:text-brand-dark">
                  {contact.phone}
                </a>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">{labels.locationLabel}</h3>
                <p className="text-gray-600">{contact.location}</p>
              </div>

              {social.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">{labels.socialLabel}</h3>
                  <div className="flex gap-4">
                    {social.map((network, i) => (
                      <a
                        key={i}
                        href={network.url}
                        className="text-brand hover:text-brand-dark"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {network.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-8">{labels.formHeading}</h2>
            <ContactFormClient />
          </div>
        </div>
      </section>

      {/* Calendly Embed */}
      <section id="discovery" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {labels.calendlyHeading}
          </h2>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <iframe
              title="Calendly"
              src={calendly.getEmbedUrl()}
              width="100%"
              height="700"
              frameBorder="0"
              style={{ display: "block" }}
            />
          </div>

          <p className="text-center text-gray-600 mt-8">
            {labels.calendlyFallback}
            <a href={`mailto:${contact.email}`} className="text-brand ml-2">
              {contact.email}
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
