import { describe, it, expect } from 'vitest'
import { buildCrumbs, isBreadcrumbHidden, prettifySegment } from '@/lib/breadcrumb'

describe('prettifySegment', () => {
  it('remplace les tirets par des espaces, seule la première lettre est en capitale', () => {
    expect(prettifySegment('nos-ateliers')).toBe('Nos ateliers')
    expect(prettifySegment('nos-ateliers-2026')).toBe('Nos ateliers 2026')
    expect(prettifySegment('a-propos')).toBe('A propos')
    expect(prettifySegment('contact')).toBe('Contact')
    expect(prettifySegment('')).toBe('')
  })
})

describe('isBreadcrumbHidden', () => {
  it('masque le fil sur l’accueil', () => {
    expect(isBreadcrumbHidden('1', '/')).toBe(true)
    expect(isBreadcrumbHidden('1', '')).toBe(true)
  })

  it('suit l’interrupteur du CMS', () => {
    for (const off of ['0', ' non ', 'false', 'OFF']) {
      expect(isBreadcrumbHidden(off, '/coaching')).toBe(true)
    }
    expect(isBreadcrumbHidden('1', '/coaching')).toBe(false)
    expect(isBreadcrumbHidden('', '/coaching')).toBe(false) // vide = affiché
    expect(isBreadcrumbHidden(undefined, '/coaching')).toBe(false)
  })
})

describe('buildCrumbs', () => {
  it('construit Accueil + un maillon par segment', () => {
    expect(buildCrumbs('/coaching', 'Accueil')).toEqual([
      { label: 'Accueil', href: '/' },
      { label: 'Coaching', href: '/coaching' },
    ])
  })

  it('utilise les libellés du CMS', () => {
    const crumbs = buildCrumbs('/contact', 'Maison', { '/contact': 'Me contacter' })
    expect(crumbs).toEqual([
      { label: 'Maison', href: '/' },
      { label: 'Me contacter', href: '/contact' },
    ])
  })

  it('garde le texte déduit quand le libellé CMS est vide', () => {
    const crumbs = buildCrumbs('/a-propos', 'Accueil', { '/a-propos': '   ' })
    expect(crumbs[1]).toEqual({ label: 'A propos', href: '/a-propos' })
  })

  it('gère les adresses imbriquées (article, page libre)', () => {
    expect(buildCrumbs('/blog/mon-article', 'Accueil', { '/blog': 'Ressources' })).toEqual([
      { label: 'Accueil', href: '/' },
      { label: 'Ressources', href: '/blog' },
      { label: 'Mon article', href: '/blog/mon-article' },
    ])
    // le préfixe technique /p des pages créées dans le CMS ne s'affiche pas
    expect(buildCrumbs('/p/ateliers')).toEqual([
      { label: 'Accueil', href: '/' },
      { label: 'Ateliers', href: '/p/ateliers' },
    ])
    expect(buildCrumbs('/p/nos-ateliers-2026')[1].label).toBe('Nos ateliers 2026')
  })

  it('affiche un nom lisible pour les pages de l’espace client', () => {
    // ni « auth » ni « login » ne doivent apparaître chez le visiteur
    expect(buildCrumbs('/auth/login')).toEqual([
      { label: 'Accueil', href: '/' },
      { label: 'Connexion', href: '/auth/login' },
    ])
    expect(buildCrumbs('/auth/register')[1].label).toBe('Créer un compte')
    expect(buildCrumbs('/dashboard')[1].label).toBe('Espace client')
    // un libellé saisi dans le CMS reste prioritaire
    expect(buildCrumbs('/auth/login', 'Accueil', { '/auth/login': 'Mon espace' })[1].label).toBe('Mon espace')
  })

  it('ignore les paramètres et les ancres', () => {
    expect(buildCrumbs('/contact?x=1#haut').map(c => c.href)).toEqual(['/', '/contact'])
  })

  it('retombe sur « Accueil » si le libellé de départ est vide', () => {
    expect(buildCrumbs('/faq', '')[0].label).toBe('Accueil')
    expect(buildCrumbs('/faq', null)[0].label).toBe('Accueil')
  })

  it('ne renvoie que l’accueil sur la racine', () => {
    expect(buildCrumbs('/', 'Accueil')).toEqual([{ label: 'Accueil', href: '/' }])
  })
})
