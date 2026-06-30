'use client'
import Script from 'next/script'
import { useSearchParams } from 'next/navigation'

const EVENT_TYPES: Record<string, string> = {
  'happiness-design': 'seance-decouverte-happiness-design',
  'coaching':         'seance-decouverte-coaching',
  'sparring-partner': 'seance-decouverte-sparring',
  'entreprises':      'seance-decouverte-entreprises',
  'relations':        'seance-decouverte-relations',
}

export const SERVICE_LABELS: Record<string, string> = {
  'happiness-design': 'Programme Happiness Design',
  'coaching':         'Coaching individuel',
  'sparring-partner': 'Sparring Partner',
  'entreprises':      'Coaching entreprises',
  'relations':        'Coaching Relations',
}

export default function CalendlyWidget() {
  const params = useSearchParams()
  const from = params.get('from') ?? ''
  const eventSlug = EVENT_TYPES[from] ?? ''
  const label = SERVICE_LABELS[from] ?? ''

  const baseUrl = eventSlug
    ? `https://calendly.com/happyhumans-coaching/${eventSlug}`
    : 'https://calendly.com/happyhumans-coaching'

  const calendlyUrl = `${baseUrl}?hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=2d5f54`

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
        data-url={calendlyUrl}
        style={{ minWidth: 320, height: 700 }}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
    </>
  )
}
