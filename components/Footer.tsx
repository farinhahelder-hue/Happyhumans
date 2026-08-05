import Link from "next/link";
import { siteConfig } from "@/lib/integrations";
import type { VisibilityToggles } from "@/lib/publicConfig";

export default function Footer({
  initialConfig,
  initialContactEmail,
  content,
  brand,
}: {
  initialConfig: VisibilityToggles;
  initialContactEmail: string | null;
  content: Record<string, string>;
  brand: string;
}) {
  const isVisible = initialConfig["show-in-footer"] ?? false;
  const contactEmail = initialContactEmail || siteConfig.email;

  if (!isVisible) return null;

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-3 gap-8 mb-8">
          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-4">{content.servicesHeading}</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/coaching" className="hover:text-white">
                  {content.linkCoaching}
                </Link>
              </li>
              <li>
                <Link href="/entreprises" className="hover:text-white">
                  {content.linkEntreprises}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-lg mb-4">{content.resourcesHeading}</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/blog" className="hover:text-white">
                  {content.linkBlog}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">{content.contactHeading}</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/contact" className="hover:text-white">
                  {content.linkContact}
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
          <p>&copy; {new Date().getFullYear()} {brand}. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
