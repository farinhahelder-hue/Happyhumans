// Schema-driven content blocks: every editable text section on the public
// site (home/coaching/entreprises) is described here once, then rendered by
// a single generic admin editor and fetched via getContentBlocks(). Storage
// key = `content-${page}-${key}`, value = JSON in cms_settings_kv (same
// pattern already used for page-sections-order-*).

export interface ContentField {
  key: string;
  label: string;
  type: "text" | "textarea" | "image";
}

interface BlockBase {
  key: string;
  label: string;
  page: "home" | "coaching" | "entreprises" | "contact" | "global";
  help?: string;
}

export interface FieldsBlock extends BlockBase {
  kind: "fields";
  fields: ContentField[];
  defaults: Record<string, string>;
}

export interface ListBlock extends BlockBase {
  kind: "list";
  itemFields: ContentField[];
  defaults: Record<string, string>[];
}

export type ContentBlock = FieldsBlock | ListBlock;

const HERO_FIELDS: ContentField[] = [
  { key: "title", label: "Titre", type: "textarea" },
  { key: "subtitle", label: "Sous-titre", type: "textarea" },
  { key: "image", label: "Image de fond", type: "image" },
];

const CTA_FIELDS: ContentField[] = [
  { key: "title", label: "Titre", type: "text" },
  { key: "subtitle", label: "Sous-titre", type: "textarea" },
  { key: "buttonText", label: "Texte du bouton", type: "text" },
];

const FAQ_ITEM_FIELDS: ContentField[] = [
  { key: "q", label: "Question", type: "text" },
  { key: "a", label: "Réponse", type: "textarea" },
];

export const CONTENT_BLOCKS: ContentBlock[] = [
  // --- Accueil ---
  {
    key: "hero",
    label: "En-tête",
    page: "home",
    kind: "fields",
    fields: HERO_FIELDS,
    defaults: {
      title: "Transformez votre leadership,\ncréez votre bonheur",
      subtitle:
        "Coaching exécutif personnalisé et programmes de transformation d'équipe",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1600&q=80&auto=format&fit=crop",
    },
  },
  {
    key: "headings",
    label: "Titres de sections & boutons",
    page: "home",
    kind: "fields",
    help: "Les titres affichés au-dessus de chaque section, et le texte des deux boutons du bandeau d'accueil.",
    fields: [
      { key: "heroButtonPrimary", label: "Bouton principal (hero)", type: "text" },
      { key: "heroButtonSecondary", label: "Bouton secondaire (hero)", type: "text" },
      { key: "bioHeading", label: "Titre section « Qui suis-je ? »", type: "text" },
      { key: "servicesHeading", label: "Titre section « Services »", type: "text" },
    ],
    defaults: {
      heroButtonPrimary: "Coaching Exécutif",
      heroButtonSecondary: "Pour les entreprises",
      bioHeading: "Qui suis-je ?",
      servicesHeading: "Services",
    },
  },
  {
    key: "bio",
    label: "Qui suis-je ?",
    page: "home",
    kind: "fields",
    help: "Une ligne vide sépare chaque paragraphe. Ajoute ta propre photo — sans photo, la section s'affiche sans image plutôt que d'en montrer une générique.",
    fields: [
      { key: "name", label: "Nom", type: "text" },
      { key: "photo", label: "Photo", type: "image" },
      { key: "paragraphs", label: "Texte (paragraphes)", type: "textarea" },
      {
        key: "stats",
        label: "Chiffres clés (un par ligne)",
        type: "textarea",
      },
    ],
    defaults: {
      name: "Monica Schneider",
      photo: "",
      paragraphs:
        "Coach exécutive certifiée ICF, spécialisée en leadership et transformation personnelle.\n\nJe crée des espaces de réflexion profonde où les dirigeants et managers explorent leurs freins, clarifient leur vision, et incarnent le leader qu'ils veulent devenir.\n\nMon approche : coaching psychologique + Happiness Design, pour réussir au travail en restant aligné avec soi-même.",
      stats: "15+ ans d'expérience\n500+ clients coachés\n9/10 de satisfaction",
    },
  },
  {
    key: "services",
    label: "Services",
    page: "home",
    kind: "list",
    help: "Les cartes affichées dans la section « Services ». Le lien peut être interne (ex : /coaching) ou une adresse complète (https://...). Le texte du lien est le libellé cliquable (ex : « En savoir plus → »).",
    itemFields: [
      { key: "title", label: "Titre", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "link", label: "Lien (URL)", type: "text" },
      { key: "linkLabel", label: "Texte du lien", type: "text" },
    ],
    defaults: [
      {
        title: "Coaching Individuel",
        description:
          "Séances 1:1 pour explorer votre leadership, identifier vos freins, et créer votre plan d'action.",
        link: "/coaching",
        linkLabel: "En savoir plus →",
      },
      {
        title: "Coaching d'Équipe",
        description:
          "Renforcez la cohésion et l'efficacité de vos équipes de direction avec des sessions groupées.",
        link: "/entreprises",
        linkLabel: "En savoir plus →",
      },
      {
        title: "Articles & Ressources",
        description:
          "Explorez des articles sur le leadership, la transformation personnelle et le Happiness Design.",
        link: "/blog",
        linkLabel: "Lire le blog →",
      },
    ],
  },
  {
    key: "cta",
    label: "Appel à l'action final",
    page: "home",
    kind: "fields",
    fields: CTA_FIELDS,
    defaults: {
      title: "Prêt à transformer votre leadership ?",
      subtitle:
        "Réservez une consultation gratuite et découvrez comment je peux vous accompagner",
      buttonText: "Réserver une séance découverte",
    },
  },

  // --- Coaching ---
  {
    key: "hero",
    label: "En-tête",
    page: "coaching",
    kind: "fields",
    fields: HERO_FIELDS,
    defaults: {
      title: "Coaching Exécutif & Leadership",
      subtitle: "Transformez votre leadership et débloquez votre potentiel",
      image:
        "https://images.unsplash.com/photo-1573496546038-82f9c39f6365?w=1600&q=80&auto=format&fit=crop",
    },
  },
  {
    key: "headings",
    label: "Titres de sections",
    page: "coaching",
    kind: "fields",
    fields: [
      { key: "programsHeading", label: "Titre section Programmes", type: "text" },
      { key: "testimonialsHeading", label: "Titre section Témoignages", type: "text" },
      { key: "faqHeading", label: "Titre section FAQ", type: "text" },
    ],
    defaults: {
      programsHeading: "Nos programmes",
      testimonialsHeading: "Témoignages",
      faqHeading: "Questions fréquentes",
    },
  },
  {
    key: "programs",
    label: "Programmes",
    page: "coaching",
    kind: "list",
    itemFields: [
      { key: "title", label: "Nom du programme", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
    defaults: [
      { title: "Executive Coaching", description: "Description du programme" },
      { title: "Leadership Development", description: "Description du programme" },
      { title: "Career Transition", description: "Description du programme" },
    ],
  },
  {
    key: "faq",
    label: "Questions fréquentes",
    page: "coaching",
    kind: "list",
    itemFields: FAQ_ITEM_FIELDS,
    defaults: [
      {
        q: "Combien de temps dure un coaching ?",
        a: "Généralement 3-6 mois, 1h par semaine",
      },
      {
        q: "Quel est l'investissement ?",
        a: "À partir de 2 000€/mois, personnalisé selon vos besoins",
      },
      {
        q: "Comment se déroule la première séance ?",
        a: "Évaluation gratuite de 30min pour définir vos objectifs",
      },
    ],
  },
  {
    key: "cta",
    label: "Appel à l'action final",
    page: "coaching",
    kind: "fields",
    fields: CTA_FIELDS,
    defaults: {
      title: "Prêt à transformer votre leadership ?",
      subtitle: "Réservez une séance découverte gratuite",
      buttonText: "Réserver maintenant",
    },
  },

  // --- Entreprises ---
  {
    key: "hero",
    label: "En-tête",
    page: "entreprises",
    kind: "fields",
    fields: HERO_FIELDS,
    defaults: {
      title: "Programmes pour Entreprises",
      subtitle: "Renforcez le leadership de vos équipes et boostez la performance",
      image:
        "https://images.unsplash.com/photo-1590650046871-92c887180603?w=1600&q=80&auto=format&fit=crop",
    },
  },
  {
    key: "headings",
    label: "Titres de sections",
    page: "entreprises",
    kind: "fields",
    fields: [
      { key: "metricsHeading", label: "Titre section Impact", type: "text" },
      { key: "casesHeading", label: "Titre section Cas d'usage", type: "text" },
      { key: "pricingHeading", label: "Titre section Tarification", type: "text" },
      { key: "faqHeading", label: "Titre section FAQ", type: "text" },
    ],
    defaults: {
      metricsHeading: "Impact mesurable",
      casesHeading: "Cas d'usage",
      pricingHeading: "Tarification",
      faqHeading: "Questions fréquentes",
    },
  },
  {
    key: "metrics",
    label: "Impact mesurable",
    page: "entreprises",
    kind: "list",
    help: "N'affiche que des chiffres réels et vérifiables.",
    itemFields: [
      { key: "metric", label: "Chiffre", type: "text" },
      { key: "label", label: "Légende", type: "text" },
    ],
    defaults: [
      { metric: "+35%", label: "Engagement" },
      { metric: "+28%", label: "Rétention" },
      { metric: "+42%", label: "Productivité" },
      { metric: "9/10", label: "Satisfaction" },
    ],
  },
  {
    key: "case-studies",
    label: "Cas d'usage",
    page: "entreprises",
    kind: "list",
    itemFields: [
      { key: "company", label: "Client (anonymisé)", type: "text" },
      { key: "challenge", label: "Défi", type: "text" },
      { key: "result", label: "Résultat", type: "text" },
    ],
    defaults: [
      {
        company: "Tech Startup (30 pers)",
        challenge: "Scaler rapidement",
        result: "Transition manager (3/5 promus)",
      },
      {
        company: "PME traditionnelle (100 pers)",
        challenge: "Transformation digitale",
        result: "Adoption accélérée + culture agile",
      },
      {
        company: "Groupe international (500+ pers)",
        challenge: "Alignement multiculturel",
        result: "Cohésion des directeurs régionaux",
      },
    ],
  },
  {
    key: "pricing",
    label: "Tarification",
    page: "entreprises",
    kind: "list",
    itemFields: [
      { key: "name", label: "Nom de l'offre", type: "text" },
      { key: "price", label: "Prix", type: "text" },
      { key: "desc", label: "Description", type: "text" },
    ],
    defaults: [
      {
        name: "Immersion",
        price: "À partir de 5 000€",
        desc: "Coaching collectif (groupe < 15)",
      },
      {
        name: "Transformation",
        price: "À partir de 15 000€",
        desc: "Coaching + ateliers (équipe dirigeante)",
      },
      {
        name: "Leadership Clinic",
        price: "Devis personnalisé",
        desc: "Solution complète (coaching + workshops + coaching)",
      },
    ],
  },
  {
    key: "faq",
    label: "Questions fréquentes",
    page: "entreprises",
    kind: "list",
    itemFields: FAQ_ITEM_FIELDS,
    defaults: [
      { q: "Durée de déploiement ?", a: "3-12 mois selon la taille du groupe" },
      {
        q: "À qui ça s'adresse ?",
        a: "Équipes de direction, managers en transition, collectifs en transformation",
      },
      {
        q: "Quelle méthodologie ?",
        a: "Coaching individuel + coaching d'équipe + workshops Happiness Design",
      },
    ],
  },
  {
    key: "cta",
    label: "Appel à l'action final",
    page: "entreprises",
    kind: "fields",
    fields: CTA_FIELDS,
    defaults: {
      title: "Parlons de votre projet",
      subtitle: "Découvrez comment transformer votre culture d'entreprise",
      buttonText: "Nous contacter",
    },
  },

  // --- Contact ---
  {
    key: "hero",
    label: "En-tête",
    page: "contact",
    kind: "fields",
    fields: [
      { key: "title", label: "Titre", type: "text" },
      { key: "subtitle", label: "Sous-titre", type: "textarea" },
    ],
    defaults: {
      title: "Nous contacter",
      subtitle:
        "Vous avez une question ? Prenez rendez-vous ou envoyez-nous un message.",
    },
  },
  {
    key: "labels",
    label: "Titres et libellés",
    page: "contact",
    kind: "fields",
    help: "Les coordonnées elles-mêmes (email, téléphone, lieu) se modifient dans Paramètres. Ici, uniquement les titres affichés autour.",
    fields: [
      { key: "coordinatesHeading", label: "Titre « Coordonnées »", type: "text" },
      { key: "emailLabel", label: "Libellé Email", type: "text" },
      { key: "phoneLabel", label: "Libellé Téléphone", type: "text" },
      { key: "locationLabel", label: "Libellé Localisation", type: "text" },
      { key: "socialLabel", label: "Libellé Réseaux", type: "text" },
      { key: "formHeading", label: "Titre du formulaire", type: "text" },
      { key: "calendlyHeading", label: "Titre du calendrier", type: "text" },
      { key: "calendlyFallback", label: "Texte sous le calendrier", type: "textarea" },
    ],
    defaults: {
      coordinatesHeading: "Coordonnées",
      emailLabel: "Email",
      phoneLabel: "Téléphone",
      locationLabel: "Localisation",
      socialLabel: "Réseaux",
      formHeading: "Envoyez-nous un message",
      calendlyHeading: "Réservez votre séance découverte",
      calendlyFallback:
        "Impossible d'accéder au calendrier ? Écrivez-nous directement :",
    },
  },
  {
    key: "social",
    label: "Réseaux sociaux",
    page: "contact",
    kind: "list",
    help: "Les liens affichés dans la section « Réseaux ». Ajoutez, supprimez ou réordonnez librement (LinkedIn, Instagram, etc.).",
    itemFields: [
      { key: "label", label: "Nom du réseau", type: "text" },
      { key: "url", label: "Lien (URL)", type: "text" },
    ],
    defaults: [
      { label: "LinkedIn", url: "https://linkedin.com/in/monicaschneider" },
      { label: "Twitter", url: "https://twitter.com/happyhumans" },
    ],
  },

  // --- Général (en-tête & pied de page, sur toutes les pages) ---
  {
    key: "header",
    label: "En-tête (menu)",
    page: "global",
    kind: "fields",
    help: "La barre de navigation en haut de chaque page. Le nom de marque est aussi utilisé dans le pied de page.",
    fields: [
      { key: "brand", label: "Nom de marque", type: "text" },
      { key: "ctaLabel", label: "Bouton « Découverte »", type: "text" },
      { key: "navCoaching", label: "Lien menu : Coaching", type: "text" },
      { key: "navEntreprises", label: "Lien menu : Entreprises", type: "text" },
      { key: "navBlog", label: "Lien menu : Blog", type: "text" },
      { key: "navContact", label: "Lien menu : Contact", type: "text" },
    ],
    defaults: {
      brand: "Happy Humans",
      ctaLabel: "Découverte gratuite",
      navCoaching: "Coaching",
      navEntreprises: "Entreprises",
      navBlog: "Blog",
      navContact: "Contact",
    },
  },
  {
    key: "footer",
    label: "Pied de page",
    page: "global",
    kind: "fields",
    fields: [
      { key: "servicesHeading", label: "Titre colonne Services", type: "text" },
      { key: "linkCoaching", label: "Lien : Coaching", type: "text" },
      { key: "linkEntreprises", label: "Lien : Entreprises", type: "text" },
      { key: "resourcesHeading", label: "Titre colonne Ressources", type: "text" },
      { key: "linkBlog", label: "Lien : Blog", type: "text" },
      { key: "contactHeading", label: "Titre colonne Contact", type: "text" },
      { key: "linkContact", label: "Lien : Nous contacter", type: "text" },
    ],
    defaults: {
      servicesHeading: "Services",
      linkCoaching: "Coaching Exécutif & Leadership",
      linkEntreprises: "Programmes Entreprises",
      resourcesHeading: "Ressources",
      linkBlog: "Blog",
      contactHeading: "Contact",
      linkContact: "Nous contacter",
    },
  },
  {
    key: "seo",
    label: "SEO (référencement)",
    page: "global",
    kind: "fields",
    help: "Le titre et la description affichés dans Google et dans les aperçus de lien sur les réseaux sociaux. N'affecte pas l'apparence des pages elles-mêmes.",
    fields: [
      { key: "title", label: "Titre (onglet & Google)", type: "text" },
      { key: "description", label: "Description (Google)", type: "textarea" },
      { key: "ogImage", label: "Image de partage (URL)", type: "image" },
    ],
    defaults: {
      title: "Happy Humans - Coaching & Happiness Design",
      description:
        "Coaching exécutif et programmes de leadership personnalisés avec Monica Schneider",
      ogImage: "https://happyhumans.fr/og-image.png",
    },
  },
];

import type { Locale } from "@/lib/i18n";

// Storage key in cms_settings_kv. French (default) is unsuffixed for backward
// compatibility; other locales get a `-<locale>` suffix, e.g. `...-en`.
export function storageKey(
  block: Pick<ContentBlock, "page" | "key">,
  locale: Locale = "fr"
): string {
  const base = `content-${block.page}-${block.key}`;
  return locale === "fr" ? base : `${base}-${locale}`;
}
