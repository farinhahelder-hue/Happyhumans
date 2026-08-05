// External integrations configuration

const calendlyUrl =
  process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/monica-schneider/30min";

export const calendly = {
  // Calendly URL - update this with your actual Calendly link
  // Format: https://calendly.com/username/event-name
  url: calendlyUrl,

  // Embed URL with parameters
  getEmbedUrl: (username?: string, event?: string) => {
    const url = username && event
      ? `https://calendly.com/${username}/${event}`
      : calendlyUrl;

    return `${url}?hide_event_type_details=1&hide_gdpr_banner=1`;
  },
};

export const plausible = {
  domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "happyhumans.fr",
  isEnabled: !!process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
};

export const supabase = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  serviceKey: process.env.SUPABASE_SERVICE_KEY || "",
};

export const siteConfig = {
  name: "Happy Humans",
  description: "Coaching exécutif & Happiness Design avec Monica Schneider",
  url: "https://happyhumans.fr",
  email: "contact@happyhumans.fr",
  phone: "+33 6 12 34 56 78",
  location: "Paris, France",
};
