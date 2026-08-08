"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminSignOutButton from "@/components/admin/AdminSignOutButton";

const NAV_ITEMS = [
  { href: "/admin", label: "Tableau de bord", icon: "📊" },
  { href: "/admin/content", label: "Contenu du site", icon: "🖋️" },
  { href: "/admin/appearance", label: "Apparence", icon: "🎨" },
  { href: "/admin/blog", label: "Articles", icon: "📝" },
  { href: "/admin/testimonials", label: "Témoignages", icon: "💬" },
  { href: "/admin/subscribers", label: "Abonnés", icon: "📣" },
  { href: "/admin/settings", label: "Paramètres", icon: "⚙️" },
  { href: "/admin/history", label: "Historique", icon: "🕘" },
  { href: "/admin/contacts", label: "Messages", icon: "✉️" },
];

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const panel = (
    <>
      <div className="p-6 border-b border-gray-800">
        <p className="font-bold text-lg">Happy Humans</p>
        <p className="text-xs text-gray-400">Administration</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              isActive(item.href)
                ? "bg-gray-800 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-400 mb-3 truncate">{userEmail}</p>
        <AdminSignOutButton />
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-gray-900 text-white px-4 py-3">
        <div>
          <p className="font-bold leading-tight">Happy Humans</p>
          <p className="text-[11px] text-gray-400 leading-tight">Administration</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          className="p-2 -mr-2 text-2xl leading-none"
        >
          ☰
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 bg-gray-900 text-white flex-col sticky top-0 h-screen">
        {panel}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative w-64 max-w-[80%] bg-gray-900 text-white flex flex-col h-full">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              className="absolute top-4 right-4 text-2xl leading-none text-gray-300 hover:text-white z-10"
            >
              ✕
            </button>
            {panel}
          </aside>
        </div>
      )}
    </>
  );
}
