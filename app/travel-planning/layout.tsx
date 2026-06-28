import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Voyage sur mesure | Happy Humans - Coaching',
  description:
    'On ne fait pas des itinéraires. On fait le tien. Slow travel vécu, adresses testées et séquence pensée pour couples, solos, familles ou amis.',
  keywords: [
    'coaching',
    'happy humans',
    'monica schneider',
  ],
  alternates: {
    canonical: 'https://happyhumans.vercel.app/coaching',
  },
  openGraph: {
    title: 'Coaching — Happy Humans',
    description:
      'Adresses testées, rythme juste et vraie séquence de terrain pour couples, solos, familles ou amis.',
    url: 'https://happyhumans.vercel.app/coaching',
    siteName: 'Happy Humans',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1200&q=85',
        width: 1200,
        height: 630,
        alt: 'Happy Humans — Coaching',
      },
    ],
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coaching | Happy Humans',
    description:
      'On part de tes contraintes réelles pour construire un voyage qui tient sur le terrain.',
    images: ['https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1200&q=85'],
  },
};

export default function TravelPlanningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
