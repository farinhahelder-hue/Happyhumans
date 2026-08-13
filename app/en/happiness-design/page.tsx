import { LocaleProvider } from '@/contexts/LocaleContext'
import SetHtmlLang from '@/components/SetHtmlLang'
import HappinessDesignPage from '@/app/happiness-design/page'

export default function EnHappinessDesignPage() {
  return (
    <LocaleProvider locale="en">
      <SetHtmlLang locale="en" />
      <HappinessDesignPage />
    </LocaleProvider>
  )
}
