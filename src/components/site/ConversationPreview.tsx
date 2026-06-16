import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarCheck, CheckCircle2, Mail, Phone, PhoneIncoming, Sparkles } from "lucide-react";

const stageIcons = [
  { key: "incoming", icon: PhoneIncoming },
  { key: "answered", icon: Phone },
  { key: "qualifying", icon: Sparkles },
  { key: "booking", icon: CalendarCheck },
  { key: "summary", icon: Mail },
] as const;

const stageLabels: Record<string, string[]> = {
  sv: ["Ring", "Svar", "Frågor", "Lead", "Skickat"],
  en: ["Ring", "Answer", "Questions", "Lead", "Sent"],
  es: ["Ring", "Contesta", "Preguntas", "Lead", "Enviado"],
};

const turnStage = [1, 1, 2, 2, 2, 3, 3, 4];

type Turn = {
  who: "ai" | "caller";
  text: string;
  meta?: { icon: React.ComponentType<{ className?: string }>; label: string };
};

type Script = { code: string; label: string; turns: Turn[] };

const scripts: Script[] = [
  {
    code: "sv",
    label: "SV",
    turns: [
      {
        who: "ai",
        text: "Hej, vad behöver du hjälp med?",
        meta: { icon: Sparkles, label: "Svarade - 0,4s" },
      },
      { who: "caller", text: "Det läcker vatten under diskbänken och jag behöver hjälp snabbt." },
      { who: "ai", text: "Jag förstår. Kan jag ta ditt namn, telefonnummer och adress?" },
      { who: "caller", text: "Johan Andersson, 07X XXX XX XX, centrala Göteborg." },
      {
        who: "ai",
        text: "Tack. När vill du helst bli uppringd?",
        meta: { icon: CheckCircle2, label: "Akut intent" },
      },
      { who: "caller", text: "Så snart som möjligt." },
      {
        who: "ai",
        text: "Då skickar jag detta till ägaren för bekräftelse.",
        meta: { icon: CalendarCheck, label: "Förfrågan fångad" },
      },
      {
        who: "ai",
        text: "Sammanfattningen är skickad. Ha en fin dag.",
        meta: { icon: Mail, label: "Sammanfattning skickad" },
      },
    ],
  },
  {
    code: "en",
    label: "EN",
    turns: [
      {
        who: "ai",
        text: "Thanks for calling. What do you need help with?",
        meta: { icon: Sparkles, label: "Answered - 0.4s" },
      },
      { who: "caller", text: "There is water leaking under the sink. I need help fast." },
      { who: "ai", text: "I understand. Can I take your name, phone number and address?" },
      { who: "caller", text: "Johan Andersson, 07X XXX XX XX, central Gothenburg." },
      {
        who: "ai",
        text: "Thank you. When would you like to be called back?",
        meta: { icon: CheckCircle2, label: "Urgent intent" },
      },
      { who: "caller", text: "As soon as possible." },
      {
        who: "ai",
        text: "Got it. I will send this to the owner for confirmation.",
        meta: { icon: CalendarCheck, label: "Request captured" },
      },
      {
        who: "ai",
        text: "Summary sent to the owner. Have a lovely day.",
        meta: { icon: Mail, label: "Summary delivered" },
      },
    ],
  },
  {
    code: "es",
    label: "ES",
    turns: [
      {
        who: "ai",
        text: "Hola, ¿en qué puedo ayudarle?",
        meta: { icon: Sparkles, label: "Atendido - 0,4s" },
      },
      { who: "caller", text: "Hay una fuga de agua bajo el fregadero y necesito ayuda rápido." },
      { who: "ai", text: "Entiendo. ¿Puedo tomar su nombre, teléfono y dirección?" },
      { who: "caller", text: "Johan Andersson, 07X XXX XX XX, centro de Gotemburgo." },
      {
        who: "ai",
        text: "Gracias. ¿Cuándo prefiere que le llamen?",
        meta: { icon: CheckCircle2, label: "Intención urgente" },
      },
      { who: "caller", text: "Lo antes posible." },
      {
        who: "ai",
        text: "Perfecto. Envío esto al dueño para confirmar.",
        meta: { icon: CalendarCheck, label: "Solicitud capturada" },
      },
      {
        who: "ai",
        text: "Resumen enviado. Que tenga buen día.",
        meta: { icon: Mail, label: "Resumen enviado" },
      },
    ],
  },
];

const STEP_MS = 1900;
const RESET_PAUSE_MS = 2600;

export function ConversationPreview() {
  const [langCode, setLangCode] = useState("sv");
  const [step, setStep] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const reduce = useReducedMotion();
  const script = useMemo(
    () => scripts.find((item) => item.code === langCode) ?? scripts[0],
    [langCode],
  );

  useEffect(() => {
    setStep(0);
    setSeconds(0);
  }, [langCode]);

  useEffect(() => {
    if (reduce) {
      setStep(script.turns.length);
      return;
    }
    const done = step >= script.turns.length;
    const delay = done ? RESET_PAUSE_MS : STEP_MS;
    const timer = window.setTimeout(() => {
      setStep((current) => (current >= script.turns.length ? 0 : current + 1));
    }, delay);
    return () => window.clearTimeout(timer);
  }, [reduce, script.turns.length, step]);

  useEffect(() => {
    const id = window.setInterval(() => setSeconds((current) => current + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const visible = script.turns.slice(0, step);
  const currentStage = step === 0 ? 0 : turnStage[Math.min(step - 1, turnStage.length - 1)];
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-md"
    >
      <div
        aria-hidden
        className="absolute -inset-16 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 30%, rgba(255,255,255,0.15), transparent 70%)",
        }}
      />

      <div className="relative overflow-hidden border border-white/10 bg-[#0f0f0f] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-black/40 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          <span>● REC</span>
          <span className="tabular-nums text-white/70">
            {mm}:{ss}
          </span>
          <LanguagePicker value={langCode} onChange={setLangCode} />
        </div>

        <div className="flex items-center gap-4 border-b border-white/[0.06] px-5 pb-4 pt-5">
          <div className="relative">
            <div className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-gradient-to-br from-white/20 to-white/5">
              <Phone className="h-4 w-4 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0f0f0f] bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-white">Leadmap sample call</p>
            <p className="font-mono text-[11px] text-white/40">+46 07X XXX XX XX</p>
          </div>
          <Waveform paused={Boolean(reduce)} />
        </div>

        <StageTracker current={currentStage} langCode={langCode} />

        <div className="flex h-[320px] flex-col justify-end overflow-hidden bg-gradient-to-b from-black/30 to-black/60 px-4 py-4">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((turn, index) => (
              <motion.div
                key={`${script.code}-${index}`}
                layout
                initial={
                  reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.96, filter: "blur(4px)" }
                }
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className={`mb-2.5 flex ${turn.who === "ai" ? "justify-start" : "justify-end"}`}
              >
                <div className={`max-w-[82%] ${turn.who === "ai" ? "" : "text-right"}`}>
                  <div className="mb-1 px-1 text-[9px] uppercase tracking-[0.2em] text-white/30">
                    {turn.who === "ai" ? "Leadmap AI" : "Caller"}
                  </div>
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-snug ${
                      turn.who === "ai"
                        ? "rounded-tl-sm border border-white/10 bg-white/[0.06] text-white/90"
                        : "rounded-tr-sm bg-white text-black shadow-lg"
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
            {step < script.turns.length && !reduce && (
              <motion.div
                key={`${script.code}-typing`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`flex ${script.turns[step].who === "ai" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`flex gap-1 rounded-2xl px-3.5 py-2.5 ${
                    script.turns[step].who === "ai"
                      ? "border border-white/10 bg-white/[0.06]"
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

        <div className="flex items-center justify-between border-t border-white/[0.06] bg-black/50 px-5 py-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            Sample call - no audio
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            Live
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function Waveform({ paused }: { paused: boolean }) {
  return (
    <div className="flex h-8 items-center gap-0.5">
      {Array.from({ length: 14 }).map((_, index) => (
        <motion.span
          key={index}
          className="w-0.5 rounded-full bg-white/60"
          animate={paused ? undefined : { height: ["20%", "90%", "40%", "70%", "25%"] }}
          transition={{
            duration: 1.2 + (index % 4) * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.07,
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

function LanguagePicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div
      role="tablist"
      aria-label="Language"
      className="flex items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.05] p-0.5"
    >
      {scripts.map((script) => {
        const active = script.code === value;
        return (
          <button
            key={script.code}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(script.code)}
            className={`h-5 rounded-full px-2 text-[9px] font-semibold tracking-[0.15em] transition-colors ${
              active ? "bg-white text-black" : "text-white/50 hover:text-white"
            }`}
          >
            {script.label}
          </button>
        );
      })}
    </div>
  );
}

function StageTracker({ current, langCode }: { current: number; langCode: string }) {
  const labels = stageLabels[langCode] ?? stageLabels.sv;
  return (
    <div className="border-b border-white/[0.06] bg-black/30 px-4 py-3">
      <div className="flex items-center justify-between gap-1">
        {stageIcons.map((stage, index) => {
          const active = index <= current;
          const isCurrent = index === current;
          const Icon = stage.icon;
          return (
            <div key={stage.key} className="flex flex-1 flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor: active ? "rgba(255,255,255,0.95)" : "transparent",
                  color: active ? "#000" : "rgba(255,255,255,0.4)",
                  borderColor: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.15)",
                  boxShadow: isCurrent ? "0 0 16px rgba(255,255,255,0.5)" : "0 0 0 rgba(0,0,0,0)",
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="grid h-6 w-6 place-items-center rounded-full border"
              >
                <Icon className="h-3 w-3" />
              </motion.div>
              <span
                className={`text-[8.5px] font-medium uppercase tracking-[0.18em] transition-colors ${active ? "text-white/80" : "text-white/30"}`}
              >
                {labels[index]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
