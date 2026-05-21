import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Leadline AI" },
      { name: "description", content: "Leadline AI terms of service and privacy policy." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand" />
            <span className="font-semibold tracking-tight">Leadline AI</span>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="text-[11px] uppercase tracking-[0.22em] text-brand mb-4">Legal</p>
        <h1 className="text-3xl md:text-5xl font-medium tracking-[-0.025em]">
          Terms &amp; Conditions
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="prose prose-neutral mt-12 max-w-none space-y-10 text-[15px] leading-relaxed text-foreground/90">
          <Section title="1. Agreement">
            By booking a demo or using Leadline AI ("we", "us", "the service"), you agree
            to these terms. If you don't agree, please don't use the service.
          </Section>

          <Section title="2. The service">
            Leadline AI provides AI-powered phone receptionists that answer, qualify, book
            and send call summaries on your behalf. Availability and feature scope is
            described on this website and may evolve over time.
          </Section>

          <Section title="3. Your responsibilities">
            You're responsible for the information you provide, for telling your callers
            that calls may be answered and processed by AI where required by law, and for
            keeping your account credentials safe.
          </Section>

          <Section title="4. Pricing and billing">
            Prices listed are starting prices and may vary depending on call volume,
            setup needs and integrations. Setup is included for selected partners during
            the pilot period. Minimum term is 1 month. You can cancel anytime after the
            first month with 30 days notice. Payment is monthly in advance. Extra call
            volume, custom integrations or advanced workflows may cost extra.
          </Section>

          <Section title="5. Calendar bookings & client information">
            Calendar bookings are only confirmed if the connected calendar availability
            is correct. The client is responsible for providing correct business
            information, prices, opening hours and availability. Leadline AI is not
            responsible for missed calls caused by wrong setup information, third-party
            outages, phone provider issues or calendar errors.
          </Section>

          <Section title="5. Data and privacy">
            Calls, transcripts and contact details are stored within the EU and
            encrypted at rest. We sign Data Processing Agreements on request and never
            train public models on your conversations. See our{" "}
            <Link to="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>{" "}
            for the details.
          </Section>

          <Section title="6. Data and privacy">
            Call summaries and customer details are handled only for business follow-up
            purposes. All customer data is handled according to GDPR. Calls, transcripts
            and contact details are stored within the EU and encrypted at rest. We sign
            Data Processing Agreements on request and never train public models on your
            conversations. See our{" "}
            <Link to="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>{" "}
            for the details.
          </Section>

          <Section title="7. Acceptable use">
            You may not use the service for unlawful activity, harassment, fraud, spam,
            or to impersonate a person without authority. We may suspend accounts that
            violate these rules.
          </Section>

          <Section title="8. Availability">
            We work hard to keep the service running 24/7 but make no uptime guarantees
            beyond those in a signed enterprise agreement. Scheduled maintenance is
            communicated in advance where possible.
          </Section>

          <Section title="8. Liability">
            To the maximum extent permitted by law, our liability is limited to the
            amount you paid us in the three months preceding the claim. We are not liable
            for indirect or consequential losses.
          </Section>

          <Section title="9. Changes">
            We may update these terms from time to time. Material changes will be
            communicated by email or in-product before they take effect.
          </Section>

          <Section title="10. Contact">
            Questions? Email{" "}
            <a href="mailto:hello@leadline.ai" className="underline hover:text-foreground">
              hello@leadline.ai
            </a>
            .
          </Section>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-10 text-xs text-muted-foreground flex items-center justify-between">
          <span>© {new Date().getFullYear()} Leadline AI</span>
          <Link to="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold tracking-tight mb-3">{title}</h2>
      <p className="text-muted-foreground">{children}</p>
    </section>
  );
}
