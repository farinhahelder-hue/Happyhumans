import type { Metadata } from "next";
import BlogListContent from "@/components/marketing/BlogListContent";
import { hreflangAlternates } from "@/lib/i18n";

export function generateMetadata(): Metadata {
  return { alternates: hreflangAlternates("/blog", "en") };
}

export default function Page() {
  return <BlogListContent locale="en" />;
}
