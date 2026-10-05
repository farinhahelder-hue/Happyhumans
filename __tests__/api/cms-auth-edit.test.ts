// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { createHmac } from 'node:crypto'
import { NextRequest } from 'next/server'
import type { AddressInfo } from 'node:net'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createMockSupabase } = require('../../scripts/mock-supabase.cjs')
import { verifyEditSession } from '@/lib/cms-auth'
import { proxy } from '@/proxy'

/**
 * Sécurité de l'édition en ligne.
 *
 * Avant : le cookie `hh_cms_edit` valait simplement « 1 » et le serveur lui faisait confiance. N'importe quel
 * visiteur pouvait le fabriquer dans son navigateur et alors écrire du contenu EN LIGNE et lire toutes les données
 * du CMS. Désormais c'est un jeton signé (HMAC) avec expiration, vérifié côté serveur.
 */

const SECRET = 'secret-de-test-0123456789'
const b64url = (s: string) => Buffer.from(s, 'utf8').toString('base64url')
const sign = (payload: string, secret = SECRET) => createHmac('sha256', secret).update(payload).digest('hex')
const token = (claims: Record<string, unknown>, secret = SECRET) => {
  const p = b64url(JSON.stringify(claims))
  return `${p}.${sign(p, secret)}`
}
const now = () => Math.floor(Date.now() / 1000)
const validSession = () => token({ kind: 'edit-session', iat: now(), exp: now() + 3600 })

let mock: ReturnType<typeof createMockSupabase>
let content: typeof import('@/app/api/cms/content/route')
let publish: typeof import('@/app/api/cms/publish/route')
let publicContent: typeof import('@/app/api/cms/public-content/route')

beforeAll(async () => {
  mock = createMockSupabase()
  await new Promise<void>(res => mock.server.listen(0, '127.0.0.1', () => res()))
  process.env.NEXT_PUBLIC_SUPABASE_URL = `http://127.0.0.1:${(mock.server.address() as AddressInfo).port}`
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service'
  process.env.CMS_PASSWORD = 'mot-de-passe-de-test'
  process.env.CMS_HMAC_SECRET = SECRET
  content = await import('@/app/api/cms/content/route')
  publish = await import('@/app/api/cms/publish/route')
  publicContent = await import('@/app/api/cms/public-content/route')
})
afterAll(async () => { await new Promise(res => mock.server.close(res)) })
beforeEach(() => mock.reset())

const withCookie = (cookie: string | undefined, path: string, method = 'GET', body?: unknown) =>
  new NextRequest(`http://localhost${path}`, {
    method,
    headers: { 'content-type': 'application/json', ...(cookie ? { cookie } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
const PUT_BODY = { page: 'coaching', block_key: 'hero_title', value: 'PIRATÉ' }

describe('verifyEditSession', () => {
  it('accepte une session signée, valide et non expirée', () => {
    expect(verifyEditSession(validSession())).toBe(true)
  })
  it('refuse le cookie « 1 » (l’ancienne valeur fabricable par n’importe qui)', () => {
    expect(verifyEditSession('1')).toBe(false)
  })
  it('refuse l’absence de cookie et une valeur vide', () => {
    expect(verifyEditSession(undefined)).toBe(false)
    expect(verifyEditSession('')).toBe(false)
  })
  it('refuse une session dont la charge utile a été modifiée', () => {
    const [, sig] = validSession().split('.')
    const forged = b64url(JSON.stringify({ kind: 'edit-session', iat: now(), exp: now() + 999999 }))
    expect(verifyEditSession(`${forged}.${sig}`)).toBe(false)
  })
  it('refuse une signature faite avec un autre secret', () => {
    expect(verifyEditSession(token({ kind: 'edit-session', exp: now() + 3600 }, 'autre-secret'))).toBe(false)
  })
  it('refuse une session expirée', () => {
    expect(verifyEditSession(token({ kind: 'edit-session', iat: now() - 7300, exp: now() - 100 }))).toBe(false)
  })
  it('refuse un lien d’édition de 5 min (sans kind) utilisé comme session', () => {
    expect(verifyEditSession(token({ iat: now(), exp: now() + 300, jit: 'abc' }))).toBe(false)
  })
})

describe('les routes du CMS n’acceptent plus le cookie fabriqué', () => {
  it('PUT /api/cms/content avec « hh_cms_edit=1 » est refusé (401) et n’écrit rien', async () => {
    const res = await content.PUT(withCookie('hh_cms_edit=1', '/api/cms/content', 'PUT', PUT_BODY))
    expect(res.status).toBe(401)
    expect(mock.getDb().site_content).toHaveLength(0)
  })
  it('GET /api/cms/content avec « hh_cms_edit=1 » est refusé (401)', async () => {
    expect((await content.GET(withCookie('hh_cms_edit=1', '/api/cms/content'))).status).toBe(401)
  })
  it('POST /api/cms/publish avec « hh_cms_edit=1 » est refusé (401)', async () => {
    expect((await publish.POST(withCookie('hh_cms_edit=1', '/api/cms/publish', 'POST', { page: 'coaching' }))).status).toBe(401)
  })
  it('l’aperçu des brouillons n’est pas accessible avec « hh_cms_edit=1 »', async () => {
    mock.getDb().site_content.push({ id: 'd', page: 'draft:coaching', block_key: 'hero_title', value: 'SECRET BROUILLON' })
    const res = await publicContent.GET(withCookie('hh_cms_edit=1', '/api/cms/public-content?page=coaching&preview=1'))
    expect(JSON.stringify(await res.json())).not.toContain('SECRET BROUILLON')
  })
  it('une session signée valide est acceptée', async () => {
    const res = await content.PUT(withCookie(`hh_cms_edit=${validSession()}`, '/api/cms/content', 'PUT', PUT_BODY))
    expect(res.status).toBe(200)
  })
  it('un jeton falsifié ou expiré est refusé', async () => {
    const expired = token({ kind: 'edit-session', exp: now() - 10 })
    const [p] = validSession().split('.')
    expect((await content.PUT(withCookie(`hh_cms_edit=${expired}`, '/api/cms/content', 'PUT', PUT_BODY))).status).toBe(401)
    expect((await content.PUT(withCookie(`hh_cms_edit=${p}.deadbeef`, '/api/cms/content', 'PUT', PUT_BODY))).status).toBe(401)
  })
  it('le cookie d’affichage « hh_cms_ui » ne donne aucun accès', async () => {
    expect((await content.PUT(withCookie('hh_cms_ui=1', '/api/cms/content', 'PUT', PUT_BODY))).status).toBe(401)
  })
})

describe('proxy : du lien d’édition à la session signée', () => {
  it('un lien valide pose une session signée httpOnly + l’indicateur d’affichage, et la retire de l’URL', async () => {
    const link = token({ iat: now(), exp: now() + 300, jit: 'x' }) // ce que produit /api/cms/generate-edit-token
    const res = await proxy(new NextRequest(`http://localhost/coaching?cms_edit_token=${encodeURIComponent(link)}`))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('http://localhost/coaching')
    const session = res.cookies.get('hh_cms_edit')
    expect(session?.value).toBeTruthy()
    expect(session?.value).not.toBe('1')
    expect(session?.httpOnly).toBe(true)
    expect(verifyEditSession(session?.value)).toBe(true)
    const ui = res.cookies.get('hh_cms_ui')
    expect(ui?.value).toBe('1')
    expect(ui?.httpOnly).toBeFalsy()
  })
  it('un lien falsifié ne pose aucun cookie d’accès', async () => {
    const res = await proxy(new NextRequest(`http://localhost/coaching?cms_edit_token=${encodeURIComponent('xxxx.yyyy')}`))
    expect(res.cookies.get('hh_cms_edit')).toBeUndefined()
    expect(res.cookies.get('hh_cms_ui')).toBeUndefined()
  })
  it('un lien expiré ne pose aucun cookie d’accès', async () => {
    const link = token({ iat: now() - 400, exp: now() - 100 })
    const res = await proxy(new NextRequest(`http://localhost/coaching?cms_edit_token=${encodeURIComponent(link)}`))
    expect(res.cookies.get('hh_cms_edit')).toBeUndefined()
  })
  it('le cookie « 1 » ne déclenche plus l’en-tête x-cms-edit ; une session signée oui', async () => {
    const forged = await proxy(new NextRequest('http://localhost/coaching', { headers: { cookie: 'hh_cms_edit=1' } }))
    expect(forged.headers.get('x-cms-edit')).toBeNull()
    const real = await proxy(new NextRequest('http://localhost/coaching', { headers: { cookie: `hh_cms_edit=${validSession()}` } }))
    expect(real.headers.get('x-cms-edit')).toBe('1')
  })
})
