import { MetadataRoute } from 'next';

const BASE_URL = 'https://happy-humans.org';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/a-propos`,
      lastModified: new Date('2026-04-17'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/coaching`,
      lastModified: new Date('2026-04-17'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/entreprises`,
      lastModified: new Date('2026-04-17'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date('2026-04-17'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/mentions-legales`,
      lastModified: new Date('2026-04-17'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/politique-confidentialite`,
      lastModified: new Date('2026-04-17'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];
}
