/**
 * Objets des e-mails automatiques — réglés dans le CMS (⚙️ Paramètres → 📧 Emails automatiques).
 *
 * Seul l'OBJET est modifiable : le corps des messages reste dans `lib/send-email.ts` (gabarits HTML
 * testés, avec échappement des valeurs saisies par les visiteurs). `{name}` est remplacé par le nom
 * du visiteur ; si le nom manque, le séparateur qui le précède est retiré.
 *
 * Aucune dépendance React/Next : testé seul dans `__tests__/lib/email-subjects.test.ts`.
 */

export type EmailKind = 'booking_confirmation' | 'contact_confirmation' | 'admin_notice'

export const EMAIL_SUBJECT_DEFAULTS: Record<EmailKind, string> = {
  booking_confirmation: 'Votre séance est bien reçue — Happy Humans',
  contact_confirmation: 'Message bien reçu — Happy Humans',
  admin_notice: 'Nouvelle demande — {name}',
}

/** Clé de réglage (table `cms_settings_kv`) qui porte l'objet d'un e-mail. */
export const EMAIL_SUBJECT_SETTING: Record<EmailKind, string> = {
  booking_confirmation: 'email_subject_booking_confirmation',
  contact_confirmation: 'email_subject_contact_confirmation',
  admin_notice: 'email_subject_admin_notice',
}

/**
 * Objet à envoyer : le réglage s'il est rempli, sinon le défaut.
 * `vars.name` remplace `{name}` ; un nom vide retire le séparateur final (« Nouvelle demande — » → « Nouvelle demande »).
 */
export function emailSubject(
  kind: EmailKind,
  settings: Record<string, string | undefined> = {},
  vars: { name?: string } = {},
): string {
  const configured = (settings[EMAIL_SUBJECT_SETTING[kind]] ?? '').trim()
  const template = configured || EMAIL_SUBJECT_DEFAULTS[kind]
  const name = (vars.name ?? '').trim()
  if (!template.includes('{name}')) return template
  if (name) return template.replace(/\{name\}/g, name)
  return template.replace(/\{name\}/g, '').replace(/\s*[—–-]\s*$/, '').trim()
}
