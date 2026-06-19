'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/components/AuthProvider';
import { trackEvent } from '@/lib/analytics';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/auth/login?next=/dashboard');
      return;
    }

    trackEvent('view_dashboard', { source: 'espace_client' });
  }, [loading, user, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f7f2e9] via-white to-[#eef5f3]">
      <Header />

      <section className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-12">
            <div>
              <p className="text-xs tracking-[0.16em] uppercase text-[#8d5d2f] mb-2">Espace client</p>
              <h1 className="text-3xl md:text-4xl font-serif text-stone-900">Bienvenue{user?.email ? `, ${user.email.split('@')[0]}` : ''}</h1>
              <p className="text-stone-600 mt-2">
                Ton espace pour suivre ton accompagnement et accéder à tes ressources.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="self-start sm:self-auto px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 hover:border-[#2f6b61] hover:text-[#2f6b61] transition"
            >
              Déconnexion
            </button>
          </div>

          {/* Ressources */}
          <div className="mb-10">
            <h2 className="text-xl font-serif text-stone-900 mb-6">Tes ressources</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-stone-200 p-6">
                <div className="w-10 h-10 rounded-full bg-[#2f6b61]/10 flex items-center justify-center mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2f6b61" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-stone-900 mb-2">Test d&apos;attachement</h3>
                <p className="text-sm text-stone-600 mb-4">
                  Découvre ton style d&apos;attachement et reçois 3 actions personnalisées.
                </p>
                <Link
                  href="/test-attachement"
                  className="inline-flex items-center text-sm font-medium text-[#2f6b61] hover:underline"
                >
                  Faire le test →
                </Link>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-6">
                <div className="w-10 h-10 rounded-full bg-[#8d5d2f]/10 flex items-center justify-center mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8d5d2f" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-stone-900 mb-2">Ressources Relations</h3>
                <p className="text-sm text-stone-600 mb-4">
                  Articles et outils pour des relations plus épanouissantes.
                </p>
                <Link
                  href="/relations"
                  className="inline-flex items-center text-sm font-medium text-[#8d5d2f] hover:underline"
                >
                  Explorer →
                </Link>
              </div>
            </div>
          </div>

          {/* Prochaines étapes */}
          <div className="bg-white rounded-2xl border border-stone-200 p-8">
            <h2 className="text-xl font-serif text-stone-900 mb-4">Continuer ton parcours</h2>
            <p className="text-stone-600 mb-6">
              Tu as des questions ou tu souhaites planifier ta prochaine session ? Monica est là pour t&apos;accompagner.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 rounded-full bg-[#2f6b61] text-white font-medium hover:bg-[#275a52] transition"
              >
                Contacter Monica
              </Link>
              <Link
                href="/coaching"
                className="inline-flex items-center px-6 py-3 rounded-full border border-stone-300 text-stone-700 font-medium hover:border-[#2f6b61] hover:text-[#2f6b61] transition"
              >
                Découvrir le coaching
              </Link>
            </div>
          </div>

          {/* Contact rapide */}
          <div className="mt-8 text-center">
            <p className="text-sm text-stone-500">
              Des questions sur ton accompagnement ?{' '}
              <a href="mailto:contactus@happy-humans.org" className="text-[#2f6b61] hover:underline">
                contactus@happy-humans.org
              </a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
