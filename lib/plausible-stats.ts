import { plausible } from "@/lib/integrations";

export interface SiteStats {
  visitors: number;
  pageviews: number;
  bounceRate: number; // percent
  visitDuration: number; // seconds
  topPages: { page: string; visitors: number }[];
}

const API_HOST = process.env.PLAUSIBLE_API_HOST || "https://plausible.io";

/**
 * Fetches top-line traffic stats (last 30 days) from the Plausible Stats API.
 * Returns null when unconfigured (no PLAUSIBLE_API_KEY) or on any error, so the
 * dashboard degrades gracefully to a "connect Plausible" hint. Cached 1h.
 */
export async function getSiteStats(): Promise<SiteStats | null> {
  const apiKey = process.env.PLAUSIBLE_API_KEY;
  const site = plausible.domain;
  if (!apiKey || !site) return null;

  const headers = { Authorization: `Bearer ${apiKey}` };
  const q = `site_id=${encodeURIComponent(site)}&period=30d`;

  try {
    const [aggRes, pagesRes] = await Promise.all([
      fetch(
        `${API_HOST}/api/v1/stats/aggregate?${q}&metrics=visitors,pageviews,bounce_rate,visit_duration`,
        { headers, next: { revalidate: 3600 } }
      ),
      fetch(
        `${API_HOST}/api/v1/stats/breakdown?${q}&property=event:page&metrics=visitors&limit=5`,
        { headers, next: { revalidate: 3600 } }
      ),
    ]);

    if (!aggRes.ok) return null;
    const agg = await aggRes.json();
    const pages = pagesRes.ok ? await pagesRes.json() : { results: [] };

    return {
      visitors: agg.results?.visitors?.value ?? 0,
      pageviews: agg.results?.pageviews?.value ?? 0,
      bounceRate: agg.results?.bounce_rate?.value ?? 0,
      visitDuration: agg.results?.visit_duration?.value ?? 0,
      topPages: (pages.results || []).map(
        (r: { page: string; visitors: number }) => ({
          page: r.page,
          visitors: r.visitors,
        })
      ),
    };
  } catch {
    return null;
  }
}

// Plausible cloud dashboard URL for the "view full stats" link.
export function plausibleDashboardUrl(): string {
  return `${API_HOST}/${plausible.domain}`;
}
