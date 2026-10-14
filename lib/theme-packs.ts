// ── Packs d'illustrations — SOURCE UNIQUE ───────────────────────────
// Un thème recommande un pack (ThemeTokens.pack) ; le CMS peut le surcharger
// via la clé `illustration_pack`. Les pages consomment les slots, jamais de
// chemins en dur.
//
// Règle de gouvernance : seuls les visuels créés pour la marque vont dans les
// packs (ici : série cactus de « prez for SFL v4.1 »). Pas de portraits ni de
// photos tierces (droits) — celles-ci restent illustratives avec crédit.

export type IllustrationPack = {
  id: string;
  label: string;
  description: string;
  slots: {
    /** Visuel marque générique (hero alternatifs, partage…). */
    hero: string;
    /** Les 7 outils ; l'entrée 7 (V1/V2) a 2 images. */
    outils: string[][];
    /** Section lead magnet / téléchargement. */
    leadmagnet: string;
  };
};

const CACTUS_NUIT_DIR = '/images/conference';

export const THEME_PACKS: Record<string, IllustrationPack> = {
  'cactus-nuit': {
    id: 'cactus-nuit',
    label: 'Cactus nuit',
    description: 'Série cactus sur fond noir (conférence « 7 outils pour sourire dans le chaos »). Idéal sur sections sombres.',
    slots: {
      hero: `${CACTUS_NUIT_DIR}/boite-a-outils.webp`,
      outils: [
        [`${CACTUS_NUIT_DIR}/outil-1-comprendre-cerveau.webp`],
        [`${CACTUS_NUIT_DIR}/outil-2-recalibrer-optimisme.webp`],
        [`${CACTUS_NUIT_DIR}/outil-3-adversite-cadeau.webp`],
        [`${CACTUS_NUIT_DIR}/outil-4-liberte-fleur.webp`],
        [`${CACTUS_NUIT_DIR}/outil-5-homo-risibilis.webp`],
        [`${CACTUS_NUIT_DIR}/outil-6-action.webp`],
        [`${CACTUS_NUIT_DIR}/outil-7-v1.webp`, `${CACTUS_NUIT_DIR}/outil-7-v2.webp`],
      ],
      leadmagnet: `${CACTUS_NUIT_DIR}/boite-a-outils.webp`,
    },
  },
};

export const DEFAULT_PACK_ID = 'cactus-nuit';

/** Pack demandé, avec repli sûr si inconnu. */
export function resolvePack(id: string | undefined): IllustrationPack {
  if (id && THEME_PACKS[id]) return THEME_PACKS[id];
  return THEME_PACKS[DEFAULT_PACK_ID];
}
