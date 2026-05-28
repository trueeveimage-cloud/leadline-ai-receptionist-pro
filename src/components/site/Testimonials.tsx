import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const quotes = [
  {
    text: "We used to lose calls every afternoon while on jobs. Now every caller gets answered and we get a booking-ready SMS. Two extra jobs in the first week.",
    name: "Marcus L.",
    role: "Owner · Plumbing, Göteborg",
    tag: "Pilot user",
  },
  {
    text: "The receptionist sounds calm and professional in Swedish. Patients don't realize it's AI. Our front desk finally has time to focus on people in the clinic.",
    name: "Sofia E.",
    role: "Clinic manager · Stockholm",
    tag: "Pilot user",
  },
  {
    text: "Setup took less than a week. The qualified-lead summaries land in my inbox while I'm driving — I just call back the serious ones.",
    name: "Daniel K.",
    role: "Roofing contractor · Malmö",
    tag: "Pilot user",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 md:py-32 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="h-px w-8 bg-foreground/30" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-medium">
            From the pilot
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease, delay: 0.05 }}
          className="text-3xl md:text-5xl font-light tracking-[-0.02em] leading-[1.1] max-w-3xl"
        >
          What pilot customers are saying.
        </motion.h2>

        <div className="mt-12 md:mt-16 grid gap-5 md:gap-6 md:grid-cols-3">
          {quotes.map((q, i) => (
            <motion.figure
              key={q.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease, delay: 0.08 * i }}
              className="relative p-6 md:p-8 border border-border/70 bg-card flex flex-col"
            >
              <Quote className="h-5 w-5 text-brand/70 mb-4" />
              <blockquote className="text-[14px] md:text-[15px] leading-relaxed font-light text-foreground/90">
                "{q.text}"
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-border/60">
                <div className="text-sm font-medium">{q.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{q.role}</div>
                <span className="mt-3 inline-block text-[9px] uppercase tracking-[0.3em] text-brand">
                  {q.tag}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
