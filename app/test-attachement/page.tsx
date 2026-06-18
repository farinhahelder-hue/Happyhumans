import type { Metadata } from 'next';
import { AttachmentTest } from '@/components/attachment-test/AttachmentTest';

export const metadata: Metadata = {
  title: "Test de style d'attachement | Happy Humans",
  description:
    "Découvrez votre style d'attachement en 16 questions. Un outil de développement personnel pour mieux comprendre vos relations.",
  openGraph: {
    title: "Quel est votre style d'attachement ?",
    description: 'Un test doux et moderne en 3–5 minutes. Résultats immédiats.',
  },
};

export default function TestAttachementPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-950 via-pink-900 to-purple-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <a
            href="/relations"
            className="inline-flex items-center gap-2 text-rose-300 hover:text-rose-200 text-sm mb-6 transition-colors"
          >
            ← Retour aux relations
          </a>
          <h1 className="sr-only">Test de style d'attachement — Happy Humans</h1>
        </div>
        <AttachmentTest />
      </div>
    </main>
  );
}
