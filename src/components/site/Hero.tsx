import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useDialogs } from "./DialogsProvider";
import { useI18n } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

// Paper & Ink palette — scoped to the hero so the rest of the dark site is untouched.
const PAPER = "#f5f3ee";
const SURFACE = "#e8e4dd";
const INK = "#2d2d2d";
const DEEP = "#0d0d0d";

const serif = "'Instrument Serif', 'Newsreader', ui-serif, Georgia, serif";
const sans = "'Work Sans', 'Instrument Sans', ui-sans-serif, system-ui, sans-serif";

export function Hero() {
  const { openBooking, openTestAI } = useDialogs();
  const reduce = useReducedMotion();
  const { t } = useI18n();

  const fade = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease, delay },
  });

  return (
    <section
      id="top"
      style={{ backgroundColor: PAPER, color: INK, fontFamily: sans }}
      className="relative overflow-hidden border-b border-black/5"
    >
      {/* Dark band sized to the fixed nav so the logo/menu read on the paper background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-16"
        style={{ backgroundColor: DEEP }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-16 h-10"
        style={{
          background: `linear-gradient(to bottom, ${DEEP}, transparent)`,
        }}
      />

      <div className="relative mx-auto flex min-h-[88svh] max-w-[520px] flex-col items-center px-6 pb-16 pt-28 text-center sm:max-w-2xl sm:pt-32 md:min-h-[92svh] md:pt-36">
        {/* Eyebrow */}
        <motion.p
          {...fade(0)}
          className="text-[10px] font-medium uppercase tracking-[0.24em] sm:text-[11px]"
          style={{ color: `${INK}99` }}
        >
          {t("hero.badge")}
        </motion.p>

        {/* Hairline rule */}
        <motion.span
          aria-hidden
          {...fade(0.05)}
          className="mt-6 block h-px w-10"
          style={{ backgroundColor: `${INK}33` }}
        />

        {/* Headline */}
        <motion.h1
          {...fade(0.1)}
          className="mt-8 text-balance text-[44px] leading-[1.02] tracking-tight sm:text-[64px] md:text-[80px]"
          style={{ fontFamily: serif, color: DEEP, fontWeight: 400 }}
        >
          AI receptionist for{" "}
          <span style={{ fontStyle: "italic" }}>missed</span> calls.
        </motion.h1>

        {/* Supporting copy */}
        <motion.p
          {...fade(0.18)}
          className="mt-6 max-w-[34ch] text-[15px] font-light leading-relaxed sm:text-[17px]"
          style={{ color: `${INK}cc` }}
        >
          Leadmap answers, qualifies, and summarizes customer calls when your
          team is busy or closed.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fade(0.26)}
          className="mt-10 flex w-full max-w-sm flex-col items-stretch gap-3"
        >
          <button
            onClick={openBooking}
            className="group inline-flex w-full items-center justify-center px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.22em] transition-transform active:scale-[0.98]"
            style={{ backgroundColor: DEEP, color: PAPER }}
          >
            {t("hero.cta.book")}
          </button>
          <button
            onClick={openTestAI}
            className="group inline-flex w-full items-center justify-center gap-2 px-2 py-3 text-[12px] font-semibold uppercase tracking-[0.22em] transition-opacity hover:opacity-70"
            style={{ color: DEEP }}
          >
            <span>Test the AI</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* Stat strip */}
        <motion.dl
          {...fade(0.38)}
          className="mt-14 grid w-full max-w-md grid-cols-3 border-t pt-6 sm:mt-20"
          style={{ borderColor: SURFACE }}
        >
          {[
            ["24/7", "Pickup"],
            ["7 days", "Pilot setup"],
            ["EU", "Summaries"],
          ].map(([value, label], i) => (
            <div
              key={label}
              className="flex flex-col items-center px-2"
              style={{
                borderLeft: i === 0 ? "none" : `1px solid ${SURFACE}`,
              }}
            >
              <dt
                className="text-[22px] leading-none sm:text-[26px]"
                style={{ fontFamily: serif, color: DEEP }}
              >
                {value}
              </dt>
              <dd
                className="mt-2 text-[9px] font-semibold uppercase tracking-[0.18em] sm:text-[10px]"
                style={{ color: `${INK}80` }}
              >
                {label}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
