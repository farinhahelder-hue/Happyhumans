import type { Metadata } from "next";
import CoachingContent from "@/components/marketing/CoachingContent";
import { hreflangAlternates } from "@/lib/i18n";

export function generateMetadata(): Metadata {
  return { alternates: hreflangAlternates("/coaching", "en") };
}

export default function Page() {
  return <CoachingContent locale="en" />;
}
