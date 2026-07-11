import { MetadataRoute } from 'next';
import { getKvSettings } from '@/lib/cms-settings-server';

const BASE_URL = 'https://happyhumans.vercel.app';

// Pages pilotables depuis le CMS (Paramètres → Visibilité pages)
const TOGGLABLE_PAGES = [
  'home', 'a-propos', 'coaching', 'entreprises', 'happiness-design',
  'sparring-partner', 'relations', 'temoignages', 'booking', 'contact',
  'blog', 'faq',
];

export default async function robots(): Promise<MetadataRoute.Robots> {
  const kv = await getKvSettings();

  const disallow = ['/cms-admin', '/api/', '/travel-planning-form'];
  for (const page of TOGGLABLE_PAGES) {
    if (kv[`page_${page}_indexable`] === 'false') {
      disallow.push(page === 'home' ? '/$' : `/${page}`);
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
