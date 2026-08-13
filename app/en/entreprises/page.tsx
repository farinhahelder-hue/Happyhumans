import { LocaleProvider } from '@/contexts/LocaleContext'
import SetHtmlLang from '@/components/SetHtmlLang'
import EntreprisesPage from '@/app/entreprises/page'

// English route: reuses the French page component, loaded in the English locale
// (content falls back to French for any untranslated field).
export default function EnEntreprisesPage() {
  return (
    <LocaleProvider locale="en">
      <SetHtmlLang locale="en" />
      <EntreprisesPage />
    </LocaleProvider>
  )
}
