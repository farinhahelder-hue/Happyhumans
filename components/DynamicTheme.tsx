'use client';
import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export const THEMES: Record<string, {
  label: string;
  primary: string; dark: string; light: string;
  accent: string; accentLight: string;
  bg: string; bgCard: string; text: string;
  font: string;
}> = {
  forest: {
    label: 'Forêt',
    primary: '#2d5f54', dark: '#1e3a34', light: '#4a9e8a',
    accent: '#c9a96e', accentLight: '#e8d5a3',
    bg: '#f5f0e8', bgCard: '#faf9f7', text: '#1a1a1a',
    font: "'Cormorant Garamond', 'Playfair Display', serif",
  },
  ocean: {
    label: 'Océan',
    primary: '#1e3a5f', dark: '#0f1e30', light: '#2563eb',
    accent: '#60a5fa', accentLight: '#bfdbfe',
    bg: '#f0f4ff', bgCard: '#f8faff', text: '#0f172a',
    font: "'Cormorant Garamond', 'Georgia', serif",
  },
  terre: {
    label: 'Terre',
    primary: '#7c3d12', dark: '#431407', light: '#b45309',
    accent: '#d97706', accentLight: '#fde68a',
    bg: '#fdf8f0', bgCard: '#fffbf5', text: '#1c0a00',
    font: "'Cormorant Garamond', 'Georgia', serif",
  },
  ardoise: {
    label: 'Ardoise',
    primary: '#1e293b', dark: '#0f172a', light: '#334155',
    accent: '#94a3b8', accentLight: '#e2e8f0',
    bg: '#f8fafc', bgCard: '#ffffff', text: '#0f172a',
    font: "'Cormorant Garamond', 'Georgia', serif",
  },
  rose: {
    label: 'Rose',
    primary: '#9d174d', dark: '#5b0a2e', light: '#be185d',
    accent: '#f9a8d4', accentLight: '#fce7f3',
    bg: '#fff0f6', bgCard: '#fff8fb', text: '#1a0010',
    font: "'Cormorant Garamond', 'Georgia', serif",
  },
};

function buildThemeCSS(t: typeof THEMES[string]): string {
  return `
:root {
  --hh-primary: ${t.primary};
  --hh-dark: ${t.dark};
  --hh-light: ${t.light};
  --hh-accent: ${t.accent};
  --hh-accent-light: ${t.accentLight};
  --hh-bg: ${t.bg};
  --hh-bg-card: ${t.bgCard};
  --hh-text: ${t.text};
  --hh-font: ${t.font};
}
body { background-color: ${t.bg} !important; color: ${t.text} !important; }

/* Primary backgrounds */
.bg-\\[\\#2d5f54\\],.bg-\\[\\#2f6b61\\],.bg-\\[\\#235249\\] { background-color: ${t.primary} !important; }
.bg-\\[\\#1e3a34\\] { background-color: ${t.dark} !important; }
.bg-\\[\\#f5f0e8\\],.bg-\\[\\#f5f3ef\\],.bg-\\[\\#f8f4ef\\],.bg-\\[\\#faf9f7\\],.bg-\\[\\#faf8f5\\] { background-color: ${t.bg} !important; }

/* Primary text */
.text-\\[\\#2d5f54\\],.text-\\[\\#2f6b61\\],.text-\\[\\#01696f\\] { color: ${t.primary} !important; }

/* Accent */
.text-\\[\\#c9a96e\\] { color: ${t.accent} !important; }
.bg-\\[\\#c9a96e\\] { background-color: ${t.accent} !important; }

/* Borders */
.border-\\[\\#2d5f54\\],.border-\\[\\#2f6b61\\] { border-color: ${t.primary} !important; }

/* Hover via focus */
.hover\\:bg-\\[\\#1e3a34\\]:hover,.hover\\:bg-\\[\\#235249\\]:hover { background-color: ${t.dark} !important; }

/* Inline style override via data-theme */
[data-hh-primary] { color: ${t.primary} !important; }
[data-hh-bg-primary] { background-color: ${t.primary} !important; }
[data-hh-accent] { color: ${t.accent} !important; }
[data-hh-bg] { background-color: ${t.bg} !important; }
`.trim();
}

export default function DynamicTheme() {
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    createClient(url, key)
      .from('cms_settings_kv')
      .select('key, value')
      .in('key', ['theme_preset', 'theme_primary', 'theme_dark', 'theme_accent', 'theme_bg', 'favicon_url'])
      .then(({ data }) => {
        if (!data) return;

        const settings: Record<string, string> = {};
        data.forEach((r: { key: string; value: string }) => { settings[r.key] = r.value; });

        // Favicon
        if (settings.favicon_url) {
          document.querySelectorAll("link[rel*='icon']").forEach(el => el.remove());
          const link = document.createElement('link');
          link.rel = 'icon'; link.href = settings.favicon_url;
          document.head.appendChild(link);
        }

        // Thème
        const preset = settings.theme_preset || 'forest';
        const base = THEMES[preset] || THEMES.forest;

        // Surcharges manuelles éventuelles
        const t = {
          ...base,
          ...(settings.theme_primary ? { primary: settings.theme_primary } : {}),
          ...(settings.theme_dark    ? { dark:    settings.theme_dark    } : {}),
          ...(settings.theme_accent  ? { accent:  settings.theme_accent  } : {}),
          ...(settings.theme_bg      ? { bg:      settings.theme_bg      } : {}),
        };

        let styleEl = document.getElementById('hh-dynamic-theme') as HTMLStyleElement | null;
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = 'hh-dynamic-theme';
          document.head.appendChild(styleEl);
        }
        styleEl.textContent = buildThemeCSS(t);
      });
  }, []);

  return null;
}
