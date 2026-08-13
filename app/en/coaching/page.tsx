import { LocaleProvider } from '@/contexts/LocaleContext'
import SetHtmlLang from '@/components/SetHtmlLang'
import CoachingPageBody from '@/components/pages/CoachingPageBody'

// English route: same page body, loaded in English (content falls back to
// French for any untranslated field). Pilot for the /en/* pattern.
export default function EnCoachingPage() {
  return (
    <LocaleProvider locale="en">
      <SetHtmlLang locale="en" />
      <CoachingPageBody />
    </LocaleProvider>
  )
}
