import { motion } from "framer-motion";
import { CheckCircle2, FileText, Forward, Gauge, LockKeyhole, Settings2 } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const setup = [
  { day: "Day 1", title: "Map your calls", detail: "We capture common questions, services, prices, areas and handoff rules." },
  { day: "Day 2-3", title: "Train the voice", detail: "Leadmap gets your tone, caller flow and qualification logic." },
  { day: "Day 4-5", title: "Connect forwarding", detail: "You keep your number. We route missed or after-hours calls to the AI." },
  { day: "Day 6-7", title: "Go live softly", detail: "Summaries, fallback rules and booking requests are checked before scaling." },
];

const safeguards = [
  { icon: Forward, label: "Keep your current number" },
  { icon: FileText, label: "Call summaries after every lead" },
  { icon: LockKeyhole, label: "EU data handling" },
  { icon: Gauge, label: "Fast pickup, no voicemail gap" },
  { icon: Settings2, label: "Custom script and fallback rules" },
  { icon: CheckCircle2, label: "You approve booking confirmations" },
];

export function TrustStack() {
  return (
    <section className="relative overflow-hidden border-y border-border/60 py-16 md:py-28">
      <div
        aria-hidden
        className="absolute inset-y-0 left-1/2 hidden w-px bg-foreground/10 md:block"
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            Trust the handoff
          </p>
          <h2 className="mt-5 text-3xl font-extralight tracking-normal md:text-5xl">
            Not a chatbot. A controlled front desk system.
          </h2>
          <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-muted-foreground">
            The sale is not just the voice. It is the routing, qualification rules, summaries,
            fallback behavior and the calm feeling that every serious caller is handled.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-px border border-border/70 bg-border/70">
            {safeguards.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-background p-4">
                  <Icon className="h-4 w-4" />
                  <div className="mt-4 text-sm font-light leading-snug">{item.label}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="relative">
          <div className="absolute left-5 top-0 hidden h-full w-px bg-border md:block" />
          <div className="space-y-4">
            {setup.map((item, index) => (
              <motion.div
                key={item.day}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, ease, delay: index * 0.08 }}
                className="relative border border-border bg-background p-5 md:ml-12"
              >
                <div className="absolute -left-[3.2rem] top-6 hidden h-3 w-3 rounded-full border border-foreground bg-background md:block" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                      {item.day}
                    </div>
                    <h3 className="mt-2 text-xl font-light tracking-normal">{item.title}</h3>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <p className="mt-4 max-w-lg text-sm font-light leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
