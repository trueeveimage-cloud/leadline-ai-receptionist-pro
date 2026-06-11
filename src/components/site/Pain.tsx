import { motion, useReducedMotion } from "framer-motion";
import { PhoneMissed, Voicemail, X, Check, Calendar, Inbox } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

export function Pain() {
  const { t, lang } = useI18n();
  const reduce = useReducedMotion();

  const before =
    lang === "sv"
      ? ["Missat samtal 14:02", "Missat samtal 14:47", "Röstbrevlåda · 18s", "Inget svar · konkurrenten ringer tillbaka"]
      : lang === "es"
        ? ["Llamada perdida 14:02", "Llamada perdida 14:47", "Buzón de voz · 18s", "Sin respuesta · la competencia llamó"]
        : ["Missed call 2:02 PM", "Missed call 2:47 PM", "Voicemail · 18s", "No callback · competitor won the job"];

  const after =
    lang === "sv"
      ? [
          { icon: Check, label: "Svarat på 1,2 sek" },
          { icon: Calendar, label: "Bokningsförslag: tis 10:30" },
          { icon: Inbox, label: "Sammanfattning i din inbox" },
          { icon: Check, label: "Jobb vunnet" },
        ]
      : lang === "es"
        ? [
            { icon: Check, label: "Contestado en 1,2 s" },
            { icon: Calendar, label: "Cita propuesta: mar 10:30" },
            { icon: Inbox, label: "Resumen en tu bandeja" },
            { icon: Check, label: "Trabajo ganado" },
          ]
        : [
            { icon: Check, label: "Answered in 1.2s" },
            { icon: Calendar, label: "Booking: Tue 10:30" },
            { icon: Inbox, label: "Summary in your inbox" },
            { icon: Check, label: "Job won" },
          ];

  const beforeLabel = lang === "sv" ? "Utan Leadmap" : lang === "es" ? "Sin Leadmap" : "Without Leadmap";
  const afterLabel = lang === "sv" ? "Med Leadmap" : lang === "es" ? "Con Leadmap" : "With Leadmap";

  return (
    <section id="pain" className="relative border-t border-border/60 py-16 md:py-28 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "120px 100%",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="h-px w-8 bg-foreground/30" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-medium">
            {t("pain.eyebrow")}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease, delay: 0.05 }}
          className="text-3xl md:text-6xl font-extralight tracking-tight leading-[1.05] max-w-3xl"
        >
          {t("pain.title")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease, delay: 0.12 }}
          className="mt-6 max-w-xl text-base md:text-lg font-light text-muted-foreground leading-relaxed"
        >
          {t("pain.body")}
        </motion.p>

        {/* Before / After split */}
        <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-0 items-stretch">
          {/* BEFORE */}
          <motion.div
            initial={{ opacity: 0, x: reduce ? 0 : -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease }}
            className="relative border border-border/70 bg-card p-6 md:p-10 md:rounded-l-2xl md:rounded-r-none overflow-hidden"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, var(--foreground) 0 1px, transparent 1px 10px)",
              }}
            />
            <div className="relative flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                {beforeLabel}
              </span>
              <PhoneMissed className="h-4 w-4 text-foreground/40" />
            </div>
            <ul className="relative mt-8 space-y-3">
              {before.map((line, i) => (
                <motion.li
                  key={line}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, ease, delay: 0.1 + i * 0.08 }}
                  className="flex items-center gap-3 border-b border-border/40 pb-3 last:border-b-0"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border bg-background">
                    {i === 2 ? (
                      <Voicemail className="h-3.5 w-3.5 text-foreground/50" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-foreground/50" />
                    )}
                  </span>
                  <span className="text-sm font-light text-muted-foreground line-through decoration-foreground/20">
                    {line}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Divider with arrow */}
          <div className="relative hidden md:flex items-center justify-center w-12">
            <span className="absolute inset-y-8 w-px bg-border" />
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease, delay: 0.4 }}
              className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-[10px] uppercase tracking-[0.2em] font-medium"
            >
              →
            </motion.span>
          </div>

          {/* AFTER */}
          <motion.div
            initial={{ opacity: 0, x: reduce ? 0 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
            className="relative border border-foreground bg-foreground text-background p-6 md:p-10 md:rounded-r-2xl md:rounded-l-none overflow-hidden"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, color-mix(in oklch, var(--brand) 60%, transparent), transparent 70%)",
              }}
            />
            <div className="relative flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.32em] text-background/60">
                {afterLabel}
              </span>
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
              </span>
            </div>
            <ul className="relative mt-8 space-y-3">
              {after.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, ease, delay: 0.25 + i * 0.1 }}
                    className="flex items-center gap-3 border-b border-background/15 pb-3 last:border-b-0"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-background/10 text-background">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm font-light text-background/90">
                      {item.label}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
          className="mt-12 text-[11px] uppercase tracking-[0.3em] text-muted-foreground/80"
        >
          {t("pain.built")}
        </motion.p>
      </div>
    </section>
  );
}
