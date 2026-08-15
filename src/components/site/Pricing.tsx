import { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { useDialogs } from "./DialogsProvider";
import { useI18n } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

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
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 150, damping: 18 });
  const glareX = useTransform(x, [-0.5, 0.5], ["20%", "80%"]);
  const glareY = useTransform(y, [-0.5, 0.5], ["20%", "80%"]);
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(40% 40% at ${gx} ${gy}, color-mix(in oklch, var(--background) 62%, transparent), transparent 70%)`,
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
          className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
          style={{ background: glareBg }}
        />
      )}
      {children}
    </motion.div>
  );
}

export function Pricing() {
  const { openBooking, openTestAI } = useDialogs();
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const noParallax = reduce;
  const sectionRef = useRef<HTMLElement>(null);
  const [hoverDesktop, setHoverDesktop] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const gridY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  const plans = [
    {
      key: "pilot" as const,
      name: t("pricing.pilot.name"),
      price: t("pricing.pilot.price"),
      currency: t("pricing.pilot.currency"),
      note: t("pricing.pilot.note"),
      sub: t("pricing.pilot.sub"),
      features: [
        t("pricing.pilot.f1"),
        t("pricing.pilot.f2"),
        t("pricing.pilot.f3"),
        t("pricing.pilot.f4"),
        t("pricing.pilot.f5"),
      ],
      featured: false,
    },
    {
      key: "premium" as const,
      name: t("pricing.premium.name"),
      price: t("pricing.premium.price"),
      currency: t("pricing.premium.currency"),
      note: t("pricing.premium.note"),
      sub: t("pricing.premium.sub"),
      features: [
        t("pricing.premium.f1"),
        t("pricing.premium.f2"),
        t("pricing.premium.f3"),
        t("pricing.premium.f4"),
        t("pricing.premium.f5"),
        t("pricing.premium.f6"),
      ],
      featured: true,
    },
  ];

  return (
    <section
      id="pricing"
      ref={sectionRef}
      onMouseEnter={() => setHoverDesktop(true)}
      onMouseLeave={() => setHoverDesktop(false)}
      className="relative py-16 md:py-32 overflow-hidden border-t border-border/60"
    >
      <motion.div
        aria-hidden
        style={noParallax ? undefined : { y: gridY }}
        className="pointer-events-none absolute inset-x-0 -inset-y-1/3 hidden opacity-[0.04] md:block"
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

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="flex items-center gap-3 mb-6 md:mb-12">
          <span className="h-px w-8 bg-foreground/30" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-medium">
            {t("pricing.eyebrow")}
          </span>
        </div>

        <h2 className="text-3xl md:text-5xl font-extralight tracking-normal max-w-2xl leading-[1.05]">
          {t("pricing.title.l1")}
          <br />
          <span className="italic font-extralight text-foreground/40">{t("pricing.title.l2")}</span>
        </h2>

        <div className="mt-6 md:mt-10 flex flex-wrap gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span>{t("pricing.bullet.1")}</span>
          <span className="opacity-30">·</span>
          <span>{t("pricing.bullet.3")}</span>
          <span className="opacity-30">·</span>
          <span>{t("pricing.bullet.4")}</span>
        </div>

        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-px md:bg-border/60 [perspective:1200px]">
          {plans.map((p) => (
            <TiltCard
              key={p.key}
              enabled={!noParallax && p.featured && hoverDesktop}
              className={`relative overflow-hidden p-6 md:p-10 border border-border/70 md:border-0 transition-colors duration-500 h-full flex flex-col ${
                p.featured
                  ? "bg-background md:bg-foreground md:text-background"
                  : "bg-background hover:bg-card"
              }`}
            >
              {p.featured && (
                <>
                  <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-brand" />
                  <span className="absolute top-4 right-4 md:top-8 md:right-8 text-[9px] uppercase tracking-[0.3em] md:tracking-[0.4em] bg-brand text-background px-2 py-0.5 md:px-2.5 md:py-1">
                    {t("pricing.popular")}
                  </span>
                </>
              )}

              <div className="flex items-center gap-3 relative">
                <span className="h-px w-5 md:w-6 bg-current opacity-40" />
                <h3 className="text-[10px] uppercase tracking-[0.4em] font-medium">{p.name}</h3>
              </div>

              <div className="mt-6 md:mt-10 flex items-baseline gap-2 relative flex-wrap">
                <span className="text-4xl md:text-6xl font-extralight tracking-tight tabular-nums">
                  {p.price}
                </span>
                <span
                  className={`text-xs md:text-sm font-light ${
                    p.featured
                      ? "text-muted-foreground md:text-background/60"
                      : "text-muted-foreground"
                  }`}
                >
                  {p.currency}
                  {t("pricing.month")}
                </span>
              </div>
              <p
                className={`mt-2 text-[11px] md:text-xs relative leading-snug ${
                  p.featured
                    ? "text-muted-foreground md:text-background/55"
                    : "text-muted-foreground"
                }`}
              >
                {p.note}
              </p>
              <p
                className={`mt-1 text-[11px] md:text-[12px] italic relative leading-snug ${
                  p.featured ? "text-foreground/60 md:text-background/65" : "text-foreground/60"
                }`}
              >
                {p.sub}
              </p>

              <div
                className={`my-6 md:my-10 h-px ${
                  p.featured ? "bg-border md:bg-background/15" : "bg-border"
                }`}
              />

              <ul className="space-y-2.5 md:space-y-4 relative flex-1">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 md:gap-4 text-[13px] md:text-sm font-light leading-snug"
                  >
                    <span
                      className={`mt-2 h-px w-3 md:w-4 shrink-0 ${
                        p.featured ? "bg-foreground/30 md:bg-background/40" : "bg-foreground/30"
                      }`}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 md:mt-12 relative">
                <Button
                  size="lg"
                  onClick={openBooking}
                  className={`w-full rounded-none uppercase tracking-[0.2em] text-[11px] font-semibold h-11 md:h-12 ${
                    p.featured
                      ? "bg-foreground text-background hover:bg-foreground/90 md:bg-background md:text-foreground md:hover:bg-background/90"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                >
                  {t("pricing.book")}
                </Button>
              </div>
            </TiltCard>
          ))}
        </div>

        <div className="mt-10 md:mt-14 flex flex-col items-center gap-4">
          <button
            onClick={openTestAI}
            className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] font-medium text-foreground hover:opacity-70 transition-opacity"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            <span>{t("pricing.testBefore")}</span>
          </button>
          <a
            href="/missade-samtal-audit?utm_source=pricing&utm_medium=cta&utm_campaign=free_audit"
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-8 transition-colors hover:text-foreground"
          >
            {t("audit.cta")}
          </a>
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground text-center">
            {t("pricing.footer")}
          </p>
        </div>
      </div>
    </section>
  );
}
