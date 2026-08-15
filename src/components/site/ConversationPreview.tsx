import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarCheck, CheckCircle2, Mail, Phone, PhoneIncoming, Sparkles } from "lucide-react";

type LanguageCode = "sv" | "en";
type Turn = {
  who: "ai" | "caller";
  text: string;
  meta?: { icon: React.ComponentType<{ className?: string }>; label: string };
};
type Script = { code: LanguageCode; label: string; callerLabel: string; turns: Turn[] };

const scripts: Script[] = [
  {
    code: "sv",
    label: "SV",
    callerLabel: "Kund",
    turns: [
      {
        who: "ai",
        text: "Tack för att du ringer VVS-exemplet. Du pratar med Leadmaps AI-receptionist. Hur kan jag hjälpa dig?",
        meta: { icon: Sparkles, label: "AI-receptionist" },
      },
      { who: "caller", text: "Det läcker under diskbänken och vattnet börjar sprida sig." },
      { who: "ai", text: "Har du kunnat stänga av vattnet, och vilken adress gäller det?" },
      { who: "caller", text: "Ja, vattnet är avstängt. Det är på Storgatan 14 i Solna." },
      { who: "ai", text: "Tack. Vilket nummer ska VVS-företaget ringa tillbaka på?" },
      { who: "caller", text: "070 000 00 47. Jag vill gärna bli uppringd så snart som möjligt." },
      {
        who: "ai",
        text: "Jag skickar en brådskande återkopplingsförfrågan nu. Företaget bekräftar själv nästa steg.",
        meta: { icon: CalendarCheck, label: "Manuell bekräftelse" },
      },
      {
        who: "ai",
        text: "Sammanfattningen är skickad till ansvarig. Tack för att du ringde.",
        meta: { icon: Mail, label: "Sammanfattning skickad" },
      },
    ],
  },
  {
    code: "en",
    label: "EN",
    callerLabel: "Caller",
    turns: [
      {
        who: "ai",
        text: "Thanks for calling the plumbing example. You're speaking with Leadmap's AI receptionist. How can I help?",
        meta: { icon: Sparkles, label: "AI receptionist" },
      },
      { who: "caller", text: "There's a leak under the kitchen sink and the water is spreading." },
      {
        who: "ai",
        text: "Have you been able to turn off the water, and what address is this for?",
      },
      { who: "caller", text: "Yes, the water is off. It's Storgatan 14 in Solna." },
      { who: "ai", text: "Thank you. What number should the plumber call back?" },
      { who: "caller", text: "+46 70 000 00 47. As soon as possible, please." },
      {
        who: "ai",
        text: "I'll send an urgent callback request now. The plumbing company will confirm the next step.",
        meta: { icon: CalendarCheck, label: "Manual confirmation" },
      },
      {
        who: "ai",
        text: "The summary has been sent to the owner. Thank you for calling.",
        meta: { icon: Mail, label: "Summary delivered" },
      },
    ],
  },
];

const turnStage = [1, 1, 2, 2, 2, 3, 3, 4];
const STEP_MS = 1_900;
const RESET_PAUSE_MS = 2_600;

export function ConversationPreview() {
  const [langCode, setLangCode] = useState<LanguageCode>("sv");
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();
  const script = useMemo(
    () => scripts.find((item) => item.code === langCode) || scripts[0],
    [langCode],
  );

  useEffect(() => setStep(0), [langCode]);
  useEffect(() => {
    const done = step >= script.turns.length;
    const timer = window.setTimeout(
      () => setStep((current) => (current >= script.turns.length ? 0 : current + 1)),
      done ? RESET_PAUSE_MS : STEP_MS,
    );
    return () => window.clearTimeout(timer);
  }, [script.turns.length, step]);

  const visible = script.turns.slice(0, step);
  const currentStage = step === 0 ? 0 : turnStage[Math.min(step - 1, turnStage.length - 1)];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-md"
    >
      <div className="relative overflow-hidden border border-white/10 bg-[#0f0f0f] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-black/40 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          <span>Demo</span>
          <span className="text-white/65">Simulerat VVS-samtal</span>
          <LanguagePicker value={langCode} onChange={setLangCode} />
        </div>

        <div className="flex items-center gap-4 border-b border-white/[0.06] px-5 py-4">
          <div className="relative grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-gradient-to-br from-white/20 to-white/5">
            <Phone className="h-4 w-4 text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0f0f0f] bg-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-white">VVS-exempel</p>
            <p className="font-mono text-[11px] text-white/40">+46 ·· ··· ·· 47</p>
          </div>
          <Waveform />
        </div>

        <StageTracker current={currentStage} language={langCode} />

        <div className="flex h-[340px] flex-col justify-end overflow-hidden bg-gradient-to-b from-black/30 to-black/60 px-4 py-4">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((turn, index) => (
              <motion.div
                key={`${script.code}-${index}`}
                layout
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`mb-2.5 flex ${turn.who === "ai" ? "justify-start" : "justify-end"}`}
              >
                <div className={`max-w-[84%] ${turn.who === "caller" ? "text-right" : ""}`}>
                  <div className="mb-1 px-1 text-[9px] uppercase tracking-[0.2em] text-white/30">
                    {turn.who === "ai" ? "Leadmap · AI" : script.callerLabel}
                  </div>
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-snug ${
                      turn.who === "ai"
                        ? "rounded-tl-sm border border-white/10 bg-white/[0.06] text-white/90"
                        : "rounded-tr-sm bg-white text-black"
                    }`}
                  >
                    {turn.text}
                    {turn.meta ? (
                      <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-emerald-300/90">
                        <turn.meta.icon className="h-3 w-3" />
                        {turn.meta.label}
                      </div>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.06] bg-black/50 px-5 py-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            Simulerat · inget ljud
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
            <CheckCircle2 className="h-3 w-3" /> Tydligt märkt demo
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function LanguagePicker({
  value,
  onChange,
}: {
  value: LanguageCode;
  onChange: (value: LanguageCode) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Språk"
      className="flex items-center gap-0.5 border border-white/10 bg-white/[0.05] p-0.5"
    >
      {scripts.map((item) => (
        <button
          key={item.code}
          type="button"
          role="tab"
          aria-selected={item.code === value}
          onClick={() => onChange(item.code)}
          className={`h-5 px-2 text-[9px] font-semibold tracking-[0.15em] ${
            item.code === value ? "bg-white text-black" : "text-white/50 hover:text-white"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function Waveform() {
  return (
    <div className="flex h-8 items-center gap-0.5" aria-hidden>
      {Array.from({ length: 12 }).map((_, index) => (
        <motion.span
          key={index}
          className="w-0.5 rounded-full bg-white/60"
          animate={{ height: ["20%", "85%", "35%", "65%", "25%"] }}
          transition={{ duration: 1.2 + (index % 4) * 0.2, repeat: Infinity, delay: index * 0.07 }}
        />
      ))}
    </div>
  );
}

function StageTracker({ current, language }: { current: number; language: LanguageCode }) {
  const labels =
    language === "sv"
      ? ["Ringer", "Svar", "Frågor", "Nästa steg", "Skickat"]
      : ["Ring", "Answer", "Qualify", "Next step", "Sent"];
  const icons = [PhoneIncoming, Phone, Sparkles, CalendarCheck, Mail];

  return (
    <div className="border-b border-white/[0.06] bg-black/30 px-4 py-3">
      <div className="flex items-center justify-between gap-1">
        {labels.map((label, index) => {
          const Icon = icons[index];
          const active = index <= current;
          return (
            <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
              <span
                className={`grid h-6 w-6 place-items-center rounded-full border ${
                  active ? "border-white bg-white text-black" : "border-white/15 text-white/35"
                }`}
              >
                <Icon className="h-3 w-3" />
              </span>
              <span
                className={`text-[8px] uppercase tracking-[0.12em] ${active ? "text-white/80" : "text-white/30"}`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
