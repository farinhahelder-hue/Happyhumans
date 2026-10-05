// @vitest-environment node
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Garde-fou : toute route API doit être protégée (requireCmsAuth…) OU figurer ci-dessous avec sa raison.
 *
 * Avant ce garde-fou : /api/send-email (relais d'e-mails ouvert : envoi vers n'importe quelle adresse depuis
 * l'expéditeur du site), /api/instagram/post (publication sur le compte Instagram) et les routes de génération IA
 * (quota Groq) répondaient sans aucune authentification.
 */

const root = path.resolve(__dirname, '../..')

const PUBLIC_ROUTES: Record<string, string> = {
  '/api/booking': 'formulaire public de réservation (liste des créneaux + demande)',
  '/api/contact': 'formulaire de contact public',
  '/api/newsletter': 'inscription publique à la newsletter',
  '/api/brevo/subscribe': 'inscription publique à la newsletter (Brevo)',
  '/api/travel-planning': 'formulaire public historique',
  '/api/cms/auth': 'connexion à l’admin (c’est elle qui authentifie)',
  '/api/cms/public-articles': 'lecture publique des articles publiés',
  '/api/cms/public-settings': 'lecture publique des réglages d’affichage',
  '/api/cms/public-temoignages': 'lecture publique des témoignages',
  '/api/cms/public-content': 'lecture publique du contenu du CMS',
  '/api/keep-alive': 'cron Vercel qui garde la base active',
  '/api/cms-html': 'page HTML statique d’information',
}

function routeFiles(dir: string, out: string[] = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) routeFiles(p, out)
    else if (/^route\.(ts|js)$/.test(e.name)) out.push(p)
  }
  return out
}

describe('aucune route API ouverte sans décision explicite', () => {
  const base = path.join(root, 'app/api')
  const files = routeFiles(base)
  it.each(files.map(f => ['/api' + f.slice(base.length).replace(/\\/g, '/').replace(/\/route\.(ts|js)$/, ''), f]))('%s', (route, file) => {
    const src = fs.readFileSync(file, 'utf8')
    const guarded = /requireCmsAuth|getCmsAuthStatus|verifyEditSession|isValidCmsPassword/.test(src)
    expect(
      guarded || route in PUBLIC_ROUTES,
      `${route} n'est ni protégée (requireCmsAuth) ni déclarée publique. Protégez-la, ou ajoutez-la à PUBLIC_ROUTES avec la raison.`,
    ).toBe(true)
  })
})
