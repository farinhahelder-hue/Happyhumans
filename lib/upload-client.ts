/**
 * Envoi d'images depuis l'admin du CMS.
 *
 * - Réduit les grosses photos AVANT l'envoi : un téléphone produit couramment 5 à 10 Mo, alors que
 *   Vercel refuse toute requête de plus de ~4,5 Mo (l'envoi échouait sans message).
 * - Traduit toutes les erreurs en phrases françaises compréhensibles (plus d'échec silencieux).
 */

/** Poids maximal envoyé au serveur (Vercel refuse les requêtes > 4,5 Mo). */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024
/** Côté le plus long d'une photo après réduction (suffisant pour un écran 4K en plein écran). */
export const MAX_DIMENSION = 2400
/** En dessous de ce poids, la photo est envoyée telle quelle. */
const KEEP_AS_IS_BYTES = 1.5 * 1024 * 1024

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']

/** Dimensions réduites pour tenir dans un carré de `max` px, sans jamais agrandir. */
export function fitWithin(width: number, height: number, max: number): { width: number; height: number } {
  const longest = Math.max(width, height)
  if (longest <= max) return { width, height }
  const ratio = max / longest
  return { width: Math.max(1, Math.round(width * ratio)), height: Math.max(1, Math.round(height * ratio)) }
}

/** Phrase à afficher à Monica selon la réponse du serveur. */
export function uploadErrorMessage(status: number, serverMessage?: string): string {
  if (status === 401 || status === 403) return 'Votre session a expiré : reconnectez-vous à l’administration puis réessayez.'
  if (status === 413) return 'Image trop lourde pour être envoyée (4 Mo maximum). Choisissez une image plus légère.'
  if (status === 400 && serverMessage && /type de fichier/i.test(serverMessage)) {
    return 'Format non pris en charge. Utilisez une image JPG, PNG, WebP, GIF ou SVG.'
  }
  if (status === 400 && serverMessage && /volumineux/i.test(serverMessage)) {
    return 'Image trop lourde (5 Mo maximum). Choisissez une image plus légère.'
  }
  if (status >= 500) {
    return `Le serveur n’a pas pu enregistrer l’image${serverMessage ? ` (${serverMessage})` : ''}. Réessayez dans un instant.`
  }
  return serverMessage ? `Envoi impossible : ${serverMessage}` : 'Envoi impossible. Réessayez avec une autre image.'
}

/**
 * Un canvas trop grand pour la mémoire du navigateur peut sortir entièrement noir sans erreur :
 * on vérifie quelques points avant d'accepter le résultat.
 */
function looksBlank(ctx: CanvasRenderingContext2D, width: number, height: number): boolean {
  try {
    for (let i = 1; i <= 5; i++) {
      for (let j = 1; j <= 5; j++) {
        const [r, g, b, a] = ctx.getImageData(Math.floor((width * i) / 6), Math.floor((height * j) / 6), 1, 1).data
        if (a !== 255 || r + g + b > 0) return false
      }
    }
    return true
  } catch {
    return false
  }
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise(resolve => canvas.toBlob(resolve, type, quality))
}

/**
 * Réduit une photo trop grande ou trop lourde (navigateur uniquement).
 * Les SVG et GIF animés sont laissés intacts ; la transparence des PNG est conservée (sortie WebP).
 */
export async function prepareImage(file: File): Promise<File> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error(
      /heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name)
        ? 'Les photos HEIC (iPhone) ne sont pas lues par le site : exportez-la en JPG, ou choisissez « Le plus compatible » dans les réglages de l’appareil photo.'
        : 'Format non pris en charge. Utilisez une image JPG, PNG, WebP, GIF ou SVG.',
    )
  }
  const passthrough = file.type === 'image/svg+xml' || file.type === 'image/gif'
  if (passthrough || typeof document === 'undefined' || typeof createImageBitmap === 'undefined') {
    if (file.size > MAX_UPLOAD_BYTES) throw new Error(uploadErrorMessage(413))
    return file
  }

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    throw new Error('Cette image ne peut pas être lue. Essayez de l’enregistrer à nouveau en JPG ou PNG.')
  }

  try {
    const small = bitmap.width <= MAX_DIMENSION && bitmap.height <= MAX_DIMENSION
    if (small && file.size <= KEEP_AS_IS_BYTES) return file

    const outType = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/webp'
    // Deux essais de plus en plus petits ; on s'arrête dès que le poids est acceptable.
    const attempts = [[MAX_DIMENSION, 0.86], [1800, 0.75], [1200, 0.7]] as const
    for (const [index, [max, quality]] of attempts.entries()) {
      const { width, height } = fitWithin(bitmap.width, bitmap.height, max)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) break
      ctx.drawImage(bitmap, 0, 0, width, height)
      // résultat noir (mémoire du navigateur) : on réessaie plus petit ; au dernier essai on l'accepte (photo réellement noire)
      if (index < attempts.length - 1 && looksBlank(ctx, width, height)) continue
      const blob = await toBlob(canvas, outType, quality)
      if (!blob) break
      if (blob.size <= MAX_UPLOAD_BYTES) {
        const ext = blob.type === 'image/jpeg' ? 'jpg' : blob.type === 'image/png' ? 'png' : 'webp'
        // Une photo déjà légère mais « grande » ne doit pas grossir en étant recompressée.
        if (small && blob.size >= file.size) return file
        return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.' + ext, { type: blob.type })
      }
    }
  } finally {
    bitmap.close()
  }
  // La réduction n'a pas abouti : l'original part tel quel s'il est assez léger, sinon on explique.
  if (file.size <= MAX_UPLOAD_BYTES) return file
  throw new Error(uploadErrorMessage(413))
}

/**
 * Envoie une image et renvoie son adresse publique.
 * Lève une Error dont le message est directement affichable à l'utilisatrice.
 */
export async function uploadImage(
  file: File,
  endpoint = '/api/cms/upload',
  fields: Record<string, string> = {},
): Promise<string> {
  const prepared = await prepareImage(file)
  const body = new FormData()
  body.append('file', prepared, prepared.name)
  for (const [name, value] of Object.entries(fields)) body.append(name, value)

  let res: Response
  try {
    res = await fetch(endpoint, { method: 'POST', body })
  } catch {
    throw new Error('Connexion impossible : vérifiez votre connexion internet puis réessayez.')
  }

  let data: { url?: string; error?: string; message?: string } | null = null
  try {
    data = await res.json()
  } catch {
    /* réponse non JSON (ex. refus de Vercel pour une requête trop grosse) */
  }
  if (!res.ok || !data?.url) throw new Error(uploadErrorMessage(res.status, data?.error || data?.message))
  return data.url
}
