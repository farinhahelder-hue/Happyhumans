import { LocaleProvider } from '@/contexts/LocaleContext'
import SetHtmlLang from '@/components/SetHtmlLang'
import ContactPage from '@/app/contact/page'

export default function EnContactPage() {
  return (
    <LocaleProvider locale="en">
      <SetHtmlLang locale="en" />
      <ContactPage />
    </LocaleProvider>
  )
}
