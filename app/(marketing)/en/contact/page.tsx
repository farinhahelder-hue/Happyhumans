import type { Metadata } from "next";
import ContactContent from "@/components/marketing/ContactContent";
import { hreflangAlternates } from "@/lib/i18n";

export function generateMetadata(): Metadata {
  return { alternates: hreflangAlternates("/contact", "en") };
}

export default function Page() {
  return <ContactContent locale="en" />;
}
