import { FormEvent, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, ClipboardCheck, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogsProvider } from "@/components/site/DialogsProvider";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { SITE_URL } from "@/lib/marketing-pages";

export const Route = createFileRoute("/missade-samtal-audit")({
  head: () => ({
    meta: [
      { title: "Gratis missade-samtal audit | Leadmap" },
      {
        name: "description",
        content:
          "Fa en gratis missade-samtal audit och se hur Leadmap skulle svara at ditt foretag. For VVS, kliniker, tandlakare, bilverkstader och serviceforetag.",
      },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "Gratis missade-samtal audit" },
      { property: "og:description", content: "Se hur Leadmap skulle svara at ditt foretag." },
      { property: "og:url", content: `${SITE_URL}/missade-samtal-audit` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/missade-samtal-audit` }],
  }),
  component: MissedCallAuditPage,
});

const contactMethods = ["SMS", "E-post", "Samtal"];
const niches = ["VVS / rormokare", "Taklaggare", "Tandlakare", "Klinik", "Bilverkstad", "Bargning", "Elektriker jour", "Annat"];

function MissedCallAuditPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    phone: "",
    email: "",
    niche: niches[0],
    city: "",
    website: "",
    missedCallsPerWeek: "",
    preferredContactMethod: contactMethods[1],
  });

  const tracking = useMemo(() => {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    return {
      source_page: params.get("source_page") || document.referrer || "/missade-samtal-audit",
      city_page: params.get("city_page") || "",
      niche_page: params.get("niche_page") || "",
      case_study_page: params.get("case_study_page") || "",
      utm_source: params.get("utm_source") || "website",
      utm_medium: params.get("utm_medium") || "audit_funnel",
      utm_campaign: params.get("utm_campaign") || "missade_samtal_audit",
    };
  }, []);

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (error) setError(null);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/public/audit-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...tracking }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(data?.error || "Kunde inte skicka audit-forfragan.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunde inte skicka audit-forfragan.");
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
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
                <p className="text-[10px] uppercase tracking-[0.34em] text-muted-foreground">Gratis audit</p>
                <h1 className="mt-5 max-w-3xl text-4xl font-extralight leading-[1.02] tracking-normal md:text-7xl">
                  Se hur Leadmap skulle svara at ditt foretag.
                </h1>
                <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-muted-foreground md:text-lg">
                  Skicka dina uppgifter sa gor vi en kort missade-samtal audit. Du far en konkret demo eller uppfoljning fran Leadmap, utan bindning.
                </p>
                <div className="mt-8 grid gap-3 text-sm text-muted-foreground">
                  {[
                    "Vi tittar pa bransch, stad och hur samtalen brukar komma in.",
                    "Du far se vilka fragor AI-telefonisten skulle stalla.",
                    "Pilot fran 2 900 kr/man. Setup ingar for forsta kunder.",
                  ].map((item) => (
                    <div key={item} className="flex gap-3">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08 }}>
                {submitted ? (
                  <div className="border border-border bg-card p-8 md:p-10">
                    <CheckCircle2 className="h-10 w-10 text-brand" />
                    <h2 className="mt-6 text-3xl font-extralight">Audit-forfragan mottagen.</h2>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      Leadmap/Maged skickar en kort demo eller uppfoljning via vald kanal. Vi markerar detta som en website audit lead i CRM nar Supabase-kopplingen ar aktiv.
                    </p>
                    <Button asChild variant="outline" className="mt-8 rounded-none">
                      <a href="/">Till startsidan</a>
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={submit} className="border border-border bg-card p-5 shadow-2xl shadow-foreground/5 md:p-8">
                    <div className="flex items-center gap-3 border-b border-border/70 pb-5">
                      <ClipboardCheck className="h-5 w-5" />
                      <div>
                        <h2 className="text-xl font-light">Fa gratis missade-samtal audit</h2>
                        <p className="text-xs text-muted-foreground">Alla falt hjalper oss gora demon mer relevant.</p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <Field label="Foretagsnamn" value={form.businessName} onChange={(v) => update("businessName", v)} required />
                      <Field label="Namn" value={form.ownerName} onChange={(v) => update("ownerName", v)} required />
                      <Field label="Telefonnummer" value={form.phone} onChange={(v) => update("phone", v)} required />
                      <Field label="E-post" value={form.email} onChange={(v) => update("email", v)} type="email" required />
                      <SelectField label="Bransch" value={form.niche} onChange={(v) => update("niche", v)} options={niches} />
                      <Field label="Stad" value={form.city} onChange={(v) => update("city", v)} required />
                      <Field label="Webbplats" value={form.website} onChange={(v) => update("website", v)} />
                      <Field label="Missade samtal/vecka" value={form.missedCallsPerWeek} onChange={(v) => update("missedCallsPerWeek", v)} placeholder="t.ex. 5-10" />
                      <SelectField label="Demo via" value={form.preferredContactMethod} onChange={(v) => update("preferredContactMethod", v)} options={contactMethods} className="sm:col-span-2" />
                    </div>

                    {error && <p className="mt-5 border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

                    <Button type="submit" variant="brand" size="lg" disabled={submitting} className="mt-6 w-full rounded-none text-[11px] font-semibold uppercase tracking-[0.2em]">
                      {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Skicka audit-forfragan
                    </Button>
                    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                      Ingen spam. Du far bara uppfoljning om audit/demo och kan be oss ta bort dina uppgifter.
                    </p>
                  </form>
                )}
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </DialogsProvider>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
      <Input
        className="mt-2 rounded-none"
        value={value}
        type={type}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
      <select
        className="mt-2 h-10 w-full rounded-none border border-input bg-background px-3 text-sm"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
