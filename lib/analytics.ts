// Plausible event tracking utility
export const trackEvent = (eventName: string, props?: Record<string, any>) => {
  if (typeof window === "undefined" || !window.plausible) {
    return;
  }

  window.plausible(eventName, { props });
};

export const events = {
  // Navigation
  navigateToCoaching: () => trackEvent("Navigate to Coaching"),
  navigateToEntreprises: () => trackEvent("Navigate to Entreprises"),
  navigateToBlog: () => trackEvent("Navigate to Blog"),
  navigateToContact: () => trackEvent("Navigate to Contact"),

  // CTA clicks
  clickDiscoveryCTA: () => trackEvent("Click Discovery CTA"),
  clickCoachingCTA: () => trackEvent("Click Coaching CTA"),
  clickEnterpriseCTA: () => trackEvent("Click Enterprise CTA"),

  // Contact form
  submitContactForm: (subject: string) =>
    trackEvent("Submit Contact Form", { subject }),
  contactFormError: (error: string) =>
    trackEvent("Contact Form Error", { error }),

  // Articles
  viewBlogPost: (slug: string) => trackEvent("View Blog Post", { slug }),
  shareArticle: (slug: string, platform: string) =>
    trackEvent("Share Article", { slug, platform }),

  // Calendar
  openCalendly: () => trackEvent("Open Calendly"),
  bookDiscoverySession: () => trackEvent("Book Discovery Session"),

  // Engagement
  scrollToSection: (section: string) =>
    trackEvent("Scroll to Section", { section }),
  watchVideo: (videoId: string) => trackEvent("Watch Video", { videoId }),
};

// Extend window object for TypeScript
declare global {
  interface Window {
    plausible: (eventName: string, options?: any) => void;
  }
}
