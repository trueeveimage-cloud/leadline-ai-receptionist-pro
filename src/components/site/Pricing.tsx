import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, stagger, item } from "./Section";

const plans = [
  {
    name: "Pilot Partner",
    price: "4,900 kr",
    cadence: "/month + 2,000 kr setup",
    tagline: "",
    features: ["AI receptionist", "Call summaries", "Email handoff", "Standard voice"],
    variant: "soft" as const,
  },
  {
    name: "Premium",
    price: "7,900 kr",
    cadence: "/month",
    tagline: "Setup included. Full stack — booking, summaries, custom voice.",
    features: ["Calendar booking", "Setup included", "Call summaries", "Priority transfer", "Custom voice"],
    featured: true,
    variant: "brand" as const,
  },
];

export function Pricing() {
  return (
    <Section id="pricing" eyebrow="Pricing" title="Simple, premium pricing.">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid md:grid-cols-2 gap-5 max-w-4xl"
      >
        {plans.map((p) => (
          <motion.div
            key={p.name}
            variants={item}
            className={`rounded-3xl p-8 md:p-10 border ${
              p.featured
                ? "bg-foreground text-background border-foreground shadow-[0_30px_60px_-20px_rgba(0,0,0,0.25)]"
                : "bg-card border-border"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{p.name}</h3>
              {p.featured && (
                <span className="text-[11px] uppercase tracking-[0.16em] text-brand-foreground/70 border border-background/20 rounded-full px-2.5 py-1">
                  Most chosen
                </span>
              )}
            </div>
            <div className="mt-8 flex items-baseline gap-1">
              <span className="text-4xl font-semibold tracking-tight">{p.price}</span>
              <span className={p.featured ? "text-background/60" : "text-muted-foreground"}>
                {p.cadence}
              </span>
            </div>
            {p.tagline && (
              <p
                className={`mt-3 text-sm ${
                  p.featured ? "text-background/70" : "text-muted-foreground"
                }`}
              >
                {p.tagline}
              </p>
            )}
            <div className="my-8 h-px bg-border/60" style={p.featured ? { background: "rgba(255,255,255,0.12)" } : undefined} />
            <ul className="space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <Check className={`h-4 w-4 ${p.featured ? "text-brand-foreground" : "text-brand"}`} />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Button
                asChild
                size="lg"
                variant={p.featured ? "soft" : "brand"}
                className="w-full"
              >
                <a href="#demo">Book demo</a>
              </Button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
