import Link from "next/link";
import { DemoForm } from "@/components/demo-form";
import { Logo } from "@/components/logo";
import { SiteHeader } from "@/components/site-header";

const features = [
  ["Lead capture", "Sync registrants from webinars, landing pages, and CSV uploads into one clean pipeline."],
  ["Engagement scoring", "Rank leads from attendance and follow-up activity so sales works the best conversations first."],
  ["Cadence builder", "Draft personalized email sequences for each audience and persist them with your account."],
  ["Pipeline workspace", "Move prospects from registration through booked call and conversion in a shared view."],
  ["Secure customer data", "Supabase authentication and row-level security isolate each workspace's records."],
  ["Conversion reporting", "See pipeline health and campaign progress without stitching together spreadsheets."]
];

const integrations = ["Zoom", "Eventbrite", "Google Sheets", "Calendly", "Gmail", "CSV Import"];

const plans = [
  { name: "Starter", price: "$29", text: "For an individual testing webinar sales.", items: ["1 seat", "500 leads", "CSV import"] },
  { name: "Growth", price: "$99", text: "For teams building repeatable follow-up.", items: ["Unlimited leads", "Cadence library", "Pipeline analytics"], featured: true },
  { name: "Pro", price: "$299", text: "For revenue teams scaling outreach.", items: ["Advanced scoring", "Multiple pipelines", "Priority support"] }
];

export default function MarketingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <span className="eyebrow">AI-powered webinar CRM</span>
              <h1>
                Turn webinar leads into <span>paying customers.</span>
              </h1>
              <p className="hero-copy">
                Capture every registrant, prioritize real engagement, and build timely email cadences from a single revenue workspace.
              </p>
              <div className="actions">
                <Link href="/signup" className="button primary">
                  Start 15-day free trial
                </Link>
                <Link href="/#demo" className="button secondary">
                  Request demo
                </Link>
              </div>
              <p className="muted">No credit card required. Set up in minutes.</p>
            </div>
            <DashboardPreview />
          </div>
        </section>

        <section className="proof-band">
          <div className="container proof-grid">
            <div><strong>12K+</strong><span>teams using LeadFlow</span></div>
            <div><strong>3.2M+</strong><span>leads tracked</span></div>
            <div><strong>98%</strong><span>customer satisfaction</span></div>
          </div>
        </section>

        <section className="section alt" id="features">
          <div className="container">
            <SectionHeading eyebrow="Platform features" title="Everything needed to close the webinar follow-up gap" />
            <div className="feature-grid">
              {features.map(([title, copy], index) => (
                <article className="feature-card" key={title}>
                  <span className="feature-number">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section dark">
          <div className="container">
            <SectionHeading eyebrow="Live pipeline" title="Follow every lead from registration to revenue" />
            <div className="kanban">
              {[
                ["Registered", "Carlos Vega", "Youth Empowers"],
                ["Attended live", "David Park", "Green City"],
                ["Qualified", "Fatima Hassan", "Edu Equity"],
                ["Converted", "Michelle Hall", "Aid Global"]
              ].map(([stage, person, org]) => (
                <article key={stage}>
                  <header>{stage}</header>
                  <div className="kanban-card">
                    <strong>{person}</strong>
                    <span>{org}</span>
                    <small>Warm lead</small>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="integrations">
          <div className="container">
            <SectionHeading eyebrow="Integrations" title="Connect the tools already in your workflow" />
            <div className="integration-grid">
              {integrations.map((integration) => (
                <div className="integration" key={integration}>
                  <span>{integration.slice(0, 2).toUpperCase()}</span>
                  <strong>{integration}</strong>
                  <small>Available</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section alt" id="pricing">
          <div className="container">
            <SectionHeading eyebrow="Pricing" title="Plans that scale with your pipeline" />
            <div className="pricing-grid">
              {plans.map((plan) => (
                <article className={`price-card ${plan.featured ? "featured" : ""}`} key={plan.name}>
                  {plan.featured ? <span className="popular">Most popular</span> : null}
                  <h3>{plan.name}</h3>
                  <strong className="price">{plan.price}<small>/month</small></strong>
                  <p>{plan.text}</p>
                  <ul>
                    {plan.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <Link href={`/signup?plan=${plan.name}`} className={`button full ${plan.featured ? "primary" : "secondary"}`}>
                    Start free trial
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section demo" id="demo">
          <div className="container demo-grid">
            <div>
              <span className="eyebrow">Request demo</span>
              <h2>See how your next webinar becomes a pipeline.</h2>
              <p>Book a focused walkthrough of lead capture, qualification, and cadence management.</p>
            </div>
            <DemoForm />
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <Logo />
          <p>Lead management for webinar-driven revenue teams.</p>
          <span>Copyright 2026 LeadFlow. All rights reserved.</span>
        </div>
      </footer>
    </>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="preview" aria-label="Pipeline dashboard preview">
      <div className="preview-header">
        <span />
        <span />
        <span />
        <strong>Pipeline Overview</strong>
      </div>
      <div className="preview-stats">
        <div><small>Registrations</small><strong>419</strong></div>
        <div><small>Converted</small><strong>29</strong></div>
        <div><small>Rate</small><strong>6.9%</strong></div>
      </div>
      <div className="preview-chart">
        {[64, 42, 74, 54, 88, 62, 92].map((height, index) => (
          <span key={height} style={{ height: `${height}%` }} aria-hidden="true">
            {index === 6 ? <small>Today</small> : null}
          </span>
        ))}
      </div>
      <div className="preview-lead">
        <div className="avatar">FH</div>
        <div><strong>Fatima Hassan</strong><small>Qualified lead</small></div>
        <b>Hot</b>
      </div>
    </div>
  );
}
