'use client';
import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { THEMES, buildThemeCSS, resolveTheme } from '@/lib/themes';

// Re-export pour l'admin (app/cms-admin/page.tsx : THEME PICKER).
// SOURCE UNIQUE des presets : lib/themes.ts.
export { THEMES };

export default function DynamicTheme() {
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    createClient(url, key)
      .from('cms_settings_kv')
      .select('key, value')
      .in('key', ['theme_preset', 'theme_primary', 'theme_dark', 'theme_light', 'theme_accent', 'theme_bg', 'theme_bg_card', 'theme_text', 'theme_font_heading', 'theme_font_body', 'favicon_url'])
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

        // Thème (même résolution que le SSR : preset + surcharges)
        const { id, tokens } = resolveTheme(settings.theme_preset, {
          primary: settings.theme_primary,
          dark: settings.theme_dark,
          light: settings.theme_light,
          accent: settings.theme_accent,
          bg: settings.theme_bg,
          bgCard: settings.theme_bg_card,
          text: settings.theme_text,
          fontHeading: settings.theme_font_heading,
          fontBody: settings.theme_font_body,
        });
        document.documentElement.setAttribute('data-theme', id);

        let styleEl = document.getElementById('hh-dynamic-theme') as HTMLStyleElement | null;
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = 'hh-dynamic-theme';
          document.head.appendChild(styleEl);
        }
        styleEl.textContent = buildThemeCSS(tokens);
      });
  }, []);

  return null;
}
