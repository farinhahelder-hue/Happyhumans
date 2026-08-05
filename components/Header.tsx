"use client";

import { useState } from "react";
import Link from "next/link";
import { events } from "@/lib/analytics";
import type { VisibilityToggles } from "@/lib/publicConfig";

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
  const config = initialConfig;
  const visibleLinks = NAV_LINKS.filter((link) => config[link.key] !== false).map(
    (link) => ({ href: link.href, label: content[link.labelKey] })
  );
  const showNav = config["show-in-menu"] && visibleLinks.length > 0;
  const showCta = config["contact-published"] !== false;

  const handleDiscoveryClick = () => {
    events.clickDiscoveryCTA();
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
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

        {showCta && (
          <Link
            href="/contact#discovery"
            onClick={handleDiscoveryClick}
            className="hidden md:inline-block px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition"
          >
            {content.ctaLabel}
          </Link>
        )}

        {(showNav || showCta) && (
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            className="md:hidden p-2 -mr-2 text-gray-700 text-2xl leading-none"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        )}
      </nav>

      {menuOpen && (showNav || showCta) && (
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
              href="/contact#discovery"
              onClick={handleDiscoveryClick}
              className="block text-center px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-dark transition"
            >
              {content.ctaLabel}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
