import { createClient } from "@/lib/supabase/server";

interface OrderableSection {
  id: string;
  [key: string]: unknown;
}

/**
 * Applies the admin-saved section order (cms_settings_kv key
 * `page-sections-order-<pageId>`) to a page's default sections.
 * Falls back to the default order if nothing was saved yet, or if the
 * saved order references unknown ids (e.g. after a code change).
 */
export async function applySavedOrder<T extends OrderableSection>(
  pageId: string,
  defaultSections: T[]
): Promise<T[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cms_settings_kv")
    .select("value")
    .eq("key", `page-sections-order-${pageId}`)
    .maybeSingle();

  if (!data?.value) return defaultSections;

  try {
    const savedOrder: string[] = JSON.parse(data.value);
    const byId = new Map(defaultSections.map((s) => [s.id, s]));

    const known = savedOrder.filter((id) => byId.has(id));
    if (known.length !== defaultSections.length) return defaultSections;

    return known.map((id) => byId.get(id)!);
  } catch {
    return defaultSections;
  }
}
