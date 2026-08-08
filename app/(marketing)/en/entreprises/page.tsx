import type { Metadata } from "next";
import EntreprisesContent from "@/components/marketing/EntreprisesContent";
import { hreflangAlternates } from "@/lib/i18n";

export function generateMetadata(): Metadata {
  return { alternates: hreflangAlternates("/entreprises", "en") };
}

export default function Page() {
  return <EntreprisesContent locale="en" />;
}
