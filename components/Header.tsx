"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { events } from "@/lib/analytics";
import type { VisibilityToggles } from "@/lib/publicConfig";
import {
  LOCALES,
  localeFromPath,
  localizedHref,
  stripLocale,
  type Locale,
} from "@/lib/i18n";

const NAV_LINKS = [
  { href: "/coaching", labelKey: "navCoaching", key: "coaching-published" },
  { href: "/entreprises", labelKey: "navEntreprises", key: "entreprises-published" },
  { href: "/blog", labelKey: "navBlog", key: "blog-published" },
  { href: "/contact", labelKey: "navContact", key: "contact-published" },
] as const;

export default function Header({
  initialConfig,
  content,
  logo,
}: {
  initialConfig: VisibilityToggles;
  content: Record<string, string>;
  logo?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const config = initialConfig;

  // Blog is not localised yet, so its link always stays on the French route.
  const navHref = (href: string) =>
    href === "/blog" ? "/blog" : localizedHref(href, locale);

  const visibleLinks = NAV_LINKS.filter((link) => config[link.key] !== false).map(
    (link) => ({ href: navHref(link.href), label: content[link.labelKey] })
  );
  const showNav = config["show-in-menu"] && visibleLinks.length > 0;
  const showCta = config["contact-published"] !== false;
  const ctaHref = `${localizedHref("/contact", locale)}#discovery`;

  // Language switch: same page in the other locale. Blog has no EN route, so
  // switching to English from a blog page lands on the EN home instead.
  const stripped = stripLocale(pathname);
  const isBlog = stripped === "/blog" || stripped.startsWith("/blog/");
  const switchHref = (loc: Locale) =>
    loc === "fr" ? stripped : isBlog ? "/en" : localizedHref(stripped, loc);

  const handleDiscoveryClick = () => {
    events.clickDiscoveryCTA();
    setMenuOpen(false);
  };

  const LangSwitch = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center gap-1 text-sm ${className}`}>
      {LOCALES.map((loc) => (
        <Link
          key={loc}
          href={switchHref(loc)}
          onClick={() => setMenuOpen(false)}
          aria-current={locale === loc ? "true" : undefined}
          className={`px-2 py-1 rounded transition ${
            locale === loc
              ? "font-bold text-brand"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {loc.toUpperCase()}
        </Link>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href={localizedHref("/", locale)}
          className="text-2xl font-bold text-brand flex items-center"
          onClick={() => setMenuOpen(false)}
        >
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={content.brand} className="h-9 w-auto" />
          ) : (
            content.brand
          )}
        </Link>

        <div className="flex items-center gap-6">
          {showNav && (
            <ul className="hidden md:flex gap-8">
              {visibleLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-brand transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <LangSwitch className="hidden md:flex" />

          {showCta && (
            <Link
              href={ctaHref}
              onClick={handleDiscoveryClick}
              className="hidden md:inline-block px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition"
            >
              {content.ctaLabel}
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            className="md:hidden p-2 -mr-2 text-gray-700 text-2xl leading-none"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t bg-white px-6 py-4 space-y-4">
          {showNav && (
            <ul className="space-y-3">
              {visibleLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block text-lg py-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {showCta && (
            <Link
              href={ctaHref}
              onClick={handleDiscoveryClick}
              className="block text-center px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-dark transition"
            >
              {content.ctaLabel}
            </Link>
          )}
          <LangSwitch className="justify-center border-t pt-4" />
        </div>
      )}
    </header>
  );
}
