import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ClipboardCheck,
  MailCheck,
  MessageSquareText,
  PhoneIncoming,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialogs } from "./DialogsProvider";
import { useI18n, type Lang } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

const copy: Record<
  Lang,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    hear: string;
    audit: string;
    chips: string[];
    visualTitle: string;
    visualStatus: string;
    stages: { title: string; meta: string }[];
    summary: string;
  }
> = {
  sv: {
    eyebrow: "AI-telefonist för svenska serviceföretag",
    title: "Missade samtal blir tappade jobb. Leadmap svarar direkt.",
    subtitle:
      "När ni är upptagna, ute på jobb eller har stängt tar Leadmap samtalet, samlar kundens uppgifter och skickar en tydlig bokningsförfrågan till er.",
    hear: "Hör hur Leadmap svarar",
    audit: "Få gratis missade-samtal audit",
    chips: [
      "Svensk AI-telefonist",
      "Från 2 900 kr/mån",
      "Setup ingår",
      "Ingen bindning första månaden",
      "Ni bekräftar själva varje bokning",
    ],
    visualTitle: "Inkommande samtal",
    visualStatus: "Lead skickat till ägaren",
    stages: [
      { title: "AI svarar", meta: "innan kunden går vidare" },
      { title: "Frågor ställs", meta: "namn, behov, brådska" },
      { title: "Uppgifter fångas", meta: "nummer och önskad tid" },
      { title: "Lead skickas", meta: "tydlig bokningsförfrågan" },
    ],
    summary: "Akut vattenläcka under diskbänk. Kunden vill bli uppringd så snart som möjligt.",
  },
  en: {
    eyebrow: "AI phone assistant for Swedish service businesses",
    title: "Missed calls become lost jobs. Leadmap answers instantly.",
    subtitle:
      "When you are busy, on the road, on a job or closed, Leadmap answers, collects the customer details and sends you a clear booking request.",
    hear: "Hear Leadmap answer",
    audit: "Get a free missed-call audit",
    chips: [
      "Swedish AI receptionist",
      "From 2,900 kr/month",
      "Setup included",
      "No commitment first month",
      "You confirm every booking",
    ],
    visualTitle: "Incoming call",
    visualStatus: "Lead sent to owner",
    stages: [
      { title: "AI answers", meta: "before the caller moves on" },
      { title: "Asks questions", meta: "name, need, urgency" },
      { title: "Captures details", meta: "number and preferred time" },
      { title: "Sends the lead", meta: "clear booking request" },
    ],
    summary: "Urgent leak under the sink. Customer wants a callback as soon as possible.",
  },
  es: {
    eyebrow: "Recepcionista de IA para empresas de servicios en Suecia",
    title:
      "Las llamadas perdidas se convierten en trabajos perdidos. Leadmap responde al instante.",
    subtitle:
      "Cuando estás ocupado, en ruta, trabajando o cerrado, Leadmap contesta, recoge los datos del cliente y te envía una solicitud clara.",
    hear: "Escuchar cómo responde Leadmap",
    audit: "Recibir auditoría gratis",
    chips: [
      "Recepcionista de IA sueca",
      "Desde 2.900 kr/mes",
      "Setup incluido",
      "Sin permanencia el primer mes",
      "Tú confirmas cada reserva",
    ],
    visualTitle: "Llamada entrante",
    visualStatus: "Lead enviado al dueño",
    stages: [
      { title: "La IA responde", meta: "antes de que llamen a otro" },
      { title: "Hace preguntas", meta: "nombre, necesidad, urgencia" },
      { title: "Captura datos", meta: "número y hora preferida" },
      { title: "Envía el lead", meta: "solicitud clara" },
    ],
    summary: "Fuga urgente bajo el fregadero. El cliente quiere llamada cuanto antes.",
  },
};

export function Hero() {
  const { openTestAI } = useDialogs();
  const { lang } = useI18n();
  const c = copy[lang];
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const visualY = useTransform(scrollYProgress, [0, 1], ["0%", "-7%"]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative overflow-hidden border-b border-border/60 pt-24 md:pt-28"
    >
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: glowY }}
        className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(60%_48%_at_50%_0%,var(--hero-glow),transparent_72%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="relative mx-auto grid min-h-[calc(100svh-6rem)] max-w-6xl content-center gap-12 px-6 py-12 md:grid-cols-[0.96fr_1.04fr] md:items-center md:gap-14 md:py-20">
        <div>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
            className="text-[10px] font-medium uppercase tracking-[0.34em] text-muted-foreground"
          >
            {c.eyebrow}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.04 }}
            className="mt-5 max-w-3xl text-5xl font-extralight leading-[0.98] tracking-normal md:text-7xl lg:text-[5.25rem]"
          >
            {c.title}
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.12 }}
            className="mt-6 max-w-xl text-base font-light leading-relaxed text-muted-foreground md:text-lg"
          >
            {c.subtitle}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.18 }}
            className="mt-8 grid gap-3 sm:max-w-xl sm:grid-cols-2"
          >
            <Button
              onClick={openTestAI}
              size="lg"
              variant="brand"
              className="rounded-none px-7 text-[11px] font-semibold uppercase tracking-[0.18em]"
            >
              <PhoneIncoming className="mr-2 h-4 w-4" />
              {c.hear}
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-none px-7 text-[11px] font-semibold uppercase tracking-[0.18em]"
            >
              <a href="/missade-samtal-audit?utm_source=homepage&utm_medium=hero&utm_campaign=free_audit">
                <ClipboardCheck className="mr-2 h-4 w-4" />
                {c.audit}
              </a>
            </Button>
          </motion.div>

          <motion.ul
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease, delay: 0.24 }}
            className="mt-6 flex max-w-2xl flex-wrap gap-2"
          >
            {c.chips.map((chip) => (
              <li
                key={chip}
                className="border border-border bg-background/75 px-3 py-2 text-[10px] uppercase tracking-[0.15em] text-muted-foreground backdrop-blur"
              >
                {chip}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.08 }}
          style={reduce ? undefined : { y: visualY }}
          className="relative mx-auto w-full max-w-[34rem]"
        >
          <div className="absolute -inset-4 border border-foreground/10 md:-inset-6" />
          <div className="relative overflow-hidden border border-border bg-card shadow-[0_50px_140px_-90px_var(--foreground)]">
            <div className="flex items-center justify-between border-b border-border/70 p-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-brand opacity-70" />
                  <span className="relative h-2 w-2 rounded-full bg-brand" />
                </span>
                {c.visualTitle}
              </div>
              <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                00:01
              </span>
            </div>
            <div className="grid gap-px bg-border/70 sm:grid-cols-[0.72fr_1fr]">
              <div className="bg-background p-5">
                <div className="grid h-14 w-14 place-items-center border border-foreground/15 bg-card">
                  <PhoneIncoming className="h-5 w-5" />
                </div>
                <div className="mt-8 space-y-3">
                  {c.stages.map((stage, index) => {
                    const Icon =
                      index === 0
                        ? PhoneIncoming
                        : index === 1
                          ? Sparkles
                          : index === 2
                            ? MessageSquareText
                            : MailCheck;
                    return (
                      <motion.div
                        key={stage.title}
                        initial={reduce ? false : { opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.55, ease, delay: 0.35 + index * 0.08 }}
                        className="grid grid-cols-[2rem_1fr] gap-3"
                      >
                        <span className="grid h-8 w-8 place-items-center border border-border bg-card">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span>
                          <span className="block text-sm font-medium">{stage.title}</span>
                          <span className="block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                            {stage.meta}
                          </span>
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col bg-background p-5">
                <div className="border border-border bg-foreground p-5 text-background">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-background/55">
                    {c.visualStatus}
                  </p>
                  <p className="mt-5 text-2xl font-light leading-tight">{c.summary}</p>
                </div>
                <div className="mt-4 grid gap-px bg-border/70 text-sm">
                  {["Namn: Johan Andersson", "Telefon: 07X XXX XX XX", "Status: skickad"].map(
                    (row) => (
                      <div
                        key={row}
                        className="flex items-center justify-between bg-card px-3 py-3"
                      >
                        <span>{row}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
