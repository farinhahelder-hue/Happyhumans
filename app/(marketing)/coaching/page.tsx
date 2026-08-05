import ReorderableSections from "@/components/ReorderableSections";
import { applySavedOrder } from "@/lib/getSectionOrder";
import { createClient } from "@/lib/supabase/server";
import { getContentBlocks } from "@/lib/getContentBlocks";
import type { Testimonial } from "@/lib/types";

// Section components
const CoachingHero = ({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle: string;
  image: string;
}) => (
  <section className="relative py-16 md:py-20 text-white overflow-hidden">
    {image && (
      <img
        src={image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
    )}
    <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 to-brand-dark/85" />
    <div className="relative max-w-6xl mx-auto px-6 text-center">
      <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ whiteSpace: "pre-line" }}>
        {title}
      </h1>
      <p className="text-lg md:text-xl text-white/80">{subtitle}</p>
    </div>
  </section>
);

const CoachingPrograms = ({
  heading,
  programs,
}: {
  heading: string;
  programs: { title: string; description: string }[];
}) => (
  <section className="py-16 bg-white">
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{heading}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {programs.map((program) => (
          <div key={program.title} className="border rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">{program.title}</h3>
            <p className="text-gray-600">{program.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Testimonials = ({
  heading,
  testimonials,
}: {
  heading: string;
  testimonials: Testimonial[];
}) => {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12 text-center">{heading}</h2>
        <div className="space-y-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-8 rounded-lg shadow">
              <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
              <p className="font-bold">
                {testimonial.author_name}
                {testimonial.author_role && (
                  <span className="font-normal text-gray-500">
                    {" "}
                    — {testimonial.author_role}
                    {testimonial.company && `, ${testimonial.company}`}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = ({
  heading,
  items,
}: {
  heading: string;
  items: { q: string; a: string }[];
}) => (
  <section className="py-16 bg-white">
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-4xl font-bold mb-12 text-center">{heading}</h2>
      <div className="space-y-4">
        {items.map(({ q, a }, i) => (
          <div key={i} className="border-l-4 border-brand pl-4 py-2">
            <h3 className="font-bold mb-2">{q}</h3>
            <p className="text-gray-600">{a}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTADiscovery = ({
  title,
  subtitle,
  buttonText,
}: {
  title: string;
  subtitle: string;
  buttonText: string;
}) => (
  <section className="py-20 bg-brand text-white text-center">
    <h2 className="text-4xl font-bold mb-6">{title}</h2>
    <p className="text-xl mb-8">{subtitle}</p>
    <a
      href="/contact#discovery"
      className="inline-block px-8 py-3 bg-white text-brand rounded-lg font-bold hover:bg-gray-100 transition"
    >
      {buttonText}
    </a>
  </section>
);

export default async function CoachingPage() {
  const supabase = await createClient();
  const [
    {
      data: { user },
    },
    { data: testimonials },
    content,
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("cms_testimonials")
      .select("*")
      .eq("published", true)
      .order("display_order", { ascending: true }),
    getContentBlocks("coaching"),
  ]);

  const hero = content.hero as Record<string, string>;
  const headings = content.headings as Record<string, string>;
  const programs = content.programs as { title: string; description: string }[];
  const faq = content.faq as { q: string; a: string }[];
  const cta = content.cta as Record<string, string>;

  const sections = [
    {
      id: "hero",
      title: "Hero",
      component: (
        <CoachingHero title={hero.title} subtitle={hero.subtitle} image={hero.image} />
      ),
    },
    {
      id: "programs",
      title: "Programmes",
      component: (
        <CoachingPrograms heading={headings.programsHeading} programs={programs} />
      ),
    },
    {
      id: "testimonials",
      title: "Témoignages",
      component: (
        <Testimonials
          heading={headings.testimonialsHeading}
          testimonials={testimonials || []}
        />
      ),
    },
    {
      id: "faq",
      title: "FAQ",
      component: <FAQ heading={headings.faqHeading} items={faq} />,
    },
    {
      id: "cta",
      title: "Call to Action",
      component: (
        <CTADiscovery
          title={cta.title}
          subtitle={cta.subtitle}
          buttonText={cta.buttonText}
        />
      ),
    },
  ];

  const orderedSections = await applySavedOrder("coaching", sections);

  return (
    <main>
      <ReorderableSections
        sections={orderedSections}
        pageId="coaching"
        isAdmin={!!user}
      />
    </main>
  );
}
