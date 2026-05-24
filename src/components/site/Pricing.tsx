import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useDialogs } from "./DialogsProvider";

const ease = [0.22, 1, 0.36, 1] as const;

const plans = [
  {
    name: "Pilot",
    price: "4,900",
    currency: "kr",
    cadence: "/ month",
    note: "+ 2,000 kr setup",
    features: [
      "AI receptionist",
      "Call summaries",
      "Email handoff",
      "Standard voice",
    ],
    featured: false,
  },
  {
    name: "Premium",
    price: "7,900",
    currency: "kr",
    cadence: "/ month",
    note: "Setup included",
    features: [
      "Calendar booking",
      "Call summaries",
      "Priority transfer",
      "Custom voice",
      "Dedicated onboarding",
    ],
    featured: true,
  },
];

export function Pricing() {
  const { openBooking } = useDialogs();
  const reduce = useReducedMotion();
  return (
    <section
      id="pricing"
      className="relative py-24 md:py-36 overflow-hidden"
    >
      {/* ambient parallax wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(40% 50% at 80% 20%, var(--foreground) 0%, transparent 60%), radial-gradient(45% 55% at 15% 90%, var(--foreground) 0%, transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-5xl px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="flex items-center gap-3 mb-10 md:mb-14"
        >
          <span className="h-px w-8 bg-foreground/30" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-medium">
            Pricing
          </span>
        </motion.div>

        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="text-4xl md:text-6xl font-extralight tracking-tight max-w-2xl"
        >
          Two ways to begin.<br />
          <span className="italic font-extralight text-foreground/40">
            Both unforgettable.
          </span>
        </motion.h2>

        <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-px bg-border/60">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease, delay: i * 0.08 }}
              className={`relative p-8 md:p-12 transition-colors duration-500 ${
                p.featured
                  ? "bg-foreground text-background"
                  : "bg-background hover:bg-card"
              }`}
            >
              {p.featured && (
                <span className="absolute top-6 right-6 md:top-8 md:right-8 text-[9px] uppercase tracking-[0.4em] text-background/60">
                  Recommended
                </span>
              )}

              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-current opacity-40" />
                <h3 className="text-[10px] uppercase tracking-[0.4em] font-medium">
                  {p.name}
                </h3>
              </div>

              <div className="mt-10 flex items-baseline gap-2">
                <span className="text-5xl md:text-7xl font-extralight tracking-tight tabular-nums">
                  {p.price}
                </span>
                <span
                  className={`text-sm font-light ${
                    p.featured ? "text-background/60" : "text-muted-foreground"
                  }`}
                >
                  {p.currency} {p.cadence}
                </span>
              </div>
              <p
                className={`mt-2 text-xs ${
                  p.featured ? "text-background/50" : "text-muted-foreground"
                }`}
              >
                {p.note}
              </p>

              <div
                className={`my-10 h-px ${
                  p.featured ? "bg-background/15" : "bg-border"
                }`}
              />

              <ul className="space-y-4">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-4 text-[13px] md:text-sm font-light"
                  >
                    <span
                      className={`h-px w-4 ${
                        p.featured ? "bg-background/40" : "bg-foreground/30"
                      }`}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-12">
                <Button
                  size="lg"
                  onClick={openBooking}
                  className={`w-full rounded-none uppercase tracking-[0.2em] text-[11px] font-semibold ${
                    p.featured
                      ? "bg-background text-foreground hover:bg-background/90"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                >
                  Book demo
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-[11px] uppercase tracking-[0.3em] text-muted-foreground text-center">
          Cancel anytime · Live in 7 days
        </p>
      </div>
    </section>
  );
}
