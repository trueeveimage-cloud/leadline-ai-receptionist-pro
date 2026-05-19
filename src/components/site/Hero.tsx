import { motion } from "framer-motion";
import { Phone, CheckCircle2, CalendarCheck, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialogs } from "./DialogsProvider";

const steps = [
  { icon: Phone, label: "Incoming call", meta: "+45 •• 21 47 08" },
  { icon: Sparkles, label: "AI answered", meta: "0.4s" },
  { icon: CheckCircle2, label: "Lead qualified", meta: "High intent" },
  { icon: CalendarCheck, label: "Appointment booked", meta: "Tue · 10:30" },
  { icon: Mail, label: "Summary sent", meta: "Owner notified" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { openCallDemo, openBooking } = useDialogs();
  return (
    <section id="top" className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-surface to-transparent -z-10" />
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-16 md:gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            AI receptionists for high-value businesses
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.05 }}
            className="mt-6 text-[40px] leading-[1.05] md:text-6xl md:leading-[1.02] font-semibold tracking-tight"
          >
            Never miss a<br />
            <span className="text-brand">high-value call</span> again.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.15 }}
            className="mt-6 text-lg text-muted-foreground max-w-md"
          >
            AI receptionists that answer, qualify, book and notify — 24/7.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.25 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Button size="lg" variant="brand" onClick={openBooking}>
              Book demo
            </Button>
            <Button size="lg" variant="soft" onClick={openCallDemo}>
              Call demo AI
            </Button>
          </motion.div>
        </div>

        <CallCard />
      </div>
    </section>
  );
}

function CallCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease, delay: 0.2 }}
      className="relative mx-auto w-full max-w-md"
    >
      <div className="absolute -inset-6 -z-10 bg-gradient-to-br from-brand/5 via-transparent to-transparent rounded-[2rem] blur-2xl" />
      <div className="rounded-3xl border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_60px_-20px_rgba(0,0,0,0.12)] overflow-hidden">
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-foreground text-background grid place-items-center">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Live call</p>
              <p className="text-xs text-muted-foreground">Leadline AI · Receptionist</p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">00:47</span>
        </div>
        <ul className="p-3">
          {steps.map((s, i) => (
            <motion.li
              key={s.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.5 + i * 0.18 }}
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-surface transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-surface border border-border grid place-items-center text-foreground">
                <s.icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{s.label}</p>
              </div>
              <span className="text-xs text-muted-foreground">{s.meta}</span>
            </motion.li>
          ))}
        </ul>
        <div className="px-6 py-4 border-t border-border/60 flex items-center justify-between bg-surface/60">
          <span className="text-xs text-muted-foreground">Summary sent to owner</span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Booked
          </span>
        </div>
      </div>
    </motion.div>
  );
}
