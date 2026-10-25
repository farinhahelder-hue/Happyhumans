// Valeurs par défaut de chaque page, pour pré-remplir l'admin du CMS.
//
// ⚠️ SOURCE UNIQUE : chaque entrée vient de lib/cms-defaults/<page>.ts, que la page importe AUSSI.
// Avant, deux copies (page + admin) divergeaient : l'admin affichait « 45 min » alors que le site
// disait « 1h », et un clic sur « Sauvegarder » écrivait la mauvaise valeur en base.
// Pour changer un texte par défaut : modifier UNIQUEMENT le module de la page.
import { HOME_DEFAULTS } from './cms-defaults/home'
import { A_PROPOS_DEFAULTS } from './cms-defaults/a-propos'
import { COACHING_DEFAULTS } from './cms-defaults/coaching'
import { ENTREPRISES_DEFAULTS } from './cms-defaults/entreprises'
import { HAPPINESS_DESIGN_DEFAULTS } from './cms-defaults/happiness-design'
import { RELATIONS_DEFAULTS } from './cms-defaults/relations'
import { SPARRING_PARTNER_DEFAULTS } from './cms-defaults/sparring-partner'
import { BOOKING_DEFAULTS } from './cms-defaults/booking'
import { CONTACT_DEFAULTS } from './cms-defaults/contact'
import { FAQ_DEFAULTS, FAQ_ITEMS } from './cms-defaults/faq'
import { BLOG_DEFAULTS } from './cms-defaults/blog'
import { FOOTER_DEFAULTS } from './cms-defaults/footer'
import { MENTIONS_LEGALES_DEFAULTS } from './cms-defaults/mentions-legales'
import { POLITIQUE_CONFIDENTIALITE_DEFAULTS } from './cms-defaults/politique-confidentialite'
import { MERCI_DEFAULTS } from './cms-defaults/merci'
import { SITE_DEFAULTS } from './cms-defaults/site'
import { TEST_ATTACHEMENT_DEFAULTS } from './cms-defaults/test-attachement'
import { FIL_ARIANE_DEFAULTS } from './cms-defaults/fil-ariane'
import { COMPTE_DEFAULTS } from './cms-defaults/compte'

export const PAGE_DEFAULTS: Record<string, Record<string, string>> = {
  home: HOME_DEFAULTS,
  'a-propos': A_PROPOS_DEFAULTS,
  coaching: COACHING_DEFAULTS,
  entreprises: ENTREPRISES_DEFAULTS,
  'happiness-design': HAPPINESS_DESIGN_DEFAULTS,
  relations: RELATIONS_DEFAULTS,
  'sparring-partner': SPARRING_PARTNER_DEFAULTS,
  booking: BOOKING_DEFAULTS,
  contact: CONTACT_DEFAULTS,
  faq: { ...FAQ_DEFAULTS, ...FAQ_ITEMS },
  blog: BLOG_DEFAULTS,
  footer: FOOTER_DEFAULTS,
  'mentions-legales': MENTIONS_LEGALES_DEFAULTS,
  'politique-confidentialite': POLITIQUE_CONFIDENTIALITE_DEFAULTS,
  merci: MERCI_DEFAULTS,
  site: SITE_DEFAULTS,
  'test-attachement': TEST_ATTACHEMENT_DEFAULTS,
  'fil-ariane': FIL_ARIANE_DEFAULTS,
  compte: COMPTE_DEFAULTS,
}
