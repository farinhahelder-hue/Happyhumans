import { createClient } from "@/lib/supabase/server";
import {
  THEME_DEFAULTS,
  THEME_FONTS,
  THEME_KEYS,
  type FontKey,
  type Theme,
} from "@/lib/theme";

export type { Theme, FontKey } from "@/lib/theme";
export { themeToCss, fontHref } from "@/lib/theme";

export async function getTheme(): Promise<Theme> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cms_settings_kv")
    .select("key, value")
    .in("key", Object.values(THEME_KEYS));

  const byKey = Object.fromEntries((data || []).map(({ key, value }) => [key, value]));

  const font = byKey[THEME_KEYS.font];
  return {
    brand: byKey[THEME_KEYS.brand] || THEME_DEFAULTS.brand,
    accent: byKey[THEME_KEYS.accent] || THEME_DEFAULTS.accent,
    font: font && font in THEME_FONTS ? (font as FontKey) : THEME_DEFAULTS.font,
    logo: byKey[THEME_KEYS.logo] || THEME_DEFAULTS.logo,
    favicon: byKey[THEME_KEYS.favicon] || THEME_DEFAULTS.favicon,
  };
}
