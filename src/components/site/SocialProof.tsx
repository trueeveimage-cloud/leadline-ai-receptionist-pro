import { motion } from "framer-motion";
import { Section } from "./Section";
import { useI18n } from "@/lib/i18n";

export function Stats() {
  const { t } = useI18n();
  const stats = [
    { value: "87%", label: t("stats.voicemail") },
    { value: "<1s", label: t("stats.pickup") },
    { value: "24/7", label: t("stats.coverage") },
    { value: "7 days", label: t("stats.live") },
  ];

  return (
    <section className="border-y border-border/60 bg-surface/40">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10"
        >
          {stats.map((s) => (
            <div key={s.label} className="border-l border-border/80 pl-5">
              <div className="text-3xl md:text-5xl font-semibold tracking-tight tabular-nums">
                {s.value}
              </div>
              <div className="mt-2 text-[13px] text-muted-foreground leading-snug max-w-[16ch]">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const quotes = [
  {
    quote:
      "We were losing two consults a week to voicemail. Within a month of going live, Leadmap captured 11 qualified booking requests we would have missed.",
    name: "Dr. Lina Holm",
    role: "Founder, Aurora Dental",
  },
  {
    quote:
      "It sounds like a calm receptionist, not a robot. Clients hang up impressed — half don't even realise it's AI.",
    name: "Markus Berg",
    role: "Partner, Berg & Lind Advokater",
  },
  {
    quote:
      "Setup took less than a week. Now every after-hours call gets answered, qualified, and on my calendar by morning.",
    name: "Sofia Ek",
    role: "Owner, Ek Interiors",
  },
];

export function Testimonials() {
  return (
    <Section
      id="testimonials"
      eyebrow="Said by operators"
      title="Trusted by businesses that can't afford a missed call."
    >
      <div className="grid md:grid-cols-3 gap-5">
        {quotes.map((q, i) => (
          <motion.figure
            key={q.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-border bg-card p-7 flex flex-col"
          >
            <div className="text-brand text-3xl leading-none font-serif">"</div>
            <blockquote className="mt-3 text-[15px] leading-relaxed text-foreground/90 flex-1">
              {q.quote}
            </blockquote>
            <figcaption className="mt-6 pt-5 border-t border-border/60">
              <div className="text-sm font-medium">{q.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{q.role}</div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </Section>
  );
}
