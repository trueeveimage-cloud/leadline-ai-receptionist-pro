import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Phone,
  Sparkles,
  CheckCircle2,
  CalendarCheck,
  Mail,
  PhoneIncoming,
} from "lucide-react";

const stages = [
  { key: "incoming", label: "Ring", icon: PhoneIncoming },
  { key: "answered", label: "Answer", icon: Phone },
  { key: "qualifying", label: "Qualify", icon: Sparkles },
  { key: "booking", label: "Book", icon: CalendarCheck },
  { key: "summary", label: "Send", icon: Mail },
] as const;

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
      { who: "ai", text: "Lovely. Tuesday 10:30 or Thursday 14:00?", meta: { icon: CheckCircle2, label: "High intent" } },
      { who: "caller", text: "Tuesday works." },
      { who: "ai", text: "Got it — I'll pass this to the owner to confirm.", meta: { icon: CalendarCheck, label: "Booking · Tue 10:30" } },
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
      { who: "ai", text: "Tack — jag skickar förfrågan till ägaren.", meta: { icon: CalendarCheck, label: "Bokning · tis 10:30" } },
      { who: "ai", text: "Sammanfattning skickad. Ha en fin dag.", meta: { icon: Mail, label: "Sammanfattning skickad" } },
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
      { who: "ai", text: "Perfecto — paso la solicitud al propietario.", meta: { icon: CalendarCheck, label: "Reserva · mar 10:30" } },
      { who: "ai", text: "Resumen enviado. Buen día.", meta: { icon: Mail, label: "Resumen enviado" } },
    ],
  },
];

const STEP_MS = 1900;
const RESET_PAUSE_MS = 2600;

export function ConversationPreview() {
  const [langCode, setLangCode] = useState("en");
  const [step, setStep] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const reduce = useReducedMotion();
  const script = useMemo(
    () => scripts.find((s) => s.code === langCode) ?? scripts[0],
    [langCode]
  );

  useEffect(() => {
    setStep(0);
    setSeconds(0);
  }, [langCode]);

  useEffect(() => {
    const total = script.turns.length;
    const done = step >= total;
    const delay = done ? RESET_PAUSE_MS : STEP_MS;
    const t = setTimeout(() => {
      setStep((s) => (s >= total ? 0 : s + 1));
    }, delay);
    return () => clearTimeout(t);
  }, [step, script]);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [langCode]);

  const visible = script.turns.slice(0, step);
  const currentStage =
    step === 0 ? 0 : turnStage[Math.min(step - 1, turnStage.length - 1)];
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="relative mx-auto w-full max-w-md"
    >
      {/* Spotlight glow */}
      <div
        aria-hidden
        className="absolute -inset-16 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 30%, rgba(255,255,255,0.15), transparent 70%)",
        }}
      />
      {/* Pulsing rings behind */}
      <div className="pointer-events-none absolute left-1/2 top-12 -z-10 -translate-x-1/2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
            style={{ width: 80, height: 80 }}
            animate={{ scale: [1, 4], opacity: [0.6, 0] }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              delay: i * 1.1,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <div className="relative border border-white/10 bg-[#0f0f0f] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Top status bar */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/[0.06] bg-black/40 text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono">
          <span>● REC</span>
          <span className="tabular-nums text-white/70">
            {mm}:{ss}
          </span>
          <LanguagePicker value={langCode} onChange={setLangCode} />
        </div>

        {/* Caller card */}
        <div className="px-5 pt-5 pb-4 flex items-center gap-4 border-b border-white/[0.06]">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-white/20 to-white/5 grid place-items-center border border-white/15">
              <Phone className="h-4 w-4 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#0f0f0f] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-white">Aurora Clinic</p>
            <p className="text-[11px] text-white/40 font-mono">
              +46 ·· ··· ·· 47
            </p>
          </div>
          <Waveform />
        </div>

        <StageTracker current={currentStage} />

        {/* Conversation */}
        <div className="px-4 py-4 h-[320px] overflow-hidden bg-gradient-to-b from-black/30 to-black/60 flex flex-col justify-end">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((turn, i) => (
              <motion.div
                key={`${script.code}-${i}`}
                layout
                initial={
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, y: 18, scale: 0.96, filter: "blur(4px)" }
                }
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className={`flex mb-2.5 ${turn.who === "ai" ? "justify-start" : "justify-end"}`}
              >
                <div className={`max-w-[82%] ${turn.who === "ai" ? "" : "text-right"}`}>
                  <div className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-1 px-1">
                    {turn.who === "ai" ? "Ada · AI" : "Caller"}
                  </div>
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-snug ${
                      turn.who === "ai"
                        ? "bg-white/[0.06] border border-white/10 text-white/90 rounded-tl-sm"
                        : "bg-white text-black rounded-tr-sm shadow-lg"
                    }`}
                  >
                    {turn.text}
                    {turn.meta && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-emerald-300/90">
                        <turn.meta.icon className="h-3 w-3" />
                        {turn.meta.label}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            {step < script.turns.length && (
              <motion.div
                key={`${script.code}-typing`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`flex ${script.turns[step].who === "ai" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`rounded-2xl px-3.5 py-2.5 flex gap-1 ${
                    script.turns[step].who === "ai"
                      ? "bg-white/[0.06] border border-white/10"
                      : "bg-white"
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
        <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between bg-black/50">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
            Simulated · No audio
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-red-400 uppercase tracking-[0.2em]">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            Live
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function Waveform() {
  // 12 animated bars
  const bars = Array.from({ length: 14 });
  return (
    <div className="flex items-center gap-0.5 h-8">
      {bars.map((_, i) => (
        <motion.span
          key={i}
          className="w-0.5 rounded-full bg-white/60"
          animate={{
            height: ["20%", "90%", "40%", "70%", "25%"],
          }}
          transition={{
            duration: 1.2 + (i % 4) * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.07,
          }}
          style={{ height: "30%" }}
        />
      ))}
    </div>
  );
}

function Dot({ delay, dark }: { delay: number; dark?: boolean }) {
  return (
    <motion.span
      className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-black/60" : "bg-white/60"}`}
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
      className="flex items-center gap-0.5 rounded-full bg-white/[0.05] border border-white/10 p-0.5"
    >
      {scripts.map((s) => {
        const active = s.code === value;
        return (
          <button
            key={s.code}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(s.code)}
            className={`px-2 h-5 rounded-full text-[9px] font-semibold tracking-[0.15em] transition-colors ${
              active
                ? "bg-white text-black"
                : "text-white/50 hover:text-white"
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
    <div className="px-4 py-3 border-b border-white/[0.06] bg-black/30">
      <div className="flex items-center justify-between gap-1">
        {stages.map((s, i) => {
          const active = i <= current;
          const isCurrent = i === current;
          const Icon = s.icon;
          return (
            <div key={s.key} className="flex-1 flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor: active ? "rgba(255,255,255,0.95)" : "transparent",
                  color: active ? "#000" : "rgba(255,255,255,0.4)",
                  borderColor: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.15)",
                  boxShadow: isCurrent
                    ? "0 0 16px rgba(255,255,255,0.5)"
                    : "0 0 0 rgba(0,0,0,0)",
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="h-6 w-6 rounded-full grid place-items-center border"
              >
                <Icon className="h-3 w-3" />
              </motion.div>
              <span
                className={`text-[8.5px] uppercase tracking-[0.18em] font-medium transition-colors ${
                  active ? "text-white/80" : "text-white/30"
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
