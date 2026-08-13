import { MetadataRoute } from 'next';
import { getKvSettings, isPageIndexable } from '@/lib/cms-settings-server';
import { getAllPosts } from '@/lib/blog-supabase';

const BASE_URL = 'https://happyhumans.vercel.app';

type Freq = 'weekly' | 'monthly' | 'yearly';

// Toutes les pages publiques — la visibilité Google se pilote depuis
// le CMS (Paramètres → Visibilité pages)
const PAGES: { path: string; page: string; priority: number; freq: Freq }[] = [
  { path: '',                            page: 'home',                      priority: 1.0, freq: 'weekly' },
  { path: '/a-propos',                   page: 'a-propos',                  priority: 0.8, freq: 'monthly' },
  { path: '/coaching',                   page: 'coaching',                  priority: 0.9, freq: 'monthly' },
  { path: '/entreprises',                page: 'entreprises',               priority: 0.9, freq: 'monthly' },
  { path: '/happiness-design',           page: 'happiness-design',          priority: 0.9, freq: 'monthly' },
  { path: '/sparring-partner',           page: 'sparring-partner',          priority: 0.8, freq: 'monthly' },
  { path: '/relations',                  page: 'relations',                 priority: 0.8, freq: 'monthly' },
  { path: '/temoignages',                page: 'temoignages',               priority: 0.7, freq: 'monthly' },
  { path: '/booking',                    page: 'booking',                   priority: 0.6, freq: 'monthly' },
  { path: '/contact',                    page: 'contact',                   priority: 0.6, freq: 'monthly' },
  { path: '/blog',                       page: 'blog',                      priority: 0.8, freq: 'weekly' },
  { path: '/faq',                        page: 'faq',                       priority: 0.6, freq: 'monthly' },
  { path: '/mentions-legales',           page: 'mentions-legales',          priority: 0.2, freq: 'yearly' },
  { path: '/politique-confidentialite',  page: 'politique-confidentialite', priority: 0.2, freq: 'yearly' },
];

// Pages qui ont une version anglaise (/en/...) — voir docs/PLAN_FR_EN.md
const LOCALIZED = new Set([
  'home',
  'a-propos',
  'coaching',
  'entreprises',
  'happiness-design',
  'sparring-partner',
  'relations',
  'contact',
  'faq',
  'blog',
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const kv = await getKvSettings();

  const entries: MetadataRoute.Sitemap = [];
  for (const p of PAGES) {
    if (!isPageIndexable(kv, p.page)) continue;
    const frUrl = `${BASE_URL}${p.path}`;

    if (LOCALIZED.has(p.page)) {
      const enUrl = `${BASE_URL}/en${p.path}`;
      const languages = { fr: frUrl, en: enUrl };
      entries.push({
        url: frUrl,
        lastModified: new Date(),
        changeFrequency: p.freq,
        priority: p.priority,
        alternates: { languages },
      });
      entries.push({
        url: enUrl,
        lastModified: new Date(),
        changeFrequency: p.freq,
        priority: Math.max(0.1, p.priority - 0.1),
        alternates: { languages },
      });
    } else {
      entries.push({
        url: frUrl,
        lastModified: new Date(),
        changeFrequency: p.freq,
        priority: p.priority,
      });
    }
  }

  // Articles de blog publiés
  if (isPageIndexable(kv, 'blog')) {
    try {
      const posts = await getAllPosts();
      for (const post of posts) {
        const frUrl = `${BASE_URL}/blog/${post.slug}`;
        const enUrl = `${BASE_URL}/en/blog/${post.slug}`;
        const languages = { fr: frUrl, en: enUrl };
        const lastModified = new Date(post.updated_at ?? post.published_at ?? Date.now());
        entries.push({
          url: frUrl,
          lastModified,
          changeFrequency: 'monthly',
          priority: 0.6,
          alternates: { languages },
        });
        entries.push({
          url: enUrl,
          lastModified,
          changeFrequency: 'monthly',
          priority: 0.5,
          alternates: { languages },
        });
      }
    } catch {
      // Blog indisponible → sitemap des pages statiques uniquement
    }
  }

  return entries;
}
