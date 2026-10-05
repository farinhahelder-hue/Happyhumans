// Textes par défaut de la page « Réservation » — SOURCE UNIQUE.
// Lus par la page ET par l'admin du CMS (lib/cms-page-defaults.ts) : ne jamais les dupliquer ailleurs.
// Chaque clé correspond à un champ de PAGES_CONFIG (app/cms-admin/page.tsx).

export const BOOKING_DEFAULTS: Record<string, string> = {
  hero_badge:         'Réservation',
  hero_title:         'Réserver une séance',
  hero_subtitle:      'Séance découverte offerte · 1h · Sans engagement',
  reassurance_1_title: 'Séance découverte gratuite',
  reassurance_1_desc:  '1h sans engagement pour vous présenter et voir si le coaching vous correspond.',
  reassurance_2_title: 'Confirmation immédiate',
  reassurance_2_desc:  'La réservation est confirmée instantanément dans votre agenda Google ou Outlook.',
  reassurance_3_title: 'Annulation libre',
  reassurance_3_desc:  "Vous pouvez reporter ou annuler jusqu'à 24h avant la séance, sans frais.",
  footer_note:         'Toutes les séances se déroulent en ligne (Google Meet) ou en présentiel à Paris, selon votre préférence.',
  email_booking_text:  'Écrire à Monica →',
  // ── Textes câblés automatiquement (étaient en dur dans la page) ──
  t_chargement_du_calendrier: "Chargement du calendrier…",
  t_ouvrir_calendly_directement: "Ouvrir Calendly directement →",
  t_vous_preferez_reserver_par: "Vous préférez réserver par email ?",
  // ── Référencement (Google, réseaux sociaux) — lu par generateMetadata via lib/page-seo.ts ──
  seo_title: "Réserver une séance — Monica Schneider",
  seo_description: "Réservez une séance découverte gratuite (1h) avec Monica Schneider. Executive coaching, philosophical counselling et Happiness Design.",
  seo_image: '',
}
