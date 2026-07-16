import { FeatureGrid } from "~/components/site/feature-grid";
import { Hero } from "~/components/site/hero";
import { SiteFooter } from "~/components/site/site-footer";
import { SiteHeader } from "~/components/site/site-header";
import { Container, Section } from "~/components/ui/container";

export default function HomePage() {
  return (
    <main id="top">
      <SiteHeader />
      <Hero />

      <FeatureGrid
        id="services"
        eyebrow="Services"
        title="Built for speed, reliability, and clarity"
        description="From internal tools to customer-facing platforms, we ship software that reduces manual work and improves user experience."
        items={[
          {
            title: "Custom Web Apps",
            description:
              "Dashboards, portals, and line-of-business apps tailored to your workflows.",
          },
          {
            title: "Ecommerce & Payments",
            description:
              "Modern storefronts, custom checkout flows, and integrations that convert.",
          },
          {
            title: "Automation & Integrations",
            description:
              "Connect tools, automate reporting, and remove bottlenecks with smart workflows.",
          },
        ]}
      />

      <FeatureGrid
        id="solutions"
        tone="dark"
        eyebrow="Solutions"
        title="Solutions that scale with your business"
        description="A modular foundation you can reuse across teams and products—without reinventing the wheel."
        items={[
          {
            title: "Operations Dashboards",
            description:
              "Real-time KPIs, role-based views, and actionable insights in one place.",
          },
          {
            title: "Customer Portals",
            description:
              "Self-serve experiences for tracking, requests, billing, and support.",
          },
          {
            title: "Internal Admin Tools",
            description:
              "Secure workflows for managing orders, inventory, content, and users.",
          },
        ]}
      />

      <Section id="portfolio" className="bg-slate-50">
        <Container>
          <div className="max-w-2xl">
            <div className="text-xs font-semibold tracking-widest uppercase text-slate-500">
              Portfolio
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Recent work
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Real systems we've built for real businesses — from inventory
              management to booking platforms.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Order & Inventory System",
                text: "Unified operations view with alerts, audit trails, and exports.",
              },
              {
                title: "Service Booking Platform",
                text: "Client booking, staff scheduling, and automated reminders.",
              },
              {
                title: "Analytics Dashboard",
                text: "Custom KPIs, cohort insights, and executive-ready reporting.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl bg-white p-6 ring-1 ring-inset ring-slate-200"
              >
                <div className="text-lg font-semibold text-slate-900">
                  {card.title}
                </div>
                <div className="mt-2 text-sm leading-relaxed text-slate-600">
                  {card.text}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="blog" className="bg-white">
        <Container>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="text-xs font-semibold tracking-widest uppercase text-slate-500">
                Blog
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Insights & updates
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Short, practical notes on building reliable software and improving
                customer experience.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "What makes an internal tool actually usable?",
                meta: "Product • 5 min read",
                text: "Key principles for building software your team will actually want to use every day.",
              },
              {
                title: "Automations that pay for themselves quickly",
                meta: "Ops • 4 min read",
                text: "How small businesses can automate repetitive tasks without breaking the bank.",
              },
              {
                title: "Reducing support tickets with better UX",
                meta: "CX • 6 min read",
                text: "Simple UI improvements that cut customer inquiries and improve satisfaction.",
              },
            ].map((post) => (
              <div
                key={post.title}
                className="rounded-2xl bg-slate-50 p-6 ring-1 ring-inset ring-slate-200"
              >
                <div className="text-xs font-semibold text-slate-500">
                  {post.meta}
                </div>
                <div className="mt-3 text-base font-semibold text-slate-900">
                  {post.title}
                </div>
                <div className="mt-3 text-sm leading-relaxed text-slate-600">
                  {post.text}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="pricing" className="bg-slate-50">
        <Container>
          <div className="max-w-2xl">
            <div className="text-xs font-semibold tracking-widest uppercase text-slate-500">
              Pricing
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, clear pricing
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Transparent pricing tailored to your project scope. Request a free
              quote and we'll provide a clear estimate within 48 hours.
            </p>
            <div className="mt-8">
              <a
                href="/quote"
                className="inline-flex h-11 items-center justify-center rounded-md bg-sky-500 px-5 text-sm font-semibold text-white shadow-sm shadow-black/10 transition-colors hover:bg-sky-400 active:bg-sky-600"
              >
                Request a Free Quote
              </a>
            </div>
          </div>
        </Container>
      </Section>

      <SiteFooter />
    </main>
  );
}
