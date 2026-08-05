import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlausibleAnalytics from "@/components/PlausibleAnalytics";
import { createClient } from "@/lib/supabase/server";
import { getPublicConfig } from "@/lib/publicConfig";
import { getContentBlocks } from "@/lib/getContentBlocks";
import { getTheme, themeToCss, fontHref } from "@/lib/getTheme";
import "../globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const [content, theme] = await Promise.all([
    getContentBlocks("global"),
    getTheme(),
  ]);
  const seo = content.seo as Record<string, string>;
  const brand = (content.header as Record<string, string>).brand;

  return {
    title: seo.title,
    description: seo.description,
    ...(theme.favicon ? { icons: { icon: theme.favicon } } : {}),
    keywords: [
      "coaching exécutif",
      "leadership",
      "transformation",
      "happiness design",
      "Paris",
    ],
    authors: [{ name: "Monica Schneider" }],
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: "https://happyhumans.fr",
      siteName: brand,
      images: seo.ogImage
        ? [{ url: seo.ogImage, width: 1200, height: 630 }]
        : [],
      locale: "fr_FR",
      type: "website",
    },
    robots: "index, follow",
    alternates: {
      canonical: "https://happyhumans.fr",
    },
  };
}

async function getBusinessSchema() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cms_settings_kv")
    .select("key, value")
    .in("key", [
      "business-name",
      "business-address-locality",
      "business-address-country",
      "business-service-area",
      "business-price-range",
    ]);

  const settings = Object.fromEntries(
    (data || []).map(({ key, value }) => [key, value])
  );

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: settings["business-name"] || "Happy Humans - Monica Schneider",
    address: {
      "@type": "PostalAddress",
      addressLocality: settings["business-address-locality"] || "Paris",
      addressCountry: settings["business-address-country"] || "FR",
    },
    areaServed: settings["business-service-area"] || "Paris et Île-de-France",
    priceRange: settings["business-price-range"] || "€€",
    url: "https://happyhumans.fr",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [businessSchema, publicConfig, globalContent, theme] = await Promise.all([
    getBusinessSchema(),
    getPublicConfig(),
    getContentBlocks("global"),
    getTheme(),
  ]);

  const headerContent = globalContent.header as Record<string, string>;
  const footerContent = globalContent.footer as Record<string, string>;
  const fontStylesheet = fontHref(theme);

  return (
    <html lang="fr">
      <head>
        <PlausibleAnalytics />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={theme.brand} />
        {fontStylesheet && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin="anonymous"
            />
            <link rel="stylesheet" href={fontStylesheet} />
          </>
        )}
        <style
          // `:root:root` outranks the default `:root` in globals.css by
          // specificity, so the saved theme always wins regardless of the
          // order Next injects stylesheets.
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: `:root:root{${themeToCss(theme)}}` }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
      </head>
      <body className="bg-white text-gray-900">
        <Header
          initialConfig={publicConfig.visibilityToggles}
          content={headerContent}
          logo={theme.logo}
        />
        {children}
        <Footer
          initialConfig={publicConfig.visibilityToggles}
          initialContactEmail={publicConfig.contactEmail}
          content={footerContent}
          brand={headerContent.brand}
        />
      </body>
    </html>
  );
}
