import { describe, it, expect } from 'vitest'
import { esc, bookingConfirmationHtml, contactConfirmationHtml, adminNotifHtml } from '../../lib/send-email'

/**
 * Les formulaires publics (contact, réservation) envoient un e-mail de confirmation à l'adresse SAISIE par le
 * visiteur, depuis l'expéditeur du site. Les valeurs saisies doivent donc être échappées : sinon n'importe qui
 * pouvait envoyer à n'importe qui un e-mail contenant le HTML de son choix (liens d'hameçonnage).
 */
const EVIL = '<a href="https://evil.example/login">Cliquez ici pour confirmer</a><script>alert(1)</script>'

describe('esc', () => {
  it('neutralise les caractères HTML', () => {
    expect(esc('<b>"x" & \'y\'</b>')).toBe('&lt;b&gt;&quot;x&quot; &amp; &#39;y&#39;&lt;/b&gt;')
  })
  it('gère les valeurs vides ou non textuelles', () => {
    expect(esc(undefined)).toBe('')
    expect(esc(null)).toBe('')
    expect(esc(42)).toBe('42')
  })
})

describe('gabarits d’e-mail : aucune balise venant d’un visiteur n’est interprétée', () => {
  it('confirmation de réservation', () => {
    const html = bookingConfirmationHtml({ name: EVIL, date: EVIL })
    expect(html).not.toContain('<a href="https://evil.example')
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;a href=')
  })
  it('confirmation de contact', () => {
    const html = contactConfirmationHtml(EVIL)
    expect(html).not.toContain('evil.example/login">')
    expect(html).not.toContain('<script>')
  })
  it('notification à l’administratrice : tous les champs saisis', () => {
    const html = adminNotifHtml({ name: EVIL, email: EVIL, phone: EVIL, message: EVIL, date: EVIL, time: EVIL })
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('<a href="https://evil.example')
  })
  it('les valeurs légitimes (accents, apostrophes) restent lisibles', () => {
    const html = contactConfirmationHtml("Hélène d'Arc")
    expect(html).toContain('Hélène d&#39;Arc')
  })
  it('la durée annoncée est celle du site (1h)', () => {
    expect(bookingConfirmationHtml({ slot_type: 'discovery' })).toContain('1h')
    expect(bookingConfirmationHtml({ slot_type: 'discovery' })).not.toContain('45 min')
  })
})
