import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialogs } from "./DialogsProvider";
import { useI18n, type Lang } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

const copy: Record<
  Lang,
  {
    eyebrow: string;
    title: string;
    body: string;
    popular: string;
    book: string;
    audit: string;
    risk: string;
    confirm: string;
    plans: {
      name: string;
      price: string;
      note: string;
      features: string[];
      featured?: boolean;
    }[];
  }
> = {
  sv: {
    eyebrow: "Priser",
    title: "Börja smått. Rädda samtalen som annars försvinner.",
    body: "Ni får en kontrollerad pilot först. Leadmap skickar kvalificerade bokningsförfrågningar, men ni bekräftar alltid själva kunden.",
    popular: "Mest vald",
    book: "Boka 10 min demo",
    audit: "Få gratis audit",
    risk: "Testa första månaden utan bindning.",
    confirm: "Setup ingår för första kunder. Ingen bindning första månaden.",
    plans: [
      {
        name: "Pilot",
        price: "från 2 900 kr/mån",
        note: "För företag som vill sluta tappa missade samtal.",
        features: [
          "AI svarar när ni inte hinner",
          "Samlar namn, nummer, ärende och önskad tid",
          "Skickar tydlig bokningsförfrågan",
          "Setup ingår för första kunder",
          "Ingen bindning första månaden",
        ],
      },
      {
        name: "Pro",
        price: "4 900 kr/mån",
        note: "För jour, kliniker och högre samtalsvolym.",
        featured: true,
        features: [
          "Allt i Pilot",
          "Mer anpassade samtalsflöden",
          "Passar jour/kliniker/högre volym",
          "Prioriterad setup/support",
          "Mer avancerade sammanfattningar och regler",
        ],
      },
    ],
  },
  en: {
    eyebrow: "Pricing",
    title: "Start small. Rescue the calls that would disappear.",
    body: "Begin with a controlled pilot. Leadmap sends qualified booking requests, and you always confirm the customer yourself.",
    popular: "Most chosen",
    book: "Book 10 min demo",
    audit: "Get free audit",
    risk: "Try the first month with no commitment.",
    confirm: "Setup included for first customers. No commitment first month.",
    plans: [
      {
        name: "Pilot",
        price: "from 2,900 kr/month",
        note: "For companies that want to stop losing missed calls.",
        features: [
          "AI answers when you cannot",
          "Captures name, number, need and preferred time",
          "Sends a clear booking request",
          "Setup included for first customers",
          "No commitment first month",
        ],
      },
      {
        name: "Pro",
        price: "4,900 kr/month",
        note: "For emergency teams, clinics and higher call volume.",
        featured: true,
        features: [
          "Everything in Pilot",
          "More customized call flows",
          "Fits emergency teams, clinics and higher volume",
          "Priority setup/support",
          "More advanced summaries and rules",
        ],
      },
    ],
  },
  es: {
    eyebrow: "Precios",
    title: "Empieza pequeño. Recupera las llamadas que se perderían.",
    body: "Comienza con un piloto controlado. Leadmap envía solicitudes calificadas y tú siempre confirmas al cliente.",
    popular: "Más elegido",
    book: "Reservar demo de 10 min",
    audit: "Recibir auditoría gratis",
    risk: "Prueba el primer mes sin permanencia.",
    confirm: "Setup incluido para primeros clientes. Sin permanencia el primer mes.",
    plans: [
      {
        name: "Piloto",
        price: "desde 2.900 kr/mes",
        note: "Para empresas que quieren dejar de perder llamadas.",
        features: [
          "La IA responde cuando no puedes",
          "Captura nombre, número, necesidad y hora preferida",
          "Envía una solicitud clara",
          "Setup incluido para primeros clientes",
          "Sin permanencia el primer mes",
        ],
      },
      {
        name: "Pro",
        price: "4.900 kr/mes",
        note: "Para urgencias, clínicas y más volumen.",
        featured: true,
        features: [
          "Todo en Piloto",
          "Flujos de llamada más personalizados",
          "Para urgencias, clínicas y alto volumen",
          "Setup/support prioritario",
          "Resúmenes y reglas más avanzadas",
        ],
      },
    ],
  },
};

export function Pricing() {
  const { openBooking } = useDialogs();
  const { lang } = useI18n();
  const reduce = useReducedMotion();
  const c = copy[lang];

  return (
    <section
      id="pricing"
      className="relative overflow-hidden border-b border-border/60 py-16 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" aria-hidden>
        <div className="h-full w-full bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:58px_58px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease }}
          className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end"
        >
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-muted-foreground">
              {c.eyebrow}
            </p>
            <h2 className="mt-5 max-w-2xl text-4xl font-extralight tracking-normal md:text-6xl">
              {c.title}
            </h2>
          </div>
          <p className="max-w-xl text-sm font-light leading-relaxed text-muted-foreground md:text-base">
            {c.body}
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {c.plans.map((plan, index) => (
            <motion.article
              key={plan.name}
              initial={reduce ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease, delay: index * 0.08 }}
              className={`relative flex min-h-[33rem] flex-col border p-6 md:p-8 ${
                plan.featured
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card"
              }`}
            >
              {plan.featured && (
                <span className="absolute right-4 top-4 border border-background/20 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-background/70">
                  {c.popular}
                </span>
              )}
              <div className="flex items-center gap-3">
                <span
                  className={`h-px w-8 ${plan.featured ? "bg-background/45" : "bg-foreground/30"}`}
                />
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.34em]">
                  {plan.name}
                </h3>
              </div>
              <div className="mt-8 text-4xl font-extralight tracking-normal md:text-5xl">
                {plan.price}
              </div>
              <p
                className={`mt-4 max-w-sm text-sm leading-relaxed ${plan.featured ? "text-background/65" : "text-muted-foreground"}`}
              >
                {plan.note}
              </p>
              <div className={`my-8 h-px ${plan.featured ? "bg-background/15" : "bg-border"}`} />
              <ul className="flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm leading-relaxed">
                    <CheckCircle2
                      className={`mt-0.5 h-4 w-4 shrink-0 ${plan.featured ? "text-background/70" : "text-foreground/70"}`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={openBooking}
                size="lg"
                className={`mt-8 rounded-none text-[11px] font-semibold uppercase tracking-[0.18em] ${
                  plan.featured
                    ? "bg-background text-foreground hover:bg-background/90"
                    : "bg-foreground text-background hover:bg-foreground/90"
                }`}
              >
                {c.book}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 grid gap-3 border border-border bg-card p-5 text-sm text-muted-foreground md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
            <p>
              <span className="text-foreground">{c.risk}</span> {c.confirm}
            </p>
          </div>
          <a
            href="/missade-samtal-audit?utm_source=pricing&utm_medium=cta&utm_campaign=free_audit"
            className="inline-flex items-center justify-start gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground hover:opacity-70"
          >
            {c.audit}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
