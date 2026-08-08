import type { Metadata } from "next";
import HomeContent from "@/components/marketing/HomeContent";
import { hreflangAlternates } from "@/lib/i18n";

export function generateMetadata(): Metadata {
  return { alternates: hreflangAlternates("/", "en") };
}

export default function Page() {
  return <HomeContent locale="en" />;
}
