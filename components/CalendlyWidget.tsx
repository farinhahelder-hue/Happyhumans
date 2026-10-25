'use client'
import Script from 'next/script'
import { useSearchParams } from 'next/navigation'
import { useCalendly } from '@/hooks/useCalendly'
import { calendlyServiceFrom, calendlyWidgetUrl, type CalendlyService } from '@/lib/calendly-config'

/**
 * Agenda Calendly intégré. L'adresse du compte et les rendez-vous par service viennent du CMS
 * (⚙️ Paramètres → 📅 Réservation) ; les libellés affichés au-dessus viennent de la page « Réservation ».
 */
export default function CalendlyWidget({
  labels,
  loadingLabel = '',
}: {
  labels?: Partial<Record<CalendlyService, string>>
  /** Texte affiché le temps que les réglages arrivent (fourni par la page, donc modifiable dans le CMS). */
  loadingLabel?: string
}) {
  const params = useSearchParams()
  const service = calendlyServiceFrom(params.get('from'))
  const { ready, eventUrl, profileUrl } = useCalendly()

  // On attend les réglages du CMS : sinon l'agenda se lancerait sur le compte par défaut.
  if (!ready) {
    return (
      <div className="flex h-[700px] items-center justify-center text-sm text-stone-400">
        {loadingLabel}
      </div>
    )
  }

  const url = service ? eventUrl(service) : profileUrl
  const label = service ? (labels?.[service] ?? '') : ''

  return (
    <>
      {label && (
        <div className="flex justify-center mb-4">
          <span className="bg-[#eef5f3] text-[#2d5f54] text-xs font-semibold rounded-full px-3 py-1">
            {label}
          </span>
        </div>
      )}
      <div
        className="calendly-inline-widget rounded-2xl overflow-hidden"
        data-url={calendlyWidgetUrl(url)}
        style={{ minWidth: 320, height: 700 }}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
    </>
  )
}
