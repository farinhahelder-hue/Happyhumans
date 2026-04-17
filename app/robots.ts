import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/cms-admin',
          '/api/',
          '/travel-planning-form',
        ],
      },
    ],
    sitemap: 'https://happy-humans.org/sitemap.xml',
    host: 'https://happy-humans.org',
  };
}
