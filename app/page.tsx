import HomeClient from '@/components/HomeClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Happy Humans - Coaching, leadership et transformation',
  description:
    "Happy Humans accompagne les personnes et les organisations avec une approche melant executive coaching, philosophie et transformation humaine.",
  keywords: [
    'Monica Schneider',
    'executive coach',
    'philo coaching',
    'coaching leadership',
    'Happy Humans',
  ],
  openGraph: {
    title: 'Happy Humans - Coaching, leadership et transformation',
    description:
      "Une approche pour retrouver clarte, confiance et alignement dans sa vie professionnelle comme dans les organisations.",
    url: 'https://happy-humans.org',
    siteName: 'Happy Humans',
    images: [
      {
        url: 'https://happy-humans.org/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Happy Humans - coaching et transformation avec Monica Schneider',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Happy Humans - Coaching, leadership et transformation',
    description:
      'Executive coaching, philosophical counselling et accompagnement des equipes avec Monica Schneider.',
    images: ['https://happy-humans.org/og-default.jpg'],
  },
  alternates: {
    canonical: 'https://happy-humans.org',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function Home() {
  return <HomeClient />
}
