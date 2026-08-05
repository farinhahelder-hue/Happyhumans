import { createClient } from "@/lib/supabase/server";
import { CONTENT_BLOCKS, storageKey, type ContentBlock } from "@/lib/contentBlocks";

type BlockValue<B extends ContentBlock> = B extends { kind: "fields" }
  ? Record<string, string>
  : Record<string, string>[];

/**
 * Fetches every content block for a given page from cms_settings_kv,
 * parsing each stored JSON value and falling back to that block's schema
 * default whenever nothing is saved yet or the stored value is malformed.
 * Returns a map keyed by block key (e.g. { hero: {...}, programs: [...] }).
 */
export async function getContentBlocks(
  page: ContentBlock["page"]
): Promise<Record<string, BlockValue<ContentBlock>>> {
  const blocks = CONTENT_BLOCKS.filter((b) => b.page === page);
  const keys = blocks.map(storageKey);

  const supabase = await createClient();
  const { data } = await supabase
    .from("cms_settings_kv")
    .select("key, value")
    .in("key", keys);

  const rawByKey = Object.fromEntries(
    (data || []).map(({ key, value }) => [key, value])
  );

  const result: Record<string, BlockValue<ContentBlock>> = {};

  for (const block of blocks) {
    const raw = rawByKey[storageKey(block)];
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
