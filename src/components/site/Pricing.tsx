import { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialogs } from "./DialogsProvider";
import { useIsMobile } from "@/hooks/use-mobile";

const ease = [0.22, 1, 0.36, 1] as const;

const plans = [
  {
    name: "Pilot",
    price: "2,900",
    currency: "kr",
    cadence: "/ month",
    note: "+ 2,000 kr setup",
    features: ["AI receptionist", "Call summaries", "Email handoff", "Standard voice"],
    featured: false,
  },
  {
    name: "Premium",
    price: "4,900",
    currency: "kr",
    cadence: "/ month",
    note: "Setup included",
    features: [
      "Booking requests",
      "Call summaries",
      "Priority transfer",
      "Custom voice",
      "Dedicated onboarding",
    ],
    featured: true,
  },
];

function TiltCard({
  children,
  className,
  enabled,
}: {
  children: React.ReactNode;
  className?: string;
  enabled: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 150, damping: 18 });
  const glareX = useTransform(x, [-0.5, 0.5], ["20%", "80%"]);
  const glareY = useTransform(y, [-0.5, 0.5], ["20%", "80%"]);
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(40% 40% at ${gx} ${gy}, rgba(255,255,255,0.35), transparent 70%)`,
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        if (!enabled || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={
        enabled
          ? { rotateX: rx, rotateY: ry, transformPerspective: 1200, transformStyle: "preserve-3d" }
          : undefined
      }
      className={className}
    >
      {enabled && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
          style={{ background: glareBg }}
        />
      )}
      {children}
    </motion.div>
  );
}

export function Pricing() {
  const { openBooking } = useDialogs();
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const noParallax = reduce || isMobile;
  const sectionRef = useRef<HTMLElement>(null);
  const [hoverDesktop, setHoverDesktop] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const ghostY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const ghostX = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const ghostRot = useTransform(scrollYProgress, [0, 1], [-3, 3]);
  const ghostScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.95]);
  const gridY = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);

  return (
    <section
      id="pricing"
      ref={sectionRef}
      onMouseEnter={() => setHoverDesktop(true)}
      onMouseLeave={() => setHoverDesktop(false)}
      className="relative py-20 md:py-40 overflow-hidden"
    >
      {!noParallax && (
        <motion.div
          aria-hidden
          style={{ y: ghostY, x: ghostX, rotate: ghostRot, scale: ghostScale }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <span className="select-none font-extralight tracking-tighter text-[28vw] leading-none text-foreground/[0.025]">
            0%
          </span>
        </motion.div>
      )}

      {!noParallax && (
        <motion.div
          aria-hidden
          style={{ y: gridY }}
          className="pointer-events-none absolute inset-x-0 -inset-y-1/3 opacity-[0.05]"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </motion.div>
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(40% 50% at 80% 20%, var(--foreground) 0%, transparent 60%), radial-gradient(45% 55% at 15% 90%, var(--foreground) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-5 md:px-6">
        <div className="flex items-center gap-3 mb-8 md:mb-14">
          <span className="h-px w-8 bg-foreground/30" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-medium">
            Pricing
          </span>
        </div>

        <h2 className="text-3xl md:text-6xl font-extralight tracking-tight max-w-2xl leading-[1.05]">
          Two ways to begin.
          <br />
          <span className="italic font-extralight text-foreground/40">Both unforgettable.</span>
        </h2>

        <div className="mt-10 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-px md:bg-border/60 [perspective:1200px]">
          {plans.map((p) => (
            <div key={p.name}>
              <TiltCard
                enabled={!noParallax && p.featured && hoverDesktop}
                className={`relative overflow-hidden p-6 md:p-12 border md:border-0 border-border/70 transition-colors duration-500 ${
                  p.featured
                    ? "bg-foreground text-background"
                    : "bg-background hover:bg-card"
                }`}
              >
                {p.featured && (
                  <span className="absolute top-5 right-5 md:top-8 md:right-8 text-[9px] uppercase tracking-[0.4em] text-background/60">
                    Recommended
                  </span>
                )}

                <div className="flex items-center gap-3 relative">
                  <span className="h-px w-6 bg-current opacity-40" />
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-medium">{p.name}</h3>
                </div>

                <div className="mt-6 md:mt-10 flex items-baseline gap-2 relative flex-wrap">
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
                  className={`mt-2 text-xs relative ${
                    p.featured ? "text-background/50" : "text-muted-foreground"
                  }`}
                >
                  {p.note}
                </p>

                <div className={`my-6 md:my-10 h-px ${p.featured ? "bg-background/15" : "bg-border"}`} />

                <ul className="space-y-3 md:space-y-4 relative">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-4 text-[13px] md:text-sm font-light"
                    >
                      <span
                        className={`h-px w-4 shrink-0 ${
                          p.featured ? "bg-background/40" : "bg-foreground/30"
                        }`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 md:mt-12 relative">
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
              </TiltCard>
            </div>
          ))}
        </div>

        {/* Premium mobile-only book demo */}
        <div className="md:hidden mt-8">
          <Button
            size="lg"
            variant="brand"
            onClick={openBooking}
            className="w-full rounded-full h-14 text-[13px] uppercase tracking-[0.2em] font-semibold shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)]"
          >
            Book demo
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-6 md:mt-8 text-[11px] uppercase tracking-[0.3em] text-muted-foreground text-center">
          Cancel anytime · Live in 7 days
        </p>
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease }}
        aria-hidden
        className="hidden"
      />
    </section>
  );
}
