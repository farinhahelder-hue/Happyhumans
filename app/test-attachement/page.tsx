import type { Metadata } from 'next';
import Header from '@/components/Header';
import { AttachmentTest } from '@/components/attachment-test/AttachmentTest';
import { pageMetadata } from '@/lib/page-seo';
import { getPageContent } from '@/lib/cms-content-server';
import { TEST_ATTACHEMENT_DEFAULTS } from '@/lib/cms-defaults/test-attachement';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('test-attachement', TEST_ATTACHEMENT_DEFAULTS);
}

export default async function TestAttachementPage() {
  // textes de la page : CMS → « Test d'attachement »
  const c = await getPageContent('test-attachement', TEST_ATTACHEMENT_DEFAULTS);
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-rose-950 via-pink-900 to-purple-950 pt-[72px] px-4 pb-12">
        <div className="max-w-2xl mx-auto pt-8">
          <div className="text-center mb-10">
            <a
              href="/relations"
              className="inline-flex items-center gap-2 text-rose-300 hover:text-rose-200 text-sm mb-6 transition-colors"
            >
              {c.back_link}
            </a>
            <h1 className="sr-only">{c.page_title_sr}</h1>
          </div>
          <AttachmentTest />
        </div>
      </main>
    </>
  );
}
