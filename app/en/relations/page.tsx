import { LocaleProvider } from '@/contexts/LocaleContext'
import SetHtmlLang from '@/components/SetHtmlLang'
import RelationsPage from '@/app/relations/page'

export default function EnRelationsPage() {
  return (
    <LocaleProvider locale="en">
      <SetHtmlLang locale="en" />
      <RelationsPage />
    </LocaleProvider>
  )
}
