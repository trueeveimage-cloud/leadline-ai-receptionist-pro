import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

type Props = {
  children: ReactNode;
  offset?: number; // px range
  className?: string;
};

/** Subtle scroll-linked parallax — moves child up to ±offset px as the element traverses the viewport. */
export function Parallax({ children, offset = 40, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y, willChange: "transform" }}>
        {children}
      </motion.div>
    </div>
  );
}
