import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSignOutButton from "@/components/admin/AdminSignOutButton";

const NAV_ITEMS = [
  { href: "/admin", label: "Tableau de bord", icon: "📊" },
  { href: "/admin/content", label: "Contenu du site", icon: "🖋️" },
  { href: "/admin/appearance", label: "Apparence", icon: "🎨" },
  { href: "/admin/blog", label: "Articles", icon: "📝" },
  { href: "/admin/testimonials", label: "Témoignages", icon: "💬" },
  { href: "/admin/settings", label: "Paramètres", icon: "⚙️" },
  { href: "/admin/history", label: "Historique", icon: "🕘" },
  { href: "/admin/contacts", label: "Messages", icon: "✉️" },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-suspenders: middleware already redirects unauthenticated
  // requests before they reach this layout.
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <p className="font-bold text-lg">Happy Humans</p>
          <p className="text-xs text-gray-400">Administration</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <p className="text-xs text-gray-400 mb-3 truncate">{user.email}</p>
          <AdminSignOutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
