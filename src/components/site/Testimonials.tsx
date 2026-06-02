import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

const quotes = [
  {
    text: "We used to lose calls every afternoon while on jobs. Now every caller gets answered and we get a booking-ready SMS. Two extra jobs in the first week.",
    name: "Marcus L.",
    role: "Owner · Plumbing, Göteborg",
  },
  {
    text: "The receptionist sounds calm and professional in Swedish. Patients don't realize it's AI. Our front desk finally has time to focus on people in the clinic.",
    name: "Sofia E.",
    role: "Clinic manager · Stockholm",
  },
  {
    text: "Setup took less than a week. The qualified-lead summaries land in my inbox while I'm driving — I just call back the serious ones.",
    name: "Daniel K.",
    role: "Roofing contractor · Malmö",
  },
  {
    text: "Before Leadmap I'd come back from a detail and see 6 missed calls. Now I see 6 summaries with names, cars and budgets. Total game changer.",
    name: "Anders W.",
    role: "Owner · Car detailing, Uppsala",
  },
  {
    text: "Out-of-hours emergencies used to go to voicemail. Now we get the address and the issue within seconds. We don't miss night jobs anymore.",
    name: "Linda P.",
    role: "Dispatcher · Emergency trades",
  },
];

export function Testimonials() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const loop = [...quotes, ...quotes];

  return (
    <section id="testimonials" className="py-16 md:py-28 border-t border-border/60 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="h-px w-8 bg-foreground/30" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-medium">
            {t("test.eyebrow")}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease, delay: 0.05 }}
          className="text-2xl md:text-5xl font-extralight tracking-[-0.02em] leading-[1.15] max-w-3xl"
        >
          {t("test.title")}
        </motion.h2>
      </div>

      <div
        className="mt-10 md:mt-16 relative"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <motion.div
          className="flex gap-4 md:gap-6 w-max"
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={
            reduce
              ? undefined
              : { duration: 50, ease: "linear", repeat: Infinity }
          }
        >
          {loop.map((q, i) => (
            <figure
              key={`${q.name}-${i}`}
              className="shrink-0 w-[72vw] sm:w-[340px] md:w-[360px] p-5 md:p-6 border-l md:border border-border/70 md:bg-card flex flex-col"
            >
              <blockquote className="text-[13px] md:text-[14px] leading-relaxed font-light text-foreground/90">
                "{q.text}"
              </blockquote>
              <figcaption className="mt-5 pt-4 border-t border-border/60">
                <div className="text-[12px] md:text-[13px] font-medium">{q.name}</div>
                <div className="text-[10.5px] md:text-[11px] text-muted-foreground mt-0.5">
                  {q.role}
                </div>
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
