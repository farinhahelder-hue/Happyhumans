import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import CookieConsentBanner from '@/components/CookieConsentBanner';

const SITE_URL = 'https://happy-humans.org';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Happy Humans | Coaching & transformation avec Monica Schneider',
    template: '%s | Happy Humans',
  },
  description:
    "Executive coaching, philosophical counselling et accompagnement des organisations avec Monica Schneider. Une approche pour retrouver clarté, alignement et impact durable.",
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
    title: 'Happy Humans | Coaching & transformation avec Monica Schneider',
    description:
      "Accompagnement individuel et collectif pour managers, dirigeants et organisations en quete d'alignement, de clarte et de transformation durable.",
    images: [
      {
        url: '/og-default.jpg',
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
    images: ['/og-default.jpg'],
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
  logo: `${SITE_URL}/favicon.svg`,
  sameAs: [
    'https://fr.linkedin.com/in/monica-schneider-philo-coaching',
    'https://monicaschneider.me/',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'contactus@happy-humans.org',
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://images.unsplash.com" />
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
        <AuthProvider>
          {children}
          <CookieConsentBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
