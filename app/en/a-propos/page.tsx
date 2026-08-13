import { LocaleProvider } from '@/contexts/LocaleContext'
import SetHtmlLang from '@/components/SetHtmlLang'
import AProposPage from '@/app/a-propos/page'

export default function EnAProposPage() {
  return (
    <LocaleProvider locale="en">
      <SetHtmlLang locale="en" />
      <AProposPage />
    </LocaleProvider>
  )
}
