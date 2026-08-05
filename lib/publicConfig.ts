import { createClient } from "@/lib/supabase/server";

export interface VisibilityToggles {
  "show-in-menu": boolean;
  "show-in-footer": boolean;
  "coaching-published": boolean;
  "entreprises-published": boolean;
  "blog-published": boolean;
  "contact-published": boolean;
}

export interface PublicConfig {
  visibilityToggles: VisibilityToggles;
  contactEmail: string | null;
}

const DEFAULT_TOGGLES: VisibilityToggles = {
  "show-in-menu": true,
  "show-in-footer": true,
  "coaching-published": true,
  "entreprises-published": true,
  "blog-published": true,
  "contact-published": true,
};

export async function getPublicConfig(): Promise<PublicConfig> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cms_settings_kv")
    .select("key, value")
    .in("key", [...Object.keys(DEFAULT_TOGGLES), "contact-email"]);

  const visibilityToggles = { ...DEFAULT_TOGGLES };
  let contactEmail: string | null = null;

  data?.forEach(({ key, value }) => {
    if (key === "contact-email") {
      contactEmail = value;
      return;
    }
    if (key in visibilityToggles) {
      visibilityToggles[key as keyof VisibilityToggles] = value === "true";
    }
  });

  return { visibilityToggles, contactEmail };
}
