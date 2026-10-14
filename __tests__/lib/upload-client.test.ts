import { describe, it, expect, vi, afterEach } from 'vitest'
import { fitWithin, uploadErrorMessage, prepareImage, uploadImage, MAX_UPLOAD_BYTES } from '@/lib/upload-client'
import { logoPx, logoShape, resolveLogo, DEFAULT_LOGO, DEFAULT_LOGO_LIGHT, HEADER_LOGO_MAX } from '@/components/SiteLogo'

describe('fitWithin — réduction des photos', () => {
  it('ne touche pas une image déjà assez petite', () => {
    expect(fitWithin(1200, 800, 2400)).toEqual({ width: 1200, height: 800 })
  })
  it('réduit le côté le plus long en gardant les proportions', () => {
    expect(fitWithin(4800, 3200, 2400)).toEqual({ width: 2400, height: 1600 })
    expect(fitWithin(3000, 6000, 2400)).toEqual({ width: 1200, height: 2400 })
  })
  it('ne renvoie jamais une dimension nulle', () => {
    expect(fitWithin(10000, 1, 2400).height).toBe(1)
  })
})

describe('uploadErrorMessage — phrases pour Monica', () => {
  it('session expirée', () => expect(uploadErrorMessage(401)).toMatch(/reconnectez-vous/))
  it('image trop lourde pour Vercel (413)', () => expect(uploadErrorMessage(413)).toMatch(/4 Mo/))
  it('format refusé par le serveur', () => {
    expect(uploadErrorMessage(400, 'Type de fichier non autorisé')).toMatch(/JPG, PNG/)
  })
  it('erreur serveur : reprend le détail', () => {
    expect(uploadErrorMessage(500, 'Bucket non accessible')).toMatch(/Bucket non accessible/)
  })
  it('message de repli lisible', () => expect(uploadErrorMessage(418)).toMatch(/Envoi impossible/))
})

describe('prepareImage / uploadImage (sans navigateur)', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('refuse un format inconnu avec une explication', async () => {
    const heic = new File(['x'], 'photo.heic', { type: 'image/heic' })
    await expect(prepareImage(heic)).rejects.toThrow(/HEIC/)
    const pdf = new File(['x'], 'doc.pdf', { type: 'application/pdf' })
    await expect(prepareImage(pdf)).rejects.toThrow(/Format non pris en charge/)
  })

  it('laisse passer un SVG léger et refuse un SVG énorme', async () => {
    const small = new File(['<svg/>'], 'logo.svg', { type: 'image/svg+xml' })
    await expect(prepareImage(small)).resolves.toBe(small)
    const huge = new File([new Uint8Array(MAX_UPLOAD_BYTES + 1)], 'gros.svg', { type: 'image/svg+xml' })
    await expect(prepareImage(huge)).rejects.toThrow(/4 Mo/)
  })

  it('renvoie l’adresse publique quand le serveur répond', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ url: 'https://x/y.svg' }), { status: 200 })))
    const f = new File(['<svg/>'], 'logo.svg', { type: 'image/svg+xml' })
    await expect(uploadImage(f)).resolves.toBe('https://x/y.svg')
  })

  it('transforme un refus non JSON (ex. 413 de Vercel) en message clair', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('Request Entity Too Large', { status: 413 })))
    const f = new File(['<svg/>'], 'logo.svg', { type: 'image/svg+xml' })
    await expect(uploadImage(f)).rejects.toThrow(/trop lourde/)
  })

  it('signale une perte de connexion', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('network') }))
    const f = new File(['<svg/>'], 'logo.svg', { type: 'image/svg+xml' })
    await expect(uploadImage(f)).rejects.toThrow(/Connexion impossible/)
  })

  it('refuse une réponse « OK » sans adresse', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 200 })))
    const f = new File(['<svg/>'], 'logo.svg', { type: 'image/svg+xml' })
    await expect(uploadImage(f)).rejects.toThrow(/Envoi impossible/)
  })
})

describe('réglages du logo', () => {
  it('logoPx : valeur par défaut si vide ou invalide, bornée à la taille maximale', () => {
    expect(logoPx(undefined, 44)).toBe(44)
    expect(logoPx('', 44)).toBe(44)
    expect(logoPx('abc', 44)).toBe(44)
    expect(logoPx('0', 44)).toBe(44)
    expect(logoPx('52', 44)).toBe(52)
    expect(logoPx('96', 44)).toBe(HEADER_LOGO_MAX)
    expect(logoPx('72', 36, 72)).toBe(72)
  })
  it('logoShape : cercle par défaut', () => {
    expect(logoShape(undefined)).toBe('circle')
    expect(logoShape('rounded')).toBe('rounded')
    expect(logoShape('square')).toBe('square')
    expect(logoShape('triangle')).toBe('circle')
  })
})

describe('resolveLogo — logo de la charte par défaut', () => {
  it('sans logo envoyé : logo de la charte, sans découpe, sans le nom (il le contient déjà)', () => {
    expect(resolveLogo({})).toEqual({ url: DEFAULT_LOGO, shape: 'square', size: 52, showName: false, isDefault: true })
    // les réglages de forme / de nom ne s'appliquent pas au logo de la charte
    expect(resolveLogo({ logo_shape: 'circle', logo_show_name: 'true' })).toMatchObject({ shape: 'square', showName: false })
  })
  it('logo envoyé dans le CMS : ses réglages sont respectés', () => {
    const r = resolveLogo({ logo_url: 'https://x/logo.png', logo_shape: 'rounded', logo_size: '40', logo_show_name: 'false' })
    expect(r).toEqual({ url: 'https://x/logo.png', shape: 'rounded', size: 40, showName: false, isDefault: false })
    expect(resolveLogo({ logo_url: 'https://x/logo.png' }).showName).toBe(true)
  })
  it('pied de page : version claire et taille propre au pied de page', () => {
    const r = resolveLogo({ logo_footer_size: '48' }, { sizeKey: 'logo_footer_size', fallbackSize: 40, maxSize: 72, onDark: true })
    expect(r).toMatchObject({ url: DEFAULT_LOGO_LIGHT, size: 48 })
    expect(resolveLogo({}, { sizeKey: 'logo_footer_size', fallbackSize: 40, maxSize: 72, onDark: true }).size).toBe(40)
  })

  it('logo du pied de page : sur fond sombre, celui du CMS passe avant le logo de l’en-tête', () => {
    const onDark = { onDark: true, sizeKey: 'logo_footer_size', fallbackSize: 40, maxSize: 72 }
    // aucun logo : version claire de la charte
    expect(resolveLogo({}, onDark).url).toBe(DEFAULT_LOGO_LIGHT)
    // logo d'en-tête seul : repris dans le pied de page
    expect(resolveLogo({ logo_url: 'https://x/entete.png' }, onDark).url).toBe('https://x/entete.png')
    // logo de pied de page dédié : prioritaire en pied de page, sans effet sur l'en-tête
    const both = { logo_url: 'https://x/entete.png', logo_footer_url: 'https://x/pied-clair.png' }
    expect(resolveLogo(both, onDark)).toMatchObject({ url: 'https://x/pied-clair.png', isDefault: false })
    expect(resolveLogo(both).url).toBe('https://x/entete.png')
    // logo de pied de page sans logo d'en-tête : l'en-tête garde le logo de la charte
    expect(resolveLogo({ logo_footer_url: 'https://x/pied-clair.png' }).url).toBe(DEFAULT_LOGO)
  })
})
