import { motion } from "framer-motion";
import { PhoneIncoming, Brain, CalendarCheck, Send } from "lucide-react";
import { Section, stagger, item } from "./Section";

const steps = [
  {
    icon: PhoneIncoming,
    title: "Caller dials your number",
    body: "We forward unanswered or after-hours calls to the AI receptionist. Your number, your branding — no caller ID surprises.",
    time: "Ring 1",
  },
  {
    icon: Brain,
    title: "AI qualifies in real time",
    body: "Trained on your services, prices and FAQs. Detects intent in under two seconds and adapts the script to the caller.",
    time: "0–15 sec",
  },
  {
    icon: CalendarCheck,
    title: "Booking written to your calendar",
    body: "Reads availability from Google/Outlook/Calendly and locks the slot. Sends the caller a confirmation SMS.",
    time: "During call",
  },
  {
    icon: Send,
    title: "Summary in your inbox",
    body: "A clean transcript, intent, and next step lands in your team's inbox + CRM the moment the call ends.",
    time: "+30 sec",
  },
];

export function Process() {
  return (
    <Section
      id="process"
      eyebrow="The 4-step flow"
      title="What happens between the ring and your inbox."
    >
      <motion.ol
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="relative space-y-4 md:space-y-0 md:grid md:grid-cols-4 md:gap-5"
      >
        <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.li
              key={s.title}
              variants={item}
              className="relative rounded-3xl border border-border bg-card p-6 md:p-7"
            >
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-2xl bg-foreground text-background grid place-items-center">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {s.time}
                </span>
              </div>
              <div className="mt-5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Step {i + 1}
              </div>
              <h3 className="mt-1 text-base font-semibold tracking-tight leading-snug">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </motion.li>
          );
        })}
      </motion.ol>
    </Section>
  );
}
