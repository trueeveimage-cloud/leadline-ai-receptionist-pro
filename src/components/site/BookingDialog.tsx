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
import { useI18n } from "@/lib/i18n";

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
  company: z.string().trim().min(1, "Required").max(120),
  phone: z
    .string()
    .trim()
    .min(6, "Enter a valid number")
    .max(32)
    .regex(/^[+0-9\s\-()]+$/, "Digits only"),
  date: z.string().min(1, "Pick a date"),
  slot: z.string().min(1, "Pick a slot"),
  timezone: z.string().min(1),
});

const slots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

function nextBusinessDays(count: number, locale: string) {
  const out: { value: string; weekday: string; daymonth: string }[] = [];
  const d = new Date();
  while (out.length < count) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day === 0 || day === 6) continue;
    const value = d.toISOString().slice(0, 10);
    const weekday = d.toLocaleDateString(locale, { weekday: "short" });
    const daymonth = d.toLocaleDateString(locale, { month: "short", day: "numeric" });
    out.push({ value, weekday, daymonth });
  }
  return out;
}

export function BookingDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { t, lang } = useI18n();
  const locale = lang === "sv" ? "sv-SE" : lang === "es" ? "es-ES" : "en-US";
  const tz =
    typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "UTC";
  const dates = nextBusinessDays(6, locale);
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    date: dates[0]?.value ?? "",
    slot: "",
    timezone: tz,
  });
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
        err instanceof Error ? err.message : t("booking.error.generic"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setForm({
      name: "",
      company: "",
      phone: "",
      date: dates[0]?.value ?? "",
      slot: "",
      timezone: tz,
    });
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
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-md p-0 gap-0 rounded-none border-border max-h-[90vh] overflow-y-auto overflow-x-hidden">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 sm:px-8 py-12 text-center"
          >
            <div className="mx-auto h-12 w-12 rounded-none bg-brand text-brand-foreground grid place-items-center">
              <Check className="h-5 w-5" />
            </div>
            <DialogTitle className="mt-5 text-xl font-semibold tracking-tight">
              {t("booking.success.title")}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-muted-foreground">
              {t("booking.success.body", { name: form.name.split(" ")[0] || "" })}
            </DialogDescription>
            <Button
              variant="brand"
              size="lg"
              className="mt-8"
              onClick={() => onOpenChange(false)}
            >
              {t("booking.done")}
            </Button>
          </motion.div>
        ) : (
          <>
            <DialogHeader className="px-5 sm:px-7 pt-6 pb-2 pr-12 text-left space-y-1.5">
              <DialogTitle className="text-xl font-semibold tracking-tight">
                {t("booking.title")}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {t("booking.subtitle")}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={submit} className="px-5 sm:px-7 py-5 space-y-5">
              <Field label={t("booking.name")} error={errors.name}>
                <Input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  className="h-11 rounded-lg"
                />
              </Field>
              <Field label={t("booking.company")} error={errors.company}>
                <Input
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                  placeholder="Aurora Clinic"
                  autoComplete="organization"
                  className="h-11 rounded-lg"
                />
              </Field>
              <Field label={t("booking.phone")} error={errors.phone}>
                <Input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+45 22 33 44 55"
                  inputMode="tel"
                  autoComplete="tel"
                  className="h-11 rounded-lg"
                />
              </Field>
              <Field label={t("booking.date")} error={errors.date}>
                <div className="flex gap-2 overflow-x-auto pb-1 snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {dates.map((d) => {
                    const active = form.date === d.value;
                    return (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => update("date", d.value)}
                        className={`shrink-0 snap-start min-w-[68px] px-3 py-2.5 rounded-xl text-xs border transition-colors text-left ${
                          active
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background text-foreground border-border hover:border-foreground/40"
                        }`}
                      >
                        <span className="block font-medium capitalize">{d.weekday}</span>
                        <span className="block opacity-70 mt-0.5">{d.daymonth}</span>
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Field label={`${t("booking.time")} · ${tz}`} error={errors.slot}>
                <div className="grid grid-cols-4 gap-2">
                  {slots.map((s) => {
                    const active = form.slot === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => update("slot", s)}
                        className={`h-10 rounded-lg text-xs font-medium border transition-colors tabular-nums ${
                          active
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background text-foreground border-border hover:border-foreground/40"
                        }`}
                      >
                        {s}
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
                {submitting ? t("booking.sending") : t("booking.submit")}
              </Button>
              <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                {t("booking.legal")}{" "}
                <a href="/terms" className="underline hover:text-foreground">
                  {t("booking.terms")}
                </a>{" "}
                {t("booking.and")}{" "}
                <a href="/privacy" className="underline hover:text-foreground">
                  {t("booking.privacy")}
                </a>
                .
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
