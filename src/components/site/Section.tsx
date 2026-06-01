import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export function Section({
  id,
  eyebrow,
  title,
  children,
  muted = false,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <section
      id={id}
      className={`py-16 md:py-28 ${muted ? "bg-surface" : ""}`}
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease }}
          className="max-w-2xl"
        >
          {eyebrow && (
            <p className="text-xs uppercase tracking-[0.18em] text-brand mb-4">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
            {title}
          </h2>
        </motion.div>
        <div className="mt-14 md:mt-20">{children}</div>
      </div>
    </section>
  );
}

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};
