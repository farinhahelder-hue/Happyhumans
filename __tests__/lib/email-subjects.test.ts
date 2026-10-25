import { describe, it, expect } from 'vitest'
import { EMAIL_SUBJECT_DEFAULTS, EMAIL_SUBJECT_SETTING, emailSubject } from '@/lib/email-subjects'

describe('emailSubject', () => {
  it('utilise l’objet par défaut quand aucun réglage n’existe', () => {
    expect(emailSubject('booking_confirmation')).toBe(EMAIL_SUBJECT_DEFAULTS.booking_confirmation)
    expect(emailSubject('contact_confirmation', {})).toBe(EMAIL_SUBJECT_DEFAULTS.contact_confirmation)
    expect(emailSubject('booking_confirmation', { [EMAIL_SUBJECT_SETTING.booking_confirmation]: '   ' })).toBe(
      EMAIL_SUBJECT_DEFAULTS.booking_confirmation,
    )
  })

  it('suit l’objet saisi dans le CMS', () => {
    const settings = { [EMAIL_SUBJECT_SETTING.contact_confirmation]: 'Nous avons bien reçu votre message' }
    expect(emailSubject('contact_confirmation', settings)).toBe('Nous avons bien reçu votre message')
  })

  it('remplace {name} par le nom du visiteur', () => {
    expect(emailSubject('admin_notice', {}, { name: 'Camille' })).toBe('Nouvelle demande — Camille')
    const settings = { [EMAIL_SUBJECT_SETTING.admin_notice]: 'Demande de {name}' }
    expect(emailSubject('admin_notice', settings, { name: 'Alex' })).toBe('Demande de Alex')
  })

  it('retire le séparateur quand le nom manque', () => {
    expect(emailSubject('admin_notice')).toBe('Nouvelle demande')
    expect(emailSubject('admin_notice', {}, { name: '   ' })).toBe('Nouvelle demande')
  })

  it('n’altère pas un objet sans {name} même si le nom manque', () => {
    expect(emailSubject('booking_confirmation', {}, {})).toBe(EMAIL_SUBJECT_DEFAULTS.booking_confirmation)
  })
})
