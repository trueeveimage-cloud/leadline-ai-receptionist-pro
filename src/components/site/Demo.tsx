import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Radio } from "lucide-react";
import { useDialogs } from "./DialogsProvider";
import { ConversationPreview } from "./ConversationPreview";

const ease = [0.22, 1, 0.36, 1] as const;

export function Demo() {
  const { openBooking } = useDialogs();
  return (
    <section
      id="demo"
      className="relative overflow-hidden py-20 md:py-32 bg-[#0a0a0a] text-[#f5f3ee]"
    >
      {/* Theatrical backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,255,255,0.6), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 grid lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-20 items-center">
        <div className="text-left">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.04] px-3 py-1.5 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            <span className="text-[10px] uppercase tracking-[0.28em] text-white/70">
              On air · live demo
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease, delay: 0.05 }}
            className="mt-6 text-4xl md:text-6xl lg:text-7xl font-extralight tracking-tight leading-[0.95]"
          >
            Hear it{" "}
            <span className="font-serif italic text-white/95">breathe.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease, delay: 0.12 }}
            className="mt-6 text-base md:text-lg leading-relaxed text-white/60 max-w-md"
          >
            A real call. A real booking. Switch languages mid-stream and watch
            it follow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row gap-3"
          >
            <Button
              size="lg"
              onClick={() => openBooking()}
              className="rounded-none bg-white text-black hover:bg-white/90 px-8 text-[11px] font-semibold uppercase tracking-[0.2em]"
            >
              Book setup call
            </Button>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center border border-white/20 px-8 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white/80 hover:text-white hover:border-white/40 transition-colors"
            >
              <Radio className="h-3.5 w-3.5 mr-2" />
              See pricing
            </a>
          </motion.div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/50">
            {["No setup required", "Works with your number", "Live in 7 days"].map(
              (t) => (
                <span key={t} className="inline-flex items-center gap-2">
                  <Check className="h-3 w-3 text-white/70" /> {t}
                </span>
              )
            )}
          </div>
        </div>
        <ConversationPreview />
      </div>
    </section>
  );
}
