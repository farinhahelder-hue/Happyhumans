import Link from 'next/link';
import { parseBlocks, type CustomBlock } from '@/lib/custom-sections';

/**
 * Blocs personnalisés ajoutés depuis le CMS (admin → page → « Blocs personnalisés »,
 * positionnés librement dans « Structure »).
 * Rendu sobre, cohérent avec le site ; les images peuvent venir de la médiathèque.
 */
export function CustomBlockView({ b }: { b: CustomBlock }) {
  switch (b.type) {
    case 'split': {
      const imageRight = b.layout !== 'image-left';
      const text = (
        <div className={imageRight ? '' : 'md:order-2'}>
          {b.badge && <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">{b.badge}</p>}
          {b.title && <h2 className="mb-4 text-2xl font-serif font-light text-stone-900 md:text-3xl">{b.title}</h2>}
          {b.text && <p className="whitespace-pre-line text-base leading-relaxed text-stone-600">{b.text}</p>}
          {b.ctaLabel && b.ctaHref && (
            <Link href={b.ctaHref} className="mt-6 inline-block rounded-full bg-[#2d5f54] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a34]">
              {b.ctaLabel}
            </Link>
          )}
        </div>
      );
      const image = b.image ? (
        <div className={imageRight ? '' : 'md:order-1'}>
          <img src={b.image} alt={b.imageAlt || b.title || ''} loading="lazy" className="h-auto w-full rounded-2xl object-cover shadow-sm" />
        </div>
      ) : null;
      return (
        <section className="bg-white">
          <div className="mx-auto grid max-w-5xl items-center gap-8 px-6 py-14 md:grid-cols-2 md:px-10 md:py-20">
            {text}
            {image}
          </div>
        </section>
      );
    }
    case 'texte':
      return (
        <section className="bg-white px-6 py-14 md:px-10 md:py-20">
          <div className={`mx-auto max-w-3xl ${b.align === 'center' ? 'text-center' : ''}`}>
            {b.badge && <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">{b.badge}</p>}
            {b.title && <h2 className="mb-4 text-2xl font-serif font-light text-stone-900 md:text-3xl">{b.title}</h2>}
            <p className="whitespace-pre-line text-base leading-relaxed text-stone-600">{b.text}</p>
          </div>
        </section>
      );
    case 'image':
      return (
        <section className="bg-white px-6 py-10 md:px-10">
          <div className="mx-auto max-w-5xl">
            {b.image && <img src={b.image} alt={b.alt || ''} loading="lazy" className="h-auto w-full rounded-2xl object-cover shadow-sm" />}
            {b.caption && <p className="mt-3 text-center text-sm text-stone-500">{b.caption}</p>}
          </div>
        </section>
      );
    case 'cta':
      return (
        <section className="bg-[#2d5f54] px-6 py-14 text-center md:py-20">
          <div className="mx-auto max-w-xl">
            <h2 className="mb-3 text-2xl font-serif font-light text-white">{b.title}</h2>
            {b.text && <p className="mb-7 whitespace-pre-line text-sm leading-relaxed text-emerald-100">{b.text}</p>}
            <Link href={b.href} className="inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#2d5f54] transition hover:bg-amber-50">
              {b.button}
            </Link>
          </div>
        </section>
      );
    case 'citation':
      return (
        <section className="bg-[#f5f0e8] px-6 py-14 text-center md:px-10 md:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="font-serif text-xl font-light italic leading-relaxed text-stone-800 md:text-2xl">« {b.quote} »</p>
            {b.author && <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">— {b.author}</p>}
          </div>
        </section>
      );
  }
}

export default function CustomSections({ blocksJson }: { blocksJson?: string | null }) {
  const blocks = parseBlocks(blocksJson);
  if (blocks.length === 0) return null;
  return (
    <>
      {blocks.map((b) => (
        <CustomBlockView key={b.id} b={b} />
      ))}
    </>
  );
}
