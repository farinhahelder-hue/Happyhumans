import ReorderableSections from "@/components/ReorderableSections";
import { applySavedOrder } from "@/lib/getSectionOrder";
import { createClient } from "@/lib/supabase/server";
import { getContentBlocks } from "@/lib/getContentBlocks";

// Section components
const EnterprisesHero = ({
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
    <div className="absolute inset-0 bg-gradient-to-r from-accent-dark/90 to-accent-dark/85" />
    <div className="relative max-w-6xl mx-auto px-6 text-center">
      <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ whiteSpace: "pre-line" }}>
        {title}
      </h1>
      <p className="text-lg md:text-xl text-white/80">{subtitle}</p>
    </div>
  </section>
);

const ImpactMetrics = ({
  heading,
  metrics,
}: {
  heading: string;
  metrics: { metric: string; label: string }[];
}) => (
  <section className="py-16 bg-white">
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{heading}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {metrics.map(({ metric, label }) => (
          <div key={label} className="p-8 bg-gradient-to-br from-accent/5 to-brand/5 rounded-lg">
            <div className="text-3xl font-bold text-accent mb-2">{metric}</div>
            <div className="text-gray-600">{label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CaseStudies = ({
  heading,
  cases,
}: {
  heading: string;
  cases: { company: string; challenge: string; result: string }[];
}) => (
  <section className="py-16 bg-gray-50">
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{heading}</h2>
      <div className="space-y-8">
        {cases.map(({ company, challenge, result }, i) => (
          <div key={i} className="border-l-4 border-accent bg-white p-6 rounded">
            <h3 className="font-bold text-lg mb-2">{company}</h3>
            <p className="text-sm text-gray-600 mb-3">
              <span className="font-semibold">Défi :</span> {challenge}
            </p>
            <p className="text-sm text-accent">
              <span className="font-semibold">Résultat :</span> {result}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Pricing = ({
  heading,
  tiers,
}: {
  heading: string;
  tiers: { name: string; price: string; desc: string }[];
}) => (
  <section className="py-16 bg-white">
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{heading}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map(({ name, price, desc }) => (
          <div key={name} className="border rounded-lg p-8 hover:shadow-lg transition">
            <h3 className="text-2xl font-bold mb-2 text-accent">{name}</h3>
            <p className="text-lg font-bold mb-4">{price}</p>
            <p className="text-gray-600">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FAQ = ({
  heading,
  items,
}: {
  heading: string;
  items: { q: string; a: string }[];
}) => (
  <section className="py-16 bg-gray-50">
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-4xl font-bold mb-12 text-center">{heading}</h2>
      <div className="space-y-4">
        {items.map(({ q, a }, i) => (
          <div key={i} className="border-l-4 border-accent pl-4 py-2">
            <h3 className="font-bold mb-2">{q}</h3>
            <p className="text-gray-600">{a}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Contact = ({
  title,
  subtitle,
  buttonText,
}: {
  title: string;
  subtitle: string;
  buttonText: string;
}) => (
  <section className="py-20 bg-accent text-white text-center">
    <h2 className="text-4xl font-bold mb-6">{title}</h2>
    <p className="text-xl mb-8">{subtitle}</p>
    <a
      href="/contact#discovery"
      className="inline-block px-8 py-3 bg-white text-accent rounded-lg font-bold hover:bg-gray-100 transition"
    >
      {buttonText}
    </a>
  </section>
);

export default async function EnterprisesPage() {
  const supabase = await createClient();
  const [
    {
      data: { user },
    },
    content,
  ] = await Promise.all([
    supabase.auth.getUser(),
    getContentBlocks("entreprises"),
  ]);

  const hero = content.hero as Record<string, string>;
  const headings = content.headings as Record<string, string>;
  const metrics = content.metrics as { metric: string; label: string }[];
  const caseStudies = content["case-studies"] as {
    company: string;
    challenge: string;
    result: string;
  }[];
  const pricing = content.pricing as { name: string; price: string; desc: string }[];
  const faq = content.faq as { q: string; a: string }[];
  const cta = content.cta as Record<string, string>;

  const sections = [
    {
      id: "hero",
      title: "Hero",
      component: (
        <EnterprisesHero title={hero.title} subtitle={hero.subtitle} image={hero.image} />
      ),
    },
    {
      id: "metrics",
      title: "Impact",
      component: <ImpactMetrics heading={headings.metricsHeading} metrics={metrics} />,
    },
    {
      id: "cases",
      title: "Cas d'usage",
      component: <CaseStudies heading={headings.casesHeading} cases={caseStudies} />,
    },
    {
      id: "pricing",
      title: "Tarification",
      component: <Pricing heading={headings.pricingHeading} tiers={pricing} />,
    },
    {
      id: "faq",
      title: "FAQ",
      component: <FAQ heading={headings.faqHeading} items={faq} />,
    },
    {
      id: "contact",
      title: "Contact",
      component: (
        <Contact title={cta.title} subtitle={cta.subtitle} buttonText={cta.buttonText} />
      ),
    },
  ];

  const orderedSections = await applySavedOrder("entreprises", sections);

  return (
    <main>
      <ReorderableSections
        sections={orderedSections}
        pageId="entreprises"
        isAdmin={!!user}
      />
    </main>
  );
}
