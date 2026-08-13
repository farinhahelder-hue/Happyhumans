import { LocaleProvider } from '@/contexts/LocaleContext'
import SetHtmlLang from '@/components/SetHtmlLang'
import SparringPartnerPage from '@/app/sparring-partner/page'

export default function EnSparringPartnerPage() {
  return (
    <LocaleProvider locale="en">
      <SetHtmlLang locale="en" />
      <SparringPartnerPage />
    </LocaleProvider>
  )
}
