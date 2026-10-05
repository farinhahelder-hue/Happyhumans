// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest'
import { createHmac } from 'node:crypto'
import { verifyEditSession } from '../../lib/cms-auth'

/**
 * Sécurité de l'édition en ligne.
 *
 * Avant : le cookie `hh_cms_edit` valait simplement « 1 » et le serveur lui faisait confiance. N'importe quel
 * visiteur pouvait le fabriquer dans son navigateur et alors écrire du contenu EN LIGNE et lire toutes les données
 * du CMS (réservations, messages de contact, réglages…). Désormais c'est un jeton signé (HMAC) avec expiration.
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

beforeAll(() => { process.env.CMS_HMAC_SECRET = SECRET })

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
