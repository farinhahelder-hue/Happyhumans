import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Administration - Happy Humans",
  robots: "noindex, nofollow",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#111827" />
      </head>
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  );
}
