import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Phone, Sparkles, CheckCircle2, CalendarCheck, Mail, PhoneIncoming } from "lucide-react";

const stages = [
  { key: "incoming", label: "Incoming", icon: PhoneIncoming },
  { key: "answered", label: "Answered", icon: Phone },
  { key: "qualifying", label: "Qualifying", icon: Sparkles },
  { key: "booking", label: "Booking", icon: CalendarCheck },
  { key: "summary", label: "Summary", icon: Mail },
] as const;

// Map each conversation turn index to a stage index (0..4)
const turnStage = [1, 1, 2, 2, 2, 3, 3, 4];

type Turn = {
  who: "ai" | "caller";
  text: string;
  meta?: { icon: React.ComponentType<{ className?: string }>; label: string };
};

type Script = { code: string; label: string; turns: Turn[] };

const scripts: Script[] = [
  {
    code: "en",
    label: "EN",
    turns: [
      { who: "ai", text: "Thanks for calling Aurora Clinic. This is Ada — how can I help?", meta: { icon: Sparkles, label: "Answered · 0.4s" } },
      { who: "caller", text: "Hi, I'd like to book a consultation this week." },
      { who: "ai", text: "Of course. May I ask what you're looking for?" },
      { who: "caller", text: "The premium skin package." },
      { who: "ai", text: "Lovely. Tuesday 10:30 or Thursday 14:00?", meta: { icon: CheckCircle2, label: "Qualified · high intent" } },
      { who: "caller", text: "Tuesday works." },
      { who: "ai", text: "Booked. Confirmation sent by SMS.", meta: { icon: CalendarCheck, label: "Booked · Tue 10:30" } },
      { who: "ai", text: "Summary sent to the owner. Have a lovely day.", meta: { icon: Mail, label: "Summary delivered" } },
    ],
  },
  {
    code: "sv",
    label: "SV",
    turns: [
      { who: "ai", text: "Tack för att du ringer Aurora Klinik. Det är Ada — hur kan jag hjälpa till?", meta: { icon: Sparkles, label: "Svarade · 0,4s" } },
      { who: "caller", text: "Hej, jag vill boka en konsultation i veckan." },
      { who: "ai", text: "Självklart. Vad är du intresserad av?" },
      { who: "caller", text: "Premium-hudpaketet." },
      { who: "ai", text: "Härligt. Tisdag 10:30 eller torsdag 14:00?", meta: { icon: CheckCircle2, label: "Kvalificerad" } },
      { who: "caller", text: "Tisdag funkar." },
      { who: "ai", text: "Bokat. Bekräftelse skickad via SMS.", meta: { icon: CalendarCheck, label: "Bokat · tis 10:30" } },
      { who: "ai", text: "Sammanfattning skickad till ägaren. Ha en fin dag.", meta: { icon: Mail, label: "Sammanfattning skickad" } },
    ],
  },
  {
    code: "es",
    label: "ES",
    turns: [
      { who: "ai", text: "Gracias por llamar a Aurora Clinic. Soy Ada — ¿en qué puedo ayudarle?", meta: { icon: Sparkles, label: "Atendido · 0,4s" } },
      { who: "caller", text: "Hola, quisiera reservar una consulta esta semana." },
      { who: "ai", text: "Por supuesto. ¿Qué le interesa?" },
      { who: "caller", text: "El paquete premium de piel." },
      { who: "ai", text: "Encantada. ¿Martes 10:30 o jueves 14:00?", meta: { icon: CheckCircle2, label: "Calificado" } },
      { who: "caller", text: "El martes me va bien." },
      { who: "ai", text: "Reservado. Confirmación enviada por SMS.", meta: { icon: CalendarCheck, label: "Reservado · mar 10:30" } },
      { who: "ai", text: "Resumen enviado al propietario. Buen día.", meta: { icon: Mail, label: "Resumen enviado" } },
    ],
  },
];

const STEP_MS = 1800;
const RESET_PAUSE_MS = 2400;

export function ConversationPreview() {
  const [langCode, setLangCode] = useState("en");
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();
  const script = useMemo(() => scripts.find((s) => s.code === langCode) ?? scripts[0], [langCode]);

  useEffect(() => {
    setStep(0);
  }, [langCode]);

  useEffect(() => {
    const total = script.turns.length;
    const done = step >= total;
    const delay = done ? RESET_PAUSE_MS : STEP_MS;
    const t = setTimeout(() => setStep((s) => (s >= total ? 0 : s + 1)), delay);
    return () => clearTimeout(t);
  }, [step, script]);

  const visible = script.turns.slice(0, step);
  const currentStage = step === 0 ? 0 : turnStage[Math.min(step - 1, turnStage.length - 1)];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="relative mx-auto w-full max-w-md"
    >
      <div className="absolute -inset-6 -z-10 bg-gradient-to-br from-brand/5 via-transparent to-transparent rounded-[2rem] blur-2xl" />
      <div className="rounded-3xl border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_60px_-20px_rgba(0,0,0,0.12)] overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 rounded-full bg-foreground text-background grid place-items-center">
              <Phone className="h-4 w-4" />
              <span className="absolute -inset-1 rounded-full border border-brand/40 animate-ping" />
            </div>
            <div>
              <p className="text-sm font-medium">Live call</p>
              <p className="text-xs text-muted-foreground">Leadmap · Receptionist</p>
            </div>
          </div>
          <LanguagePicker value={langCode} onChange={setLangCode} />
        </div>
        {/* Stage tracker */}
        <StageTracker current={currentStage} />

        {/* Conversation */}
        <div className="px-4 py-4 h-[340px] overflow-hidden bg-surface/40 flex flex-col justify-end">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((turn, i) => (
              <motion.div
                key={`${script.code}-${i}`}
                layout
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`flex mb-2 ${turn.who === "ai" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-[13px] leading-snug ${
                    turn.who === "ai"
                      ? "bg-background border border-border text-foreground"
                      : "bg-foreground text-background"
                  }`}
                >
                  {turn.text}
                  {turn.meta && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-[10.5px] text-brand">
                      <turn.meta.icon className="h-3 w-3" />
                      {turn.meta.label}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {step < script.turns.length && (
              <motion.div
                key={`${script.code}-typing`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`flex mb-1 ${
                  script.turns[step].who === "ai" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`rounded-2xl px-3.5 py-2.5 flex gap-1 ${
                    script.turns[step].who === "ai"
                      ? "bg-background border border-border"
                      : "bg-foreground"
                  }`}
                >
                  <Dot delay={0} dark={script.turns[step].who !== "ai"} />
                  <Dot delay={0.15} dark={script.turns[step].who !== "ai"} />
                  <Dot delay={0.3} dark={script.turns[step].who !== "ai"} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-border/60 flex items-center justify-between bg-surface/60">
          <span className="text-[11px] text-muted-foreground">Simulated demo · loops automatically</span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Live
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function Dot({ delay, dark }: { delay: number; dark?: boolean }) {
  return (
    <motion.span
      className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-background/70" : "bg-muted-foreground/60"}`}
      animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 0.9, repeat: Infinity, delay }}
    />
  );
}

function LanguagePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Language"
      className="flex items-center gap-0.5 rounded-full bg-surface border border-border p-0.5"
    >
      {scripts.map((s) => {
        const active = s.code === value;
        return (
          <button
            key={s.code}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(s.code)}
            className={`px-2.5 h-7 rounded-full text-[11px] font-medium tracking-wide transition-colors ${
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

function StageTracker({ current }: { current: number }) {
  return (
    <div className="px-4 pt-3 pb-3 border-b border-border/60 bg-background/50">
      <div className="flex items-center justify-between gap-1">
        {stages.map((s, i) => {
          const active = i <= current;
          const isCurrent = i === current;
          const Icon = s.icon;
          return (
            <div key={s.key} className="flex-1 flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  scale: isCurrent ? 1.05 : 1,
                  backgroundColor: active ? "var(--foreground)" : "transparent",
                  color: active ? "var(--background)" : "var(--muted-foreground)",
                  borderColor: active ? "var(--foreground)" : "var(--border)",
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="h-6 w-6 rounded-full grid place-items-center border"
              >
                <Icon className="h-3 w-3" />
              </motion.div>
              <span
                className={`text-[9.5px] uppercase tracking-[0.12em] font-medium transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground/70"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
