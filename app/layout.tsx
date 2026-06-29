import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import DynamicFavicon from '@/components/DynamicFavicon';
import MaintenanceGate from '@/components/MaintenanceGate';

const SITE_URL = 'https://happyhumans.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  themeColor: '#2d5f54',
  title: {
    default: 'Happy Humans — Monica Schneider',
    template: '%s | Happy Humans',
  },
  description:
    "Philo-coaching avec Monica Schneider. Executive coaching, philosophical counselling et sparring partner pour particuliers et organisations. Retrouvez clarté, alignement et relations épanouissantes.",
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
      { url: '/logo-happy-humans.jpg' },
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
        url: '/logo-happy-humans.jpg',
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
    images: ['/logo-happy-humans.jpg'],
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
  logo: `${SITE_URL}/logo-happy-humans.jpg`,
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
        <link rel="icon" href="/logo-happy-humans.jpg" sizes="any" />
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
          <AuthProvider>
            <DynamicFavicon />
            {children}
            <CookieConsentBanner />
          </AuthProvider>
        </MaintenanceGate>
      </body>
    </html>
  );
}
