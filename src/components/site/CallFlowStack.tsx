import { CalendarCheck, MailCheck, PhoneIncoming, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const flow = [
  { icon: PhoneIncoming, label: "Answers", text: "instant pickup" },
  { icon: Sparkles, label: "Qualifies", text: "lead intent" },
  { icon: CalendarCheck, label: "Schedules", text: "next step" },
  { icon: MailCheck, label: "Summarizes", text: "sent to inbox" },
] as const;

export function CallFlowStack() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease }}
      className="relative mx-auto mt-8 w-full max-w-md"
    >
      <div
        aria-hidden
        className="absolute -left-3 top-0 h-full w-px bg-gradient-to-b from-transparent via-foreground/35 to-transparent"
      />
      <div className="space-y-2">
        {flow.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.label}
              initial={reduce ? false : { opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, ease, delay: index * 0.05 }}
              className="group relative flex items-center gap-3 rounded-md border border-border/70 bg-card/80 px-4 py-3 text-left shadow-[0_18px_50px_-36px_var(--foreground)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-foreground/25 hover:bg-secondary"
            >
              <span
                aria-hidden
                className="absolute -left-[15px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-foreground/70 ring-4 ring-background"
              />
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border/70 bg-background text-foreground">
                <Icon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold leading-none">{item.label}</span>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {item.text}
                </span>
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
