// Client-safe theme constants and pure helpers. No server-only imports here
// so this can be used from both the admin (client) UI and the server layout.
// The DB read lives in lib/getTheme.ts.

export const THEME_FONTS = {
  system: {
    label: "Système (par défaut)",
    google: null as string | null,
    family:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  inter: {
    label: "Inter (moderne)",
    google: "Inter:wght@400;600;700",
    family: "'Inter', sans-serif",
  },
  poppins: {
    label: "Poppins (arrondi)",
    google: "Poppins:wght@400;600;700",
    family: "'Poppins', sans-serif",
  },
  montserrat: {
    label: "Montserrat (net)",
    google: "Montserrat:wght@400;600;700",
    family: "'Montserrat', sans-serif",
  },
  lora: {
    label: "Lora (serif chaleureux)",
    google: "Lora:wght@400;600;700",
    family: "'Lora', serif",
  },
  playfair: {
    label: "Playfair Display (élégant)",
    google: "Playfair+Display:wght@400;600;700",
    family: "'Playfair Display', serif",
  },
} as const;

export type FontKey = keyof typeof THEME_FONTS;

export interface Theme {
  brand: string; // hex, e.g. "#2563eb"
  accent: string; // hex
  font: FontKey;
  logo: string; // image URL, "" = use text brand name
  favicon: string; // image URL, "" = use default /favicon.ico
}

export const THEME_DEFAULTS: Theme = {
  brand: "#2563eb",
  accent: "#4f46e5",
  font: "system",
  logo: "",
  favicon: "",
};

// cms_settings_kv keys backing each theme field.
export const THEME_KEYS = {
  brand: "theme-brand",
  accent: "theme-accent",
  font: "theme-font",
  logo: "site-logo",
  favicon: "site-favicon",
} as const;

// Ready-made colour + font combinations offered as one-click templates.
export interface ThemeTemplate {
  id: string;
  label: string;
  brand: string;
  accent: string;
  font: FontKey;
}

export const THEME_TEMPLATES: ThemeTemplate[] = [
  { id: "ocean", label: "Océan (défaut)", brand: "#2563eb", accent: "#4f46e5", font: "system" },
  { id: "foret", label: "Forêt", brand: "#059669", accent: "#0d9488", font: "poppins" },
  { id: "coucher", label: "Coucher de soleil", brand: "#ea580c", accent: "#db2777", font: "montserrat" },
  { id: "prune", label: "Prune", brand: "#7c3aed", accent: "#c026d3", font: "poppins" },
  { id: "elegant", label: "Élégant", brand: "#b45309", accent: "#1f2937", font: "playfair" },
  { id: "rose", label: "Rose poudré", brand: "#e11d48", accent: "#9333ea", font: "lora" },
];

// "#2563eb" -> "37 99 235" (space-separated channels for `<alpha-value>`).
export function hexToChannels(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return "37 99 235";
  const int = parseInt(m[1], 16);
  return `${(int >> 16) & 255} ${(int >> 8) & 255} ${int & 255}`;
}

// Darken a hex colour by `factor` (0-1) for the -dark variant channels.
export function darkenChannels(hex: string, factor = 0.72): string {
  return hexToChannels(hex)
    .split(" ")
    .map((c) => Math.round(Number(c) * factor))
    .join(" ");
}

// Builds the `:root { ... }` inner CSS injected in the layout <head>.
export function themeToCss(theme: Theme): string {
  const fontFamily = THEME_FONTS[theme.font].family;
  return [
    `--brand:${hexToChannels(theme.brand)}`,
    `--brand-dark:${darkenChannels(theme.brand)}`,
    `--accent:${hexToChannels(theme.accent)}`,
    `--accent-dark:${darkenChannels(theme.accent)}`,
    `--font-sans:${fontFamily}`,
  ].join(";");
}

// WCAG contrast ratio between a hex colour and white (buttons use white text
// on brand/accent backgrounds). ~1 = invisible, 21 = max. Below ~4 the white
// text starts to be hard to read.
export function contrastWithWhite(hex: string): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const [r, g, b] = hexToChannels(hex).split(" ").map(Number);
  const lum = 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  return 1.05 / (lum + 0.05);
}

// Google Fonts stylesheet href for the chosen font, or null for system.
export function fontHref(theme: Theme): string | null {
  const google = THEME_FONTS[theme.font].google;
  return google
    ? `https://fonts.googleapis.com/css2?family=${google}&display=swap`
    : null;
}
