import { describe, it, expect } from 'vitest'
import {
  CALENDLY_BASE_DEFAULT,
  CALENDLY_EVENTS_DEFAULT,
  CALENDLY_SERVICES,
  calendlyBase,
  calendlyEventUrl,
  calendlyProfileUrl,
  calendlyServiceFrom,
  calendlySlug,
  calendlyWidgetUrl,
} from '@/lib/calendly-config'

describe('calendlyBase', () => {
  it('retombe sur le compte par défaut quand le réglage est vide', () => {
    expect(calendlyBase('')).toBe(CALENDLY_BASE_DEFAULT)
    expect(calendlyBase(null)).toBe(CALENDLY_BASE_DEFAULT)
    expect(calendlyBase(undefined)).toBe(CALENDLY_BASE_DEFAULT)
    expect(calendlyBase('   ')).toBe(CALENDLY_BASE_DEFAULT)
  })

  it('accepte le réglage saisi par Monica, avec ou sans https', () => {
    expect(calendlyBase('https://calendly.com/monica')).toBe('https://calendly.com/monica')
    expect(calendlyBase('https://calendly.com/monica/')).toBe('https://calendly.com/monica')
    expect(calendlyBase('calendly.com/monica')).toBe('https://calendly.com/monica')
    expect(calendlyBase('  https://calendly.com/monica//  ')).toBe('https://calendly.com/monica')
  })
})

describe('calendlySlug', () => {
  it('utilise le réglage du service, sinon le défaut', () => {
    expect(calendlySlug('coaching', 'nouveau-rendez-vous')).toBe('nouveau-rendez-vous')
    expect(calendlySlug('coaching', '')).toBe(CALENDLY_EVENTS_DEFAULT.coaching)
    expect(calendlySlug('coaching', '  /avec-slash  ')).toBe('avec-slash')
  })
})

describe('calendlyEventUrl', () => {
  it('compose compte + rendez-vous', () => {
    expect(calendlyEventUrl('coaching')).toBe(`${CALENDLY_BASE_DEFAULT}/${CALENDLY_EVENTS_DEFAULT.coaching}`)
    expect(calendlyEventUrl('entreprise' as never)).toContain(CALENDLY_BASE_DEFAULT)
  })

  it('suit les réglages du CMS', () => {
    expect(calendlyEventUrl('happiness-design', 'https://calendly.com/autre', 'decouverte-hd')).toBe(
      'https://calendly.com/autre/decouverte-hd',
    )
  })
})

describe('calendlyProfileUrl', () => {
  it('renvoie le compte seul', () => {
    expect(calendlyProfileUrl('')).toBe(CALENDLY_BASE_DEFAULT)
    expect(calendlyProfileUrl('https://calendly.com/monica/')).toBe('https://calendly.com/monica')
  })
})

describe('calendlyWidgetUrl', () => {
  it('ajoute les paramètres d’affichage sans casser une adresse existante', () => {
    expect(calendlyWidgetUrl('https://calendly.com/x')).toBe(
      'https://calendly.com/x?hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=2d5f54',
    )
    expect(calendlyWidgetUrl('https://calendly.com/x?a=1')).toContain('?a=1&hide_landing_page_details=1')
  })
})

describe('calendlyServiceFrom', () => {
  it('reconnaît les services du menu et ignore le reste', () => {
    for (const service of CALENDLY_SERVICES) expect(calendlyServiceFrom(service)).toBe(service)
    expect(calendlyServiceFrom('inconnu')).toBeNull()
    expect(calendlyServiceFrom('')).toBeNull()
    expect(calendlyServiceFrom(null)).toBeNull()
  })
})
