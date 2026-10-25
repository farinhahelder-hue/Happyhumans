/**
 * Coordonnées du site — valeurs de secours uniquement.
 *
 * La source réelle est le CMS : ⚙️ Paramètres → Général (`contact_email`), servi au site par
 * `/api/cms/public-settings`. Ce module évite de recopier l'adresse dans plusieurs pages : il est
 * utilisé par les réglages par défaut (app/api/cms/settings) ET comme repli côté pages publiques.
 */

export const DEFAULT_CONTACT_EMAIL = 'happyhumans.coaching@gmail.com'
