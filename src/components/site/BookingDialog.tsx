import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
  company: z.string().trim().min(1, "Required").max(120),
  phone: z
    .string()
    .trim()
    .min(6, "Enter a valid number")
    .max(32)
    .regex(/^[+0-9\s\-()]+$/, "Digits only"),
  time: z.string().min(1, "Pick a time"),
});

const timeSlots = [
  "Today · afternoon",
  "Tomorrow · morning",
  "Tomorrow · afternoon",
  "This week",
  "Next week",
];

export function BookingDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [form, setForm] = useState({ name: "", company: "", phone: "", time: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
    if (submitError) setSubmitError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[issue.path[0] as string] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || `Request failed (${res.status})`);
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Couldn't send your request. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setForm({ name: "", company: "", phone: "", time: "" });
    setErrors({});
    setSubmitted(false);
    setSubmitting(false);
    setSubmitError(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setTimeout(reset, 250);
      }}
    >
      <DialogContent className="sm:max-w-md p-0 gap-0 rounded-2xl overflow-hidden border-border">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-8 py-12 text-center"
          >
            <div className="mx-auto h-12 w-12 rounded-full bg-brand text-brand-foreground grid place-items-center">
              <Check className="h-5 w-5" />
            </div>
            <DialogTitle className="mt-5 text-xl font-semibold tracking-tight">
              Request received.
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-muted-foreground">
              We'll call {form.name.split(" ")[0]} within one business hour.
            </DialogDescription>
            <Button
              variant="brand"
              size="lg"
              className="mt-8"
              onClick={() => onOpenChange(false)}
            >
              Done
            </Button>
          </motion.div>
        ) : (
          <>
            <DialogHeader className="px-8 pt-8 pb-2 text-left">
              <DialogTitle className="text-xl font-semibold tracking-tight">
                Book a setup call
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                15 minutes. No prep needed.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={submit} className="px-8 py-6 space-y-5">
              <Field label="Name" error={errors.name}>
                <Input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  className="h-11 rounded-lg"
                />
              </Field>
              <Field label="Company" error={errors.company}>
                <Input
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                  placeholder="Aurora Clinic"
                  autoComplete="organization"
                  className="h-11 rounded-lg"
                />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <Input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+45 22 33 44 55"
                  inputMode="tel"
                  autoComplete="tel"
                  className="h-11 rounded-lg"
                />
              </Field>
              <Field label="Preferred time" error={errors.time}>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((t) => {
                    const active = form.time === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => update("time", t)}
                        className={`px-3.5 h-9 rounded-full text-xs border transition-colors ${
                          active
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background text-foreground border-border hover:border-foreground/40"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </Field>

              {submitError && (
                <div
                  role="alert"
                  className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive"
                >
                  {submitError}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                variant="brand"
                className="w-full mt-2"
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Request call"}
              </Button>
              <p className="text-[11px] text-muted-foreground text-center">
                By submitting you agree to be contacted about Leadline AI.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </Label>
      <div className="mt-2">{children}</div>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
