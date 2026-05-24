import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

export function Process() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLLIElement | null>>([]);

  const steps = [
    { num: "01", title: t("step.1"), desc: t("step.1.desc") },
    { num: "02", title: t("step.2"), desc: t("step.2.desc") },
    { num: "03", title: t("step.3"), desc: t("step.3.desc") },
  ];

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        // pick the most-visible entry
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = Number((visible.target as HTMLElement).dataset.idx);
          setActive(idx);
        }
      },
      {
        // trigger when step is roughly centered
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="how"
      className="relative border-y border-border/60 overflow-hidden"
    >
      {/* ambient parallax glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 50% 40%, var(--foreground) 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="flex items-center gap-3 mb-12 md:mb-16"
        >
          <span className="h-px w-8 bg-foreground/30" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-medium">
            How it works
          </span>
        </motion.div>

        <ol className="grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-border/40">
          {steps.map((s, i) => {
            const isActive = active === i;
            return (
              <li
                key={s.num}
                data-idx={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className={`group relative md:px-8 first:md:pl-0 last:md:pr-0 py-8 md:py-2 ${
                  i < steps.length - 1
                    ? "border-b border-border/40 md:border-b-0"
                    : ""
                }`}
              >
                {/* active rail – left on mobile, top on desktop */}
                <span
                  aria-hidden
                  className={`absolute left-0 top-0 h-full w-px bg-foreground md:hidden transition-all duration-700 ease-out ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
                <span
                  aria-hidden
                  className={`hidden md:block absolute left-0 -top-px h-px bg-foreground transition-all duration-700 ease-out ${
                    isActive ? "w-12 opacity-100" : "w-0 opacity-0"
                  }`}
                />

                <div
                  className={`pl-5 md:pl-0 transition-all duration-700 ease-out ${
                    isActive
                      ? "opacity-100 translate-x-0"
                      : "opacity-60 md:opacity-40"
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
                          ? "w-10 bg-foreground/60"
                          : "w-4 bg-foreground/20"
                      }`}
                    />
                  </div>
                  <h3 className="mt-5 text-3xl md:text-4xl font-extralight tracking-tight">
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
      </div>
    </section>
  );
}
