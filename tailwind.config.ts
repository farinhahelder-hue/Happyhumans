import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette Happy Humans — alignée sur le logo
        'hh-green':      '#2d5f54',   // vert sapin foncé (logo tronc)
        'hh-green-dark': '#1e3a34',   // vert très foncé (texte/titres)
        'hh-green-mid':  '#3d7a6c',   // vert moyen (hover, accents)
        'hh-green-light':'#eef4f2',   // vert très clair (backgrounds)
        'hh-gold':       '#c9a96e',   // or doré (logo feuilles, "HAPPINESS DESIGN")
        'hh-gold-light': '#e8d5b0',   // or clair (accents doux)
        'hh-cream':      '#f5f0e8',   // beige crème (fond logo)
        'hh-cream-dark': '#ede5d8',   // beige plus foncé (sections alt)
        'hh-text':       '#1e3a34',   // texte principal
        'hh-text-muted': '#5a7a74',   // texte secondaire
        // Rétrocompatibilité
        'cloud-dancer':  '#f5f0e8',
        'eucalyptus':    '#2d5f54',
        'charcoal':      '#1e3a34',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'section': '80px',
      },
      maxWidth: {
        'container': '1400px',
      },
    },
  },
  plugins: [],
}
export default config
