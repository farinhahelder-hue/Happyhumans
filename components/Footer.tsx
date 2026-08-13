"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { VisibilityToggles } from "@/lib/publicConfig";
import { localeFromPath, localizedHref, type Locale } from "@/lib/i18n";

const FALLBACK_EMAIL = "contact@happyhumans.fr";

export default function Footer({
  initialConfig,
  initialContactEmail,
  content,
  brand,
}: {
  initialConfig: VisibilityToggles;
  initialContactEmail: string | null;
  content: Record<Locale, Record<string, string>>;
  brand: Record<Locale, string>;
}) {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const c = content[locale];

  const isVisible = initialConfig["show-in-footer"] ?? false;
  const contactEmail = initialContactEmail || FALLBACK_EMAIL;

  if (!isVisible) return null;

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-4">{c.servicesHeading}</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link
                  href={localizedHref("/coaching", locale)}
                  className="hover:text-white"
                >
                  {c.linkCoaching}
                </Link>
              </li>
              <li>
                <Link
                  href={localizedHref("/entreprises", locale)}
                  className="hover:text-white"
                >
                  {c.linkEntreprises}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-lg mb-4">{c.resourcesHeading}</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link
                  href={localizedHref("/blog", locale)}
                  className="hover:text-white"
                >
                  {c.linkBlog}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">{c.contactHeading}</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link
                  href={localizedHref("/contact", locale)}
                  className="hover:text-white"
                >
                  {c.linkContact}
                </Link>
              </li>
              <li>
                <a href={`mailto:${contactEmail}`} className="hover:text-white">
                  {contactEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} {brand[locale]}.{" "}
            {locale === "en" ? "All rights reserved." : "Tous droits réservés."}
          </p>
        </div>
      </div>
    </footer>
  );
}
