import { motion } from "framer-motion";
import { AlertTriangle, CalendarDays, Clock3, PhoneCall } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const segments = [
  {
    name: "Emergency trades",
    examples: "Plumbers, roofers, electricians",
    signal: "High-value callers choose whoever answers first.",
    icon: AlertTriangle,
  },
  {
    name: "Clinics and appointments",
    examples: "Dentists, aesthetics, private care",
    signal: "Every missed inquiry can become an empty slot.",
    icon: CalendarDays,
  },
  {
    name: "Mobile operators",
    examples: "Detailers, installers, repair teams",
    signal: "Calls arrive while the team is driving or on-site.",
    icon: PhoneCall,
  },
  {
    name: "After-hours demand",
    examples: "Legal, property, local services",
    signal: "Leadmap catches intent after the office closes.",
    icon: Clock3,
  },
];

export function Industries() {
  return (
    <section id="industries" className="border-y border-border/60 bg-surface/30 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease }}
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              Best-fit customers
            </p>
            <h2 className="mt-5 text-3xl font-extralight tracking-tight md:text-5xl">
              Built for businesses where one call can pay for the month.
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease, delay: 0.08 }}
            className="max-w-xl text-sm font-light leading-relaxed text-muted-foreground md:justify-self-end"
          >
            Leadmap is strongest when calls are urgent, appointment-driven, or arrive while the
            owner is busy doing the work. The AI qualifies the intent before it reaches your inbox.
          </motion.p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden border border-border/70 bg-border/70 md:grid-cols-4">
          {segments.map((segment, index) => {
            const Icon = segment.icon;
            return (
              <motion.article
                key={segment.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, ease, delay: index * 0.06 }}
                className="group bg-background p-6 transition-colors hover:bg-card md:min-h-[270px]"
              >
                <div className="flex h-11 w-11 items-center justify-center border border-foreground/20 transition-colors group-hover:border-foreground/50">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="mt-8 text-xl font-light tracking-tight">{segment.name}</h3>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {segment.examples}
                </p>
                <p className="mt-6 text-sm font-light leading-relaxed text-muted-foreground">
                  {segment.signal}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
