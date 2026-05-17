import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const ease = [0.22, 1, 0.36, 1] as const;

export function FinalCTA() {
  return (
    <section className="py-28 md:py-40">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="rounded-[2rem] bg-foreground text-background px-8 md:px-16 py-20 md:py-28 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 -z-0 opacity-[0.06]"
            style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 80%, white 0, transparent 40%)" }}
          />
          <h2 className="relative text-3xl md:text-5xl font-semibold tracking-tight max-w-2xl mx-auto">
            Turn missed calls into booked customers.
          </h2>
          <div className="relative mt-10 flex justify-center">
            <Button asChild size="lg" variant="soft" className="bg-background text-foreground hover:bg-background/90">
              <a href="#demo">Book demo</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-14 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand" />
            <span className="font-semibold tracking-tight">Leadline AI</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            AI receptionists for high-value businesses.
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Leadline AI
        </div>
      </div>
    </footer>
  );
}
