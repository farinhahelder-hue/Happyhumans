import type { Metadata } from 'next'
import { LocaleProvider } from '@/contexts/LocaleContext'
import SetHtmlLang from '@/components/SetHtmlLang'
import HomePage from '@/app/page'
import { hreflangAlternates } from '@/lib/i18n'

export const metadata: Metadata = {
  alternates: hreflangAlternates('/', 'en'),
}

// English home. Reuses the French home component in the English locale
// (content falls back to French for any untranslated field).
export default function EnHomePage() {
  return (
    <LocaleProvider locale="en">
      <SetHtmlLang locale="en" />
      <HomePage />
    </LocaleProvider>
  )
}
