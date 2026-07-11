import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import DynamicFavicon from '@/components/DynamicFavicon';
import MaintenanceGate from '@/components/MaintenanceGate';
import { InlineEditProvider } from '@/contexts/InlineEditContext';
import InlineEditor from '@/components/InlineEditor';
import { getKvSettings } from '@/lib/cms-settings-server';

const SITE_URL = 'https://happyhumans.vercel.app';

export const viewport: Viewport = {
  themeColor: '#2d5f54',
};

const DEFAULT_TITLE = 'Happy Humans — Monica Schneider';
const DEFAULT_DESCRIPTION =
  "Philo-coaching avec Monica Schneider. Executive coaching, philosophical counselling et sparring partner pour particuliers et organisations. Retrouvez clarté, alignement et relations épanouissantes.";

// SEO global piloté par le CMS (Paramètres → SEO global), avec fallback
export async function generateMetadata(): Promise<Metadata> {
  const kv = await getKvSettings();
  const seoTitle = kv.seo_title || DEFAULT_TITLE;
  const seoDescription = kv.seo_description || DEFAULT_DESCRIPTION;
  const ogImage = kv.og_image || '/og-images/og-default.svg';

  return {
    ...baseMetadata,
    title: {
      default: seoTitle,
      template: '%s | Happy Humans',
    },
    description: seoDescription,
    openGraph: {
      ...baseMetadata.openGraph,
      title: seoTitle,
      description: seoDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: seoTitle,
        },
      ],
    },
    twitter: {
      ...baseMetadata.twitter,
      title: seoTitle,
      description: seoDescription,
      images: [ogImage],
    },
  };
}

const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: '%s | Happy Humans',
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    'executive coach',
    'coaching dirigeant',
    'philosophical counselling',
    'coaching leadership',
    'Monica Schneider',
    'Happy Humans',
    'coaching de carriere',
    'transformation equipes',
  ],
  authors: [{ name: 'Monica Schneider', url: SITE_URL }],
  creator: 'Monica Schneider',
  publisher: 'Happy Humans',
  icons: {
    icon: [
      { url: '/og-images/og-default.svg' },
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: 'Happy Humans',
    title: 'Happy Humans — Monica Schneider',
    description:
      "Accompagnement individuel et collectif pour managers, dirigeants et organisations en quete d'alignement, de clarte et de transformation durable.",
    images: [
      {
        url: '/og-images/og-default.svg',
        width: 1200,
        height: 630,
        alt: 'Happy Humans - coaching et transformation avec Monica Schneider',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Happy Humans | Coaching & transformation avec Monica Schneider',
    description:
      'Executive coaching, philosophical counselling et accompagnement des organisations avec Monica Schneider.',
    images: ['/og-images/og-default.svg'],
  },
};

const schemaWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Happy Humans',
  alternateName: 'Happy Humans - Monica Schneider',
  url: SITE_URL,
  description: 'Plateforme de coaching et de transformation portee par Monica Schneider.',
  inLanguage: 'fr-FR',
};

const schemaOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Happy Humans',
  url: SITE_URL,
  logo: `${SITE_URL}/og-images/og-default.svg`,
  sameAs: [
    'https://fr.linkedin.com/in/monica-schneider-philo-coaching',
    'https://monicaschneider.me/',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'happyhumans.coaching@gmail.com',
    availableLanguage: ['French', 'English', 'Romanian'],
  },
};

const schemaPerson = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Monica Schneider',
  jobTitle: 'Executive Coach',
  url: SITE_URL,
  image: `${SITE_URL}/og-default.jpg`,
  sameAs: [
    'https://fr.linkedin.com/in/monica-schneider-philo-coaching',
    'https://monicaschneider.me/',
  ],
  knowsLanguage: ['fr', 'en', 'ro'],
  worksFor: {
    '@type': 'Organization',
    name: 'Happy Humans',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 44 44'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%232d5f54'/%3E%3Cstop offset='100%25' stop-color='%233d7a72'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='22' cy='22' r='20' fill='url(%23g)'/%3E%3Cg stroke='white' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='11' y='13' width='22' height='20' rx='3'/%3E%3Cline x1='11' y1='19' x2='33' y2='19'/%3E%3Cline x1='16' y1='9' x2='16' y2='15'/%3E%3Cline x1='28' y1='9' x2='28' y2='15'/%3E%3Cpath d='M17 26L20 29L27 22' stroke-width='2'/%3E%3C/g%3E%3C/svg%3E" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaPerson) }}
        />
      </head>
      <body>
        <MaintenanceGate>
          <InlineEditProvider>
            <AuthProvider>
              <DynamicFavicon />
              {children}
              <CookieConsentBanner />
              <InlineEditor />
            </AuthProvider>
          </InlineEditProvider>
        </MaintenanceGate>
      </body>
    </html>
  );
}
