// ── Blocs personnalisés : ajouter des sections comme un vrai CMS ─────
// Chaque page peut recevoir des blocs (titre+texte+image, texte, image, CTA,
// citation) créés dans l'admin (champ `custom_sections`, éditeur dédié).
// Stockage : UNE clé de contenu par page (`custom_sections`, JSON) → brouillon,
// aperçu et publication passent par le pipeline de contenu existant.
//
// Fichier SANS dépendance (partagé par les pages, l'admin et les tests).

export const CUSTOM_KEY = 'custom_sections';

export type SplitLayout = 'image-right' | 'image-left';
export type TextAlign = 'left' | 'center';

export type CustomBlock =
  | { id: string; type: 'split'; badge?: string; title: string; text: string; image: string; imageAlt?: string; ctaLabel?: string; ctaHref?: string; layout: SplitLayout }
  | { id: string; type: 'texte'; badge?: string; title?: string; text: string; align: TextAlign }
  | { id: string; type: 'image'; image: string; alt?: string; caption?: string }
  | { id: string; type: 'cta'; title: string; text?: string; button: string; href: string }
  | { id: string; type: 'citation'; quote: string; author?: string };

export type CustomBlockType = CustomBlock['type'];

export const BLOCK_TEMPLATES: { type: CustomBlockType; label: string; emoji: string }[] = [
  { type: 'split', label: 'Titre + texte + image (disposition au choix)', emoji: '🖼️' },
  { type: 'texte', label: 'Bloc de texte', emoji: '📝' },
  { type: 'image', label: 'Image pleine largeur', emoji: '🌄' },
  { type: 'cta', label: "Appel à l'action", emoji: '📣' },
  { type: 'citation', label: 'Citation', emoji: '💬' },
];

export function makeId(): string {
  return `b${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
}

export function blankBlock(type: CustomBlockType, id: string = makeId()): CustomBlock {
  switch (type) {
    case 'split': return { id, type, title: '', text: '', image: '', layout: 'image-right' };
    case 'texte': return { id, type, text: '', align: 'left' };
    case 'image': return { id, type, image: '' };
    case 'cta': return { id, type, title: '', button: '', href: '/contact' };
    case 'citation': return { id, type, quote: '' };
  }
}

function isBlock(v: unknown): v is CustomBlock {
  if (typeof v !== 'object' || v === null) return false;
  const b = v as Record<string, unknown>;
  return typeof b.id === 'string' && typeof b.type === 'string' &&
    BLOCK_TEMPLATES.some(t => t.type === b.type);
}

/** Lit le JSON du CMS ; invalide → [] (la page ne casse jamais). */
export function parseBlocks(json?: string | null): CustomBlock[] {
  if (!json || !json.trim()) return [];
  try {
    const v = JSON.parse(json);
    if (!Array.isArray(v)) return [];
    return v.filter(isBlock);
  } catch {
    return [];
  }
}

/** Valeur à enregistrer : '' si aucun bloc (retombe sur les défauts). */
export function serializeBlocks(blocks: CustomBlock[]): string {
  if (blocks.length === 0) return '';
  return JSON.stringify(blocks);
}

export function moveBlock(blocks: CustomBlock[], id: string, dir: -1 | 1): CustomBlock[] {
  const i = blocks.findIndex(b => b.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= blocks.length) return blocks;
  const next = [...blocks];
  ;[next[i], next[j]] = [next[j], next[i]];
  return next;
}

export function removeBlock(blocks: CustomBlock[], id: string): CustomBlock[] {
  return blocks.filter(b => b.id !== id);
}

export function updateBlock(blocks: CustomBlock[], id: string, patch: Partial<CustomBlock>): CustomBlock[] {
  return blocks.map(b => (b.id === id ? { ...b, ...patch } as CustomBlock : b));
}

/**
 * Découpe les sections natives pour insérer les blocs perso juste avant
 * l'appel à l'action final (pin 'end') quand il existe.
 * (Conservé pour compatibilité ; le rendu unifié passe par customSectionDefs.)
 */
export function splitForCustom(pinEndIds: string[], ids: string[]): { main: string[]; end: string[] } {
  const endSet = new Set(pinEndIds);
  return { main: ids.filter(id => !endSet.has(id)), end: ids.filter(id => endSet.has(id)) };
}

export const CUSTOM_ID_PREFIX = 'custom:';

/** Id de section correspondant à un bloc (utilisé dans sections_layout). */
export function customSectionId(blockId: string): string {
  return `${CUSTOM_ID_PREFIX}${blockId}`;
}

export function isCustomSectionId(id: string): boolean {
  return id.startsWith(CUSTOM_ID_PREFIX);
}

function blockLabel(b: CustomBlock): string {
  const tpl = BLOCK_TEMPLATES.find(t => t.type === b.type);
  const name = tpl ? `${tpl.emoji} ${tpl.label}` : b.type;
  const title = ('title' in b && b.title ? String(b.title) : '') ||
    ('quote' in b && b.quote ? String(b.quote) : '');
  return `🧩 ${name}${title ? ` — ${title.slice(0, 40)}` : ''}`;
}

/**
 * Pseudo-sections pour la liste Structure : les blocs perso deviennent
 * déplaçables / masquables comme les sections natives (ni pin, donc libres).
 */
export function customSectionDefs(blocks: CustomBlock[]): { id: string; label: string }[] {
  return blocks.map(b => ({ id: customSectionId(b.id), label: blockLabel(b) }));
}
