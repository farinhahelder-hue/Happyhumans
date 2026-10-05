// Textes par défaut de la page « Blog » — SOURCE UNIQUE.
// Lus par la page ET par l'admin du CMS (lib/cms-page-defaults.ts) : ne jamais les dupliquer ailleurs.
// Chaque clé correspond à un champ de PAGES_CONFIG (app/cms-admin/page.tsx).

export const BLOG_DEFAULTS: Record<string, string> = {
  hero_badge:       'Blog Happy Humans',
  hero_title:       'Des moments, des détours,\ndes repères qu\'on aurait aimé avoir avant.',
  hero_subtitle:    "On écrit depuis le terrain : une arrivée trop tardive, une adresse trouvée au bon moment, une erreur qu'on ne refera pas. Le reste, on le laisse aux brochures.",
  featured_label:   'À lire d\'abord',
  featured_title:   'Un carnet qui donne le ton.',
  empty_title:      "Rien de juste pour cette recherche, pour l'instant.",
  empty_text:       "Essaie un lieu, un mot plus simple, ou repars de tout le blog pour reprendre le fil.",
  empty_action:     'Voir tous les articles →',
  carnets_title:    'Carnets de voyage',
  carnets_desc:     "Les récits qui gardent l'heure, le rythme et ce qu'on a retenu sur place.",
  pepites_title:    'Découvertes locales',
  pepites_desc:     "Des lieux qu'on n'était pas venus chercher, et qu'on aurait regretté de rater.",
  guides_title:     'Guides pratiques',
  guides_desc:      "Des repères concrets quand le terrain devient plus utile que la théorie.",
  // ── Textes câblés automatiquement (étaient en dur dans la page) ──
  t_ecriture_et_reflexion: "Écriture et réflexion",
  t_lire_le_carnet: "Lire le carnet →",
  t_rechercher_un_carnet_un: "Rechercher un carnet, un lieu, un détail",
  t_effacer: "Effacer",
  // ── Référencement (Google, réseaux sociaux) — lu par generateMetadata via lib/page-seo.ts ──
  seo_title: "Ressources & Réflexions",
  seo_description: "Articles, réflexions et ressources sur le coaching, les relations et le leadership — par Monica Schneider, Happy Humans.",
  seo_image: '',
}
