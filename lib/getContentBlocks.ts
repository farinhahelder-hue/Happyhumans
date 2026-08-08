import { createClient } from "@/lib/supabase/server";
import { CONTENT_BLOCKS, storageKey, type ContentBlock } from "@/lib/contentBlocks";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

type BlockValue<B extends ContentBlock> = B extends { kind: "fields" }
  ? Record<string, string>
  : Record<string, string>[];

/**
 * Fetches every content block for a given page and locale from cms_settings_kv.
 * For a non-default locale, a saved translation wins; otherwise it falls back
 * to the French value, then to the block's schema default (so an untranslated
 * EN page still renders in French rather than breaking). Returns a map keyed
 * by block key (e.g. { hero: {...}, programs: [...] }).
 */
export async function getContentBlocks(
  page: ContentBlock["page"],
  locale: Locale = DEFAULT_LOCALE
): Promise<Record<string, BlockValue<ContentBlock>>> {
  const blocks = CONTENT_BLOCKS.filter((b) => b.page === page);

  const frKeys = blocks.map((b) => storageKey(b, DEFAULT_LOCALE));
  const localeKeys =
    locale === DEFAULT_LOCALE ? [] : blocks.map((b) => storageKey(b, locale));

  const supabase = await createClient();
  const { data } = await supabase
    .from("cms_settings_kv")
    .select("key, value")
    .in("key", [...frKeys, ...localeKeys]);

  const rawByKey = Object.fromEntries(
    (data || []).map(({ key, value }) => [key, value])
  );

  const result: Record<string, BlockValue<ContentBlock>> = {};

  for (const block of blocks) {
    const localised =
      locale === DEFAULT_LOCALE ? undefined : rawByKey[storageKey(block, locale)];
    const raw = localised ?? rawByKey[storageKey(block, DEFAULT_LOCALE)];
    if (raw) {
      try {
        result[block.key] = JSON.parse(raw);
        continue;
      } catch {
        // fall through to defaults on malformed JSON
      }
    }
    result[block.key] = block.defaults;
  }

  return result;
}
