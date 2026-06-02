import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { ConversationPreview } from "./ConversationPreview";

const ease = [0.22, 1, 0.36, 1] as const;

export function Process() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const steps = [
    { num: "01", title: t("step.1"), desc: t("step.1.desc") },
    { num: "02", title: t("step.2"), desc: t("step.2.desc") },
    { num: "03", title: t("step.3"), desc: t("step.3.desc") },
  ];

  // Map scroll progress through the section to active step.
  // start of section reaches viewport center => progress 0
  // end of section reaches viewport center => progress 1
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 60%", "end 40%"],
  });
  const sweepX = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      // 0 - 0.33 => step 0, 0.33 - 0.66 => step 1, 0.66 - 1 => step 2
      const idx = v < 0.34 ? 0 : v < 0.67 ? 1 : 2;
      setActive(idx);
    });
    return () => unsub();
  }, [scrollYProgress]);


  return (
    <section
      id="how"
      ref={sectionRef}
      className="relative border-y border-border/60 overflow-hidden"
    >
      {/* ambient glow - desktop only */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 md:opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 50% 40%, var(--foreground) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-28">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="flex items-center gap-3 mb-10 md:mb-16"
        >
          <span className="h-px w-8 bg-foreground/30" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-medium">
            {t("process.eyebrow")}
          </span>
        </motion.div>

        {/* Desktop top progress rail */}
        <div className="hidden md:block relative mb-10">
          <div className="h-px w-full bg-border/60" />
          {!reduce && (
            <motion.div
              aria-hidden
              style={{ width: sweepX }}
              className="absolute left-0 top-0 h-px bg-foreground origin-left"
            />
          )}
          <div className="absolute inset-x-0 -top-1 grid grid-cols-3">
            {steps.map((_, i) => (
              <div key={i} className="flex justify-start">
                <span
                  className={`block h-2 w-2 rounded-full -translate-x-1/2 transition-all duration-500 ${
                    active >= i ? "bg-foreground scale-100" : "bg-border scale-75"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-border/40">
          {steps.map((s, i) => {
            const isActive = active === i;
            const isPast = active > i;
            return (
              <li
                key={s.num}
                data-idx={i}
                className={`group relative md:px-8 first:md:pl-0 last:md:pr-0 py-6 md:py-6 ${
                  i < steps.length - 1
                    ? "border-b border-border/40 md:border-b-0"
                    : ""
                }`}
              >
                {/* mobile left rail */}
                <span
                  aria-hidden
                  className={`absolute left-0 top-0 h-full w-px bg-foreground md:hidden transition-opacity duration-700 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
                {/* desktop card wash on active */}
                <span
                  aria-hidden
                  className={`hidden md:block absolute inset-0 -mx-2 rounded-2xl transition-all duration-700 ease-out ${
                    isActive
                      ? "bg-foreground/[0.035] scale-100 opacity-100"
                      : "bg-transparent scale-95 opacity-0"
                  }`}
                />

                <div
                  className={`relative pl-5 md:pl-0 transition-all duration-700 ease-out ${
                    isActive
                      ? "opacity-100 md:-translate-y-0.5"
                      : isPast
                        ? "opacity-70"
                        : "opacity-60 md:opacity-35"
                  }`}
                >
                  <div className="flex items-baseline gap-3">
                    <span
                      className={`text-[10px] uppercase tracking-[0.4em] font-medium transition-colors duration-500 ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {s.num}
                    </span>
                    <span
                      className={`h-px transition-all duration-700 ease-out ${
                        isActive
                          ? "w-14 bg-foreground"
                          : isPast
                            ? "w-8 bg-foreground/40"
                            : "w-4 bg-foreground/20"
                      }`}
                    />
                  </div>
                  <h3
                    className={`mt-4 text-2xl md:text-4xl font-extralight tracking-tight transition-colors duration-500 ${
                      isActive ? "text-foreground" : "text-foreground/70"
                    }`}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-3 text-[13px] md:text-sm text-muted-foreground leading-relaxed max-w-[28ch]">
                    {s.desc}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-14 md:mt-24">
          <div className="flex items-center gap-3 mb-8">
            <span className="h-px w-8 bg-foreground/30" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-medium">
              {t("process.demo")}
            </span>
          </div>
          <ConversationPreview />
        </div>
      </div>
    </section>
  );
}
