import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, PhoneOff, Sparkles, CheckCircle2, CalendarCheck, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Turn = {
  who: "ai" | "caller";
  text: string;
  delay: number;
  icon?: React.ComponentType<{ className?: string }>;
  meta?: string;
};

const script: Turn[] = [
  { who: "ai", text: "Thanks for calling Aurora Clinic. This is Ada — how can I help?", delay: 900, icon: Sparkles, meta: "AI answered · 0.4s" },
  { who: "caller", text: "Hi, I'd like to book a consultation this week.", delay: 2200 },
  { who: "ai", text: "Of course. May I have your name and a quick note on what you're looking for?", delay: 1800 },
  { who: "caller", text: "Sara Lind — interested in the premium skin package.", delay: 2200 },
  { who: "ai", text: "Lovely. I have Tuesday 10:30 or Thursday 14:00 available.", delay: 2000, icon: CheckCircle2, meta: "Lead qualified · High intent" },
  { who: "caller", text: "Tuesday 10:30 works.", delay: 1600 },
  { who: "ai", text: "Booked. You'll get a confirmation by SMS shortly.", delay: 1800, icon: CalendarCheck, meta: "Appointment booked · Tue 10:30" },
  { who: "ai", text: "Summary sent to the owner. Have a wonderful day.", delay: 1600, icon: Mail, meta: "Summary sent" },
];

export function CallDemoDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [step, setStep] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!open) {
      setStep(0);
      setSeconds(0);
      return;
    }
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (step >= script.length) return;
    const t = setTimeout(() => setStep((s) => s + 1), script[step].delay);
    return () => clearTimeout(t);
  }, [open, step]);

  const visible = script.slice(0, step);
  const ended = step >= script.length;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 rounded-2xl overflow-hidden border-border">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60 text-left">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-full bg-foreground text-background grid place-items-center">
              <Phone className="h-4 w-4" />
              {!ended && (
                <span className="absolute -inset-1 rounded-full border border-brand/40 animate-ping" />
              )}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-sm font-medium">Live demo call</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Leadline AI · Receptionist
              </DialogDescription>
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">
              {mm}:{ss}
            </span>
          </div>
        </DialogHeader>

        <div className="px-4 py-4 max-h-[55vh] overflow-y-auto bg-surface/40">
          <AnimatePresence initial={false}>
            {visible.map((turn, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`flex mb-2 ${turn.who === "ai" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    turn.who === "ai"
                      ? "bg-background border border-border text-foreground"
                      : "bg-foreground text-background"
                  }`}
                >
                  {turn.text}
                  {turn.meta && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-brand">
                      {turn.icon ? <turn.icon className="h-3 w-3" /> : null}
                      {turn.meta}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {!ended && (
              <motion.div
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="rounded-2xl bg-background border border-border px-4 py-3 flex gap-1">
                  <Dot delay={0} />
                  <Dot delay={0.15} />
                  <Dot delay={0.3} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-6 py-4 border-t border-border/60 flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            {ended ? "Call ended · summary delivered" : "Simulated · for demo purposes"}
          </span>
          {ended ? (
            <Button size="sm" variant="brand" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          ) : (
            <Button
              size="sm"
              variant="soft"
              onClick={() => onOpenChange(false)}
              className="gap-2"
            >
              <PhoneOff className="h-3.5 w-3.5" /> End
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60"
      animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 0.9, repeat: Infinity, delay }}
    />
  );
}
