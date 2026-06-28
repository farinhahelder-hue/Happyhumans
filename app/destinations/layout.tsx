import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coaching | Happy Humans - Monica Schneider',
  description: 'Executive coaching et philosophical counselling avec Monica Schneider. Reprenez le pouvoir sur votre parcours professionnel et personnel.',
  keywords: ['coaching', 'executive coaching', 'monica schneider', 'happy humans', 'leadership'],
  alternates: {
    canonical: 'https://happyhumans.vercel.app/coaching',
  },
  openGraph: {
    title: 'Coaching — Happy Humans',
    description: 'Executive coaching et philosophical counselling avec Monica Schneider.',
    url: 'https://happyhumans.vercel.app/coaching',
    siteName: 'Happy Humans',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function DestinationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
