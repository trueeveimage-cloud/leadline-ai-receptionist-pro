import { type FormEvent, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ClipboardCheck, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogsProvider } from "@/components/site/DialogsProvider";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { AuditResult } from "@/components/site/AuditResult";
import { RoiCalculator } from "@/components/site/RoiCalculator";
import {
  captureMarketingAttribution,
  createSubmissionId,
  recordMarketingEvent,
} from "@/lib/marketing";
import { hasMarketingConsent } from "@/lib/consent";
import { SITE_URL } from "@/lib/site-config";

export const Route = createFileRoute("/missade-samtal-audit")({
  head: () => ({
    meta: [
      { title: "Gratis samtalsaudit för VVS | Leadmap" },
      {
        name: "description",
        content:
          "Få en gratis samtalsaudit och se hur Leadmap skulle svara på nästa missade VVS-samtal.",
      },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "Gratis samtalsaudit för VVS | Leadmap" },
      {
        property: "og:description",
        content:
          "Se vilka frågor AI-telefonisten skulle ställa och hur överlämningen till er kan se ut.",
      },
      { property: "og:url", content: `${SITE_URL}/missade-samtal-audit` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/missade-samtal-audit` }],
  }),
  component: MissedCallAuditPage,
});

function MissedCallAuditPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    contact: "",
    city: "",
    website: "",
    missedCallsPerWeek: "",
    companyWebsite: "",
  });
  const started = useRef(false);
  const submissionId = useRef<string | null>(null);
  const attribution = useMemo(
    () =>
      captureMarketingAttribution({ page_type: "audit", niche: "vvs", cta_variant: "audit_form" }),
    [],
  );

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (!started.current && key !== "companyWebsite") {
      started.current = true;
      recordMarketingEvent("audit_start", { attribution });
    }
    if (error) setError(null);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const eventId = submissionId.current || createSubmissionId();
    submissionId.current = eventId;

    try {
      const response = await fetch("/api/public/audit-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ...attribution,
          submissionId: eventId,
          niche: "VVS",
          advertisingConsent: hasMarketingConsent(),
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        error?: string;
        duplicate?: boolean;
      } | null;
      if (!response.ok) throw new Error(data?.error || "Kunde inte skicka förfrågan.");
      if (!data?.duplicate) {
        recordMarketingEvent("audit_submit", {
          eventId,
          attribution,
          server: false,
        });
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunde inte skicka förfrågan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DialogsProvider>
      <div className="min-h-screen bg-background text-foreground">
        <ScrollProgress />
        <Nav />
        <main>
          <section className="relative overflow-hidden border-b border-border/60 pt-28 md:pt-36">
            <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
              <div className="h-full w-full bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:42px_42px]" />
            </div>
            <div className="relative mx-auto grid max-w-6xl gap-12 px-6 pb-20 md:grid-cols-[0.9fr_1fr] md:pb-28">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65 }}
              >
                <p className="text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
                  Gratis samtalsaudit för VVS
                </p>
                <h1 className="mt-5 max-w-3xl text-4xl font-extralight leading-[1.02] tracking-normal md:text-7xl">
                  Se hur Leadmap skulle svara på nästa VVS-samtal.
                </h1>
                <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-muted-foreground md:text-lg">
                  Berätta vem ni är och hur vi når er. Vi tar fram ett tydligt VVS-exempel på
                  frågor, prioritering och överlämning — utan bindning.
                </p>
                <div className="mt-8 grid gap-3 text-sm text-muted-foreground">
                  {[
                    "Vi utgår från era vanligaste VVS-samtal och öppettider.",
                    "Ni ser vilka frågor AI-telefonisten skulle ställa.",
                    "Pilot från 2 900 kr/mån exkl. moms. Ni bekräftar själva nästa steg.",
                  ].map((item) => (
                    <div key={item} className="flex gap-3">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08 }}
              >
                {submitted ? (
                  <AuditResult
                    businessName={form.businessName}
                    ownerName={form.ownerName}
                    contact={form.contact}
                  />
                ) : (
                  <form
                    onSubmit={submit}
                    className="border border-border bg-card p-5 shadow-2xl shadow-foreground/5 md:p-8"
                  >
                    <div className="flex items-center gap-3 border-b border-border/70 pb-5">
                      <ClipboardCheck className="h-5 w-5" />
                      <div>
                        <h2 className="text-xl font-light">Få en gratis samtalsaudit</h2>
                        <p className="text-xs text-muted-foreground">
                          Tre uppgifter krävs. Resten är valfritt.
                        </p>
                      </div>
                    </div>

                    <div className="hidden" aria-hidden="true">
                      <Field
                        label="Webbplats"
                        name="companyWebsite"
                        value={form.companyWebsite}
                        onChange={(value) => update("companyWebsite", value)}
                        autoComplete="off"
                        tabIndex={-1}
                      />
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <Field
                        label="Företagsnamn"
                        name="businessName"
                        value={form.businessName}
                        onChange={(value) => update("businessName", value)}
                        autoComplete="organization"
                        required
                      />
                      <Field
                        label="Kontaktperson"
                        name="ownerName"
                        value={form.ownerName}
                        onChange={(value) => update("ownerName", value)}
                        autoComplete="name"
                        required
                      />
                      <Field
                        label="Telefon eller e-post"
                        name="contact"
                        value={form.contact}
                        onChange={(value) => update("contact", value)}
                        autoComplete="email"
                        className="sm:col-span-2"
                        required
                      />
                      <Field
                        label="Stad"
                        name="city"
                        value={form.city}
                        onChange={(value) => update("city", value)}
                        autoComplete="address-level2"
                      />
                      <Field
                        label="Webbplats"
                        name="website"
                        value={form.website}
                        onChange={(value) => update("website", value)}
                        autoComplete="url"
                      />
                      <Field
                        label="Missade samtal/vecka"
                        name="missedCallsPerWeek"
                        value={form.missedCallsPerWeek}
                        onChange={(value) => update("missedCallsPerWeek", value)}
                        placeholder="t.ex. 5–10"
                        inputMode="numeric"
                        className="sm:col-span-2"
                      />
                    </div>

                    {error ? (
                      <p className="mt-5 border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600">
                        {error}
                      </p>
                    ) : null}

                    <Button
                      type="submit"
                      variant="brand"
                      size="lg"
                      disabled={submitting}
                      className="mt-6 w-full rounded-none text-[11px] font-semibold uppercase tracking-[0.2em]"
                    >
                      {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Skicka förfrågan
                    </Button>
                    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                      Uppgifterna används endast för denna audit och eventuell uppföljning. Läs vår{" "}
                      <a href="/privacy" className="underline underline-offset-4">
                        integritetspolicy
                      </a>
                      .
                    </p>
                  </form>
                )}
              </motion.div>
            </div>
          </section>
          {submitted ? (
            <RoiCalculator
              initialMissedCalls={Number(form.missedCallsPerWeek.match(/\d+/)?.[0] || "5") || 5}
            />
          ) : null}
        </main>
        <Footer />
      </div>
    </DialogsProvider>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  required,
  placeholder,
  autoComplete,
  inputMode,
  tabIndex,
  className,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "email" | "tel" | "url";
  tabIndex?: number;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
      <Input
        className="mt-2 rounded-none"
        name={name}
        value={value}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        tabIndex={tabIndex}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
