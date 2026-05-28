import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Leadmap AI" },
      { name: "description", content: "How Leadmap AI collects, stores and protects call recordings, transcripts and contact details under GDPR." },
      { property: "og:title", content: "Privacy Policy — Leadmap AI" },
      { property: "og:description", content: "How Leadmap AI handles your data: EU storage, encryption, GDPR rights and subprocessors." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand" />
            <span className="font-semibold tracking-tight">Leadmap AI</span>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="text-[11px] uppercase tracking-[0.22em] text-brand mb-4">Legal</p>
        <h1 className="text-3xl md:text-5xl font-medium tracking-[-0.025em]">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="mt-12 max-w-none space-y-10 text-[15px] leading-relaxed text-foreground/90">
          <Section title="What we collect">
            Contact details you submit (name, company, phone, preferred time), call
            recordings and transcripts processed by the AI receptionist, and standard
            technical metadata (user agent, timestamps) to keep the service secure.
          </Section>

          <Section title="How we use it">
            To deliver the service: answer calls, qualify leads, book appointments,
            send summaries, support and billing. We don't sell your data and we don't
            train public AI models on your conversations.
          </Section>

          <Section title="Where it lives">
            Data is stored in the EU with encryption at rest and in transit. Access is
            restricted to authorized personnel and logged.
          </Section>

          <Section title="Retention">
            Call audio and transcripts are retained for as long as your account is
            active, or as required to comply with legal obligations. You can request
            deletion at any time.
          </Section>

          <Section title="Your rights">
            Under GDPR you can access, correct, export or delete your data, and object
            to processing. Email{" "}
            <a href="mailto:leadmapai.se@gmail.com" className="underline hover:text-foreground">
              leadmapai.se@gmail.com
            </a>{" "}
            and we'll respond within 30 days.
          </Section>

          <Section title="Subprocessors">
            We use vetted infrastructure and AI partners under GDPR-compliant Data
            Processing Agreements. A current list is available on request.
          </Section>

          <Section title="Contact">
            Privacy questions:{" "}
            <a href="mailto:leadmapai.se@gmail.com" className="underline hover:text-foreground">
              leadmapai.se@gmail.com
            </a>
            .
          </Section>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-10 text-xs text-muted-foreground flex items-center justify-between">
          <span>© {new Date().getFullYear()} Leadmap AI</span>
          <Link to="/terms" className="hover:text-foreground">
            Terms &amp; Conditions
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
