import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSiteStats, plausibleDashboardUrl } from "@/lib/plausible-stats";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m} min ${s}s` : `${s}s`;
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: publishedCount },
    { count: draftCount },
    { count: newContactsCount },
    { data: recentHistory },
    siteStats,
  ] = await Promise.all([
    supabase
      .from("cms_blog_posts")
      .select("*", { count: "exact", head: true })
      .eq("published", true),
    supabase
      .from("cms_blog_posts")
      .select("*", { count: "exact", head: true })
      .eq("published", false),
    supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("site_content_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
    getSiteStats(),
  ]);

  const traffic = siteStats
    ? [
        { label: "Visiteurs", value: siteStats.visitors.toLocaleString("fr-FR") },
        { label: "Pages vues", value: siteStats.pageviews.toLocaleString("fr-FR") },
        { label: "Taux de rebond", value: `${siteStats.bounceRate}%` },
        { label: "Durée moyenne", value: formatDuration(siteStats.visitDuration) },
      ]
    : [];

  const stats = [
    {
      label: "Articles publiés",
      value: publishedCount ?? 0,
      href: "/admin/blog",
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Brouillons",
      value: draftCount ?? 0,
      href: "/admin/blog",
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      label: "Nouveaux messages",
      value: newContactsCount ?? 0,
      href: "/admin/contacts",
      color: "bg-green-50 text-green-700",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Tableau de bord</h1>
      <p className="text-gray-600 mb-8">Vue d'ensemble du site Happy Humans</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`p-6 rounded-lg hover:shadow-md transition ${stat.color}`}
          >
            <p className="text-4xl font-bold mb-1">{stat.value}</p>
            <p className="font-medium">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Traffic (Plausible) */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Fréquentation (30 derniers jours)</h2>
          {siteStats && (
            <a
              href={plausibleDashboardUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Statistiques détaillées ↗
            </a>
          )}
        </div>

        {siteStats ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {traffic.map((t) => (
                <div key={t.label} className="p-6 bg-white border rounded-lg">
                  <p className="text-3xl font-bold mb-1">{t.value}</p>
                  <p className="text-sm text-gray-600">{t.label}</p>
                </div>
              ))}
            </div>

            {siteStats.topPages.length > 0 && (
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Pages les plus vues</h3>
                <ul className="space-y-2">
                  {siteStats.topPages.map((p) => (
                    <li
                      key={p.page}
                      className="flex justify-between text-sm border-b last:border-0 pb-2 last:pb-0"
                    >
                      <span className="font-mono text-gray-700 truncate">{p.page}</span>
                      <span className="text-gray-500 shrink-0 ml-4">
                        {p.visitors.toLocaleString("fr-FR")} visiteurs
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="p-6 bg-white border rounded-lg text-sm text-gray-600">
            Les statistiques de fréquentation s&apos;afficheront ici une fois
            Plausible connecté (variable <code>PLAUSIBLE_API_KEY</code>). En
            attendant, elles restent consultables sur{" "}
            <a
              href={plausibleDashboardUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              le tableau de bord Plausible ↗
            </a>
            .
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Actions rapides</h2>
          <div className="space-y-3">
            <Link
              href="/admin/blog/new"
              className="block p-4 bg-white border rounded-lg hover:shadow-md transition"
            >
              <p className="font-semibold">✍️ Nouvel article</p>
              <p className="text-sm text-gray-600">Rédiger un brouillon</p>
            </Link>
            <Link
              href="/admin/settings"
              className="block p-4 bg-white border rounded-lg hover:shadow-md transition"
            >
              <p className="font-semibold">⚙️ Paramètres du site</p>
              <p className="text-sm text-gray-600">
                Visibilité, adresse, zone de service
              </p>
            </Link>
            <Link
              href="/admin/history"
              className="block p-4 bg-white border rounded-lg hover:shadow-md transition"
            >
              <p className="font-semibold">🕘 Historique</p>
              <p className="text-sm text-gray-600">Restaurer une modification</p>
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Activité récente</h2>
          {recentHistory && recentHistory.length > 0 ? (
            <div className="space-y-3">
              {recentHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 bg-white border rounded-lg text-sm"
                >
                  <p className="font-medium">
                    {entry.action === "create" && "➕ Création"}
                    {entry.action === "update" && "✏️ Modification"}
                    {entry.action === "delete" && "🗑️ Suppression"}
                    {entry.action === "restore" && "↩️ Restauration"}
                    {" · "}
                    <span className="text-gray-600">{entry.content_type}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(entry.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
              <Link
                href="/admin/history"
                className="block text-center text-sm text-blue-600 hover:underline py-2"
              >
                Voir tout l'historique →
              </Link>
            </div>
          ) : (
            <p className="text-gray-600 text-sm">Aucune activité récente</p>
          )}
        </div>
      </div>
    </div>
  );
}
