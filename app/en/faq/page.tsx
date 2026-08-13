import { LocaleProvider } from '@/contexts/LocaleContext'
import SetHtmlLang from '@/components/SetHtmlLang'
import FaqPage from '@/app/faq/page'

export default function EnFaqPage() {
  return (
    <LocaleProvider locale="en">
      <SetHtmlLang locale="en" />
      <FaqPage />
    </LocaleProvider>
  )
}
