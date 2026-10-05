import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Affiche un texte du CMS avec un mini-format, pour que Monica puisse garder du gras,
 * de l'italique et des liens dans un paragraphe sans toucher au code :
 *   **gras**   *italique*   [texte du lien](https://… | mailto:… | /page)   et un retour à la ligne = saut de ligne
 *
 * Volontairement limité (pas de HTML) : le contenu venant de la base n'est jamais interprété comme du code.
 */
const TOKEN = /(\*\*[^*]+\*\*|\*[^*\n]+\*|\[[^\]\n]+\]\([^)\s]+\))/g

function isInternal(href: string) {
  return href.startsWith('/') && !href.startsWith('//')
}

export default function Rich({ text, linkClassName }: { text: string; linkClassName?: string }) {
  const out: ReactNode[] = []
  let i = 0
  text.split(TOKEN).forEach(part => {
    if (!part) return
    let m: RegExpMatchArray | null
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      out.push(<strong key={i++}>{part.slice(2, -2)}</strong>)
    } else if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      out.push(<em key={i++}>{part.slice(1, -1)}</em>)
    } else if ((m = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/))) {
      const [, label, href] = m
      // seuls http(s), mailto, tel et liens internes sont acceptés (jamais javascript:)
      if (/^(https?:|mailto:|tel:)/i.test(href) || isInternal(href)) {
        out.push(
          isInternal(href)
            ? <Link key={i++} href={href} className={linkClassName}>{label}</Link>
            : <a key={i++} href={href} className={linkClassName}>{label}</a>
        )
      } else {
        out.push(part)
      }
    } else {
      part.split('\n').forEach((line, j) => {
        if (j > 0) out.push(<br key={i++} />)
        if (line) out.push(line)
      })
    }
  })
  return <>{out}</>
}
