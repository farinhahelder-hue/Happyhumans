'use client'
import { useSiteSettings } from './useSiteSettings'
import {
  CALENDLY_BASE_SETTING,
  CALENDLY_EVENT_SETTING,
  calendlyBase,
  calendlyEventUrl,
  calendlyProfileUrl,
  type CalendlyService,
} from '@/lib/calendly-config'

/**
 * Liens de réservation réglés dans le CMS (⚙️ Paramètres → 📅 Réservation).
 * Au premier rendu les réglages ne sont pas encore là : les valeurs de secours de
 * `lib/calendly-config.ts` s'appliquent, donc un bouton n'est jamais vide.
 */
export function useCalendly() {
  const settings = useSiteSettings()
  const base = settings[CALENDLY_BASE_SETTING]
  return {
    /**
     * Les réglages sont-ils arrivés ? Avant, seul le repli est connu : un agenda qui se charge trop tôt
     * s'initialiserait sur le mauvais compte Calendly (le script lit `data-url` une seule fois).
     */
    ready: base !== undefined,
    /** Le compte Calendly (lien direct). */
    profileUrl: calendlyProfileUrl(base),
    /** L'adresse du rendez-vous d'un service (coaching, happiness-design…). */
    eventUrl: (service: CalendlyService) => calendlyEventUrl(service, base, settings[CALENDLY_EVENT_SETTING[service]]),
    /** Adresse brute du compte, utile pour l'affichage. */
    base: calendlyBase(base),
  }
}
