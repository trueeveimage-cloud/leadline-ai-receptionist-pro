import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Loader2,
  Mail,
  Phone,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import {
  captureMarketingAttribution,
  createSubmissionId,
  recordMarketingEvent,
} from "@/lib/marketing";
import { hasMarketingConsent } from "@/lib/consent";

export type BookingPrefill = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  isVvsCompany?: boolean;
  isDecisionMaker?: boolean;
  hasMissedCallNeed?: boolean;
};

type AvailabilitySlot = {
  date: string;
  time: string;
  startsAt: string;
  endsAt: string;
};

type AvailabilityResponse = {
  ok: boolean;
  preview?: boolean;
  timezone?: string;
  slots?: AvailabilitySlot[];
  error?: string;
};

type BookingResponse = {
  ok?: boolean;
  duplicate?: boolean;
  error?: string;
  code?: string;
  meetUrl?: string;
  startsAt?: string;
};

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  company: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(180),
  phone: z
    .string()
    .trim()
    .max(32)
    .refine((value) => !value || /^[+0-9\s\-()]+$/.test(value)),
  isVvsCompany: z.literal(true),
  isDecisionMaker: z.literal(true),
  hasMissedCallNeed: z.literal(true),
  date: z.string().min(1),
  slot: z.string().min(1),
  timezone: z.literal("Europe/Stockholm"),
  website: z.string().max(0),
});

type Step = 0 | 1 | 2;

const EMPTY_FORM = {
  name: "",
  company: "",
  email: "",
  phone: "",
  isVvsCompany: false,
  isDecisionMaker: false,
  hasMissedCallNeed: false,
  date: "",
  slot: "",
  timezone: "Europe/Stockholm" as const,
  website: "",
};

export function BookingDialog({
  open,
  onOpenChange,
  prefill,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  prefill?: BookingPrefill;
}) {
  const { lang } = useI18n();
  const sv = lang === "sv";
  const locale = sv ? "sv-SE" : "en-GB";
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [availabilityPreview, setAvailabilityPreview] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{ meetUrl: string; startsAt: string } | null>(
    null,
  );
  const submissionId = useRef<string | null>(null);
  const attribution = useMemo(
    () => captureMarketingAttribution({ cta_variant: "booking_dialog", niche: "vvs" }),
    [],
  );

  const fetchAvailability = async () => {
    setLoadingAvailability(true);
    setAvailabilityError(null);
    try {
      const response = await fetch("/api/public/availability", {
        headers: { Accept: "application/json" },
      });
      const data = (await response.json().catch(() => null)) as AvailabilityResponse | null;
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || (sv ? "Kunde inte hämta tider." : "Could not load times."));
      }
      const slots = data.slots || [];
      setAvailability(slots);
      setAvailabilityPreview(Boolean(data.preview));
      setForm((current) => {
        const selectedDate = slots.some((slot) => slot.date === current.date)
          ? current.date
          : slots[0]?.date || "";
        const selectedSlot = slots.some(
          (slot) => slot.date === selectedDate && slot.time === current.slot,
        )
          ? current.slot
          : "";
        return { ...current, date: selectedDate, slot: selectedSlot };
      });
    } catch (error) {
      setAvailability([]);
      setAvailabilityError(error instanceof Error ? error.message : "Kunde inte hämta tider.");
    } finally {
      setLoadingAvailability(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    const next = {
      ...EMPTY_FORM,
      name: prefill?.name || "",
      company: prefill?.company || "",
      email: prefill?.email || "",
      phone: prefill?.phone || "",
      isVvsCompany: Boolean(prefill?.isVvsCompany),
      isDecisionMaker: Boolean(prefill?.isDecisionMaker),
      hasMissedCallNeed: Boolean(prefill?.hasMissedCallNeed),
    };
    setForm(next);
    setErrors({});
    setSubmitError(null);
    setConfirmation(null);
    submissionId.current = null;
    const canSkipQualification =
      next.name &&
      next.company &&
      next.email &&
      next.isVvsCompany &&
      next.isDecisionMaker &&
      next.hasMissedCallNeed;
    setStep(canSkipQualification ? 1 : 0);
    void fetchAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, prefill]);

  const update = <Key extends keyof typeof form>(key: Key, value: (typeof form)[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: "" }));
    if (submitError) setSubmitError(null);
  };

  const dates = useMemo(() => [...new Set(availability.map((slot) => slot.date))], [availability]);
  const times = availability.filter((slot) => slot.date === form.date);
  const selectedSlot = availability.find(
    (slot) => slot.date === form.date && slot.time === form.slot,
  );

  const validateStep = (currentStep: Step) => {
    const nextErrors: Record<string, string> = {};
    if (currentStep === 0) {
      if (!form.name.trim()) nextErrors.name = sv ? "Namn krävs." : "Name is required.";
      if (!form.company.trim()) nextErrors.company = sv ? "Företag krävs." : "Company is required.";
      if (!z.string().email().safeParse(form.email.trim()).success) {
        nextErrors.email = sv ? "Ange en giltig e-postadress." : "Enter a valid email.";
      }
      if (form.phone && !/^[+0-9\s\-()]+$/.test(form.phone)) {
        nextErrors.phone = sv ? "Kontrollera telefonnumret." : "Check the phone number.";
      }
      if (!form.isVvsCompany || !form.isDecisionMaker || !form.hasMissedCallNeed) {
        nextErrors.qualification = sv
          ? "Alla tre kriterier måste vara uppfyllda för att boka en demo."
          : "All three criteria must be met to book a demo.";
      }
    }
    if (currentStep === 1) {
      if (!form.date || !form.slot || !selectedSlot) {
        nextErrors.slot = sv ? "Välj en ledig tid." : "Choose an available time.";
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setStep((current) => Math.min(2, current + 1) as Step);
  };

  const submit = async () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success || !selectedSlot) {
      setSubmitError(sv ? "Kontrollera alla uppgifter." : "Check all details.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    const eventId = submissionId.current || createSubmissionId();
    submissionId.current = eventId;
    try {
      const response = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          submissionId: eventId,
          attribution,
          advertisingConsent: hasMarketingConsent(),
        }),
      });
      const data = (await response.json().catch(() => null)) as BookingResponse | null;
      if (!response.ok || !data?.ok || !data.meetUrl || !data.startsAt) {
        if (response.status === 409 || data?.code === "slot_unavailable") {
          await fetchAvailability();
          setStep(1);
        }
        throw new Error(
          data?.error || (sv ? "Mötet kunde inte bekräftas." : "Meeting could not be confirmed."),
        );
      }
      if (!data.duplicate) {
        recordMarketingEvent("demo_booked", {
          eventId,
          attribution,
          server: false,
        });
      }
      setConfirmation({ meetUrl: data.meetUrl, startsAt: data.startsAt });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Mötet kunde inte bekräftas.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) setTimeout(() => setConfirmation(null), 200);
      }}
    >
      <DialogContent className="flex max-h-[94vh] w-[calc(100vw-1.5rem)] flex-col gap-0 overflow-hidden rounded-3xl border-border p-0 sm:max-w-[560px]">
        {confirmation ? (
          <SuccessState
            name={form.name}
            startsAt={confirmation.startsAt}
            meetUrl={confirmation.meetUrl}
            locale={locale}
            sv={sv}
            onDone={() => onOpenChange(false)}
          />
        ) : (
          <>
            <div className="border-b border-border/60 px-6 pb-5 pt-7 sm:px-8">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <Sparkles className="h-3 w-3 text-brand" />
                <span>{sv ? "Kvalificerad VVS-demo" : "Qualified plumbing demo"}</span>
              </div>
              <DialogTitle className="mt-3 text-2xl font-semibold tracking-tight">
                {sv ? "Boka ett bekräftat Google Meet" : "Book a confirmed Google Meet"}
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {sv
                  ? "30 minuter. Tiden kontrolleras mot kalendern innan mötet skapas."
                  : "30 minutes. Availability is checked before the meeting is created."}
              </DialogDescription>
              <div className="mt-5 flex items-center gap-2">
                {[
                  sv ? "Kvalificera" : "Qualify",
                  sv ? "Tid" : "Time",
                  sv ? "Bekräfta" : "Confirm",
                ].map((label, index) => (
                  <div key={label} className="flex flex-1 items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`grid h-6 w-6 place-items-center rounded-full border text-[11px] font-semibold ${
                          step > index
                            ? "border-brand bg-brand text-brand-foreground"
                            : step === index
                              ? "border-foreground bg-foreground text-background"
                              : "border-border text-muted-foreground"
                        }`}
                      >
                        {step > index ? <Check className="h-3 w-3" /> : index + 1}
                      </span>
                      <span className="hidden text-[11px] font-medium sm:inline">{label}</span>
                    </div>
                    {index < 2 ? <div className="h-px flex-1 bg-border/80" /> : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              <div className="hidden" aria-hidden="true">
                <Label htmlFor="booking-website">Website</Label>
                <Input
                  id="booking-website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(event) => update("website", event.target.value)}
                />
              </div>
              <AnimatePresence mode="wait">
                {step === 0 ? (
                  <motion.div key="qualify" {...motionProps} className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field id="booking-name" label={sv ? "Namn" : "Name"} error={errors.name}>
                        <Input
                          id="booking-name"
                          value={form.name}
                          onChange={(event) => update("name", event.target.value)}
                          autoComplete="name"
                          className="h-12 rounded-xl"
                        />
                      </Field>
                      <Field
                        id="booking-company"
                        label={sv ? "Företag" : "Company"}
                        error={errors.company}
                      >
                        <Input
                          id="booking-company"
                          value={form.company}
                          onChange={(event) => update("company", event.target.value)}
                          autoComplete="organization"
                          className="h-12 rounded-xl"
                        />
                      </Field>
                    </div>
                    <Field id="booking-email" label="E-post" error={errors.email}>
                      <Input
                        id="booking-email"
                        type="email"
                        value={form.email}
                        onChange={(event) => update("email", event.target.value)}
                        autoComplete="email"
                        className="h-12 rounded-xl"
                      />
                    </Field>
                    <Field
                      id="booking-phone"
                      label={sv ? "Telefon (valfritt)" : "Phone (optional)"}
                      error={errors.phone}
                    >
                      <Input
                        id="booking-phone"
                        value={form.phone}
                        onChange={(event) => update("phone", event.target.value)}
                        inputMode="tel"
                        autoComplete="tel"
                        className="h-12 rounded-xl"
                      />
                    </Field>
                    <div className="rounded-2xl border border-border bg-surface p-4">
                      <p className="text-sm font-semibold">
                        {sv ? "Bekräfta att demon passar er" : "Confirm that the demo fits"}
                      </p>
                      <div className="mt-3 space-y-3">
                        <QualifyCheck
                          checked={form.isVvsCompany}
                          onChange={(value) => update("isVvsCompany", value)}
                          label={
                            sv
                              ? "Företaget utför VVS-arbeten i Sverige"
                              : "The company performs plumbing work in Sweden"
                          }
                        />
                        <QualifyCheck
                          checked={form.isDecisionMaker}
                          onChange={(value) => update("isDecisionMaker", value)}
                          label={
                            sv
                              ? "Jag kan påverka beslut om telefoni eller kundflöde"
                              : "I influence phone or customer-flow decisions"
                          }
                        />
                        <QualifyCheck
                          checked={form.hasMissedCallNeed}
                          onChange={(value) => update("hasMissedCallNeed", value)}
                          label={
                            sv
                              ? "Vi vill fånga missade samtal eller samtal efter stängning"
                              : "We need missed or after-hours call coverage"
                          }
                        />
                      </div>
                      {errors.qualification ? (
                        <p className="mt-3 text-xs text-destructive">{errors.qualification}</p>
                      ) : null}
                    </div>
                  </motion.div>
                ) : null}

                {step === 1 ? (
                  <motion.div key="time" {...motionProps} className="space-y-6">
                    {availabilityPreview ? (
                      <p className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-700">
                        {sv
                          ? "Förhandsvisning: Google Calendar-anslutningen saknas lokalt. Dessa tider är exempel och kan inte bekräftas ännu."
                          : "Preview: Google Calendar is not connected locally. These are example times."}
                      </p>
                    ) : null}
                    {loadingAvailability ? (
                      <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {sv ? "Hämtar lediga tider…" : "Loading availability…"}
                      </div>
                    ) : availabilityError ? (
                      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                        <p>{availabilityError}</p>
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-4"
                          onClick={fetchAvailability}
                        >
                          {sv ? "Försök igen" : "Try again"}
                        </Button>
                      </div>
                    ) : (
                      <>
                        <section>
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <h3 className="flex items-center gap-2 text-sm font-semibold">
                              <Calendar className="h-4 w-4" /> {sv ? "Välj dag" : "Choose day"}
                            </h3>
                            <span className="text-[11px] text-muted-foreground">
                              Europe/Stockholm
                            </span>
                          </div>
                          <div className="flex gap-2 overflow-x-auto pb-1">
                            {dates.map((date) => {
                              const active = form.date === date;
                              const display = new Date(`${date}T12:00:00`);
                              return (
                                <button
                                  key={date}
                                  type="button"
                                  onClick={() => {
                                    update("date", date);
                                    update("slot", "");
                                  }}
                                  className={`min-w-[86px] rounded-2xl border px-3 py-3 text-center text-xs transition-colors ${
                                    active
                                      ? "border-foreground bg-foreground text-background"
                                      : "border-border bg-background hover:border-foreground/40"
                                  }`}
                                >
                                  <span className="block uppercase tracking-wider opacity-70">
                                    {display.toLocaleDateString(locale, { weekday: "short" })}
                                  </span>
                                  <span className="mt-1 block text-base font-semibold">
                                    {display.toLocaleDateString(locale, {
                                      day: "numeric",
                                      month: "short",
                                    })}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </section>
                        <section>
                          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                            <Clock className="h-4 w-4" /> {sv ? "Välj tid" : "Choose time"}
                          </h3>
                          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                            {times.map((candidate) => (
                              <button
                                key={candidate.startsAt}
                                type="button"
                                onClick={() => update("slot", candidate.time)}
                                className={`h-11 rounded-xl border text-[13px] font-medium tabular-nums transition-colors ${
                                  form.slot === candidate.time
                                    ? "border-foreground bg-foreground text-background"
                                    : "border-border bg-background hover:border-foreground/40"
                                }`}
                              >
                                {candidate.time}
                              </button>
                            ))}
                          </div>
                          {errors.slot ? (
                            <p className="mt-2 text-xs text-destructive">{errors.slot}</p>
                          ) : null}
                        </section>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {sv
                            ? "30 minuter · högst två demos per dag · 15 minuters buffert · minst 12 timmars framförhållning."
                            : "30 minutes · maximum two demos/day · 15-minute buffers · 12 hours' notice."}
                        </p>
                      </>
                    )}
                  </motion.div>
                ) : null}

                {step === 2 ? (
                  <motion.div key="review" {...motionProps} className="space-y-5">
                    <div className="space-y-3.5 rounded-2xl border border-border bg-surface p-5">
                      <SummaryRow
                        icon={Calendar}
                        label={sv ? "Datum" : "Date"}
                        value={formatDate(form.date, locale)}
                      />
                      <SummaryRow
                        icon={Clock}
                        label={sv ? "Tid" : "Time"}
                        value={`${form.slot} · Europe/Stockholm`}
                      />
                      <div className="h-px bg-border/60" />
                      <SummaryRow icon={User} label={sv ? "Namn" : "Name"} value={form.name} />
                      <SummaryRow
                        icon={Sparkles}
                        label={sv ? "Företag" : "Company"}
                        value={form.company}
                      />
                      <SummaryRow icon={Mail} label="E-post" value={form.email} />
                      {form.phone ? (
                        <SummaryRow
                          icon={Phone}
                          label={sv ? "Telefon" : "Phone"}
                          value={form.phone}
                        />
                      ) : null}
                    </div>
                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                      <Reassure>
                        {sv
                          ? "Mötet skapas först när kalendern bekräftar tiden"
                          : "The event is created only after Calendar confirms it"}
                      </Reassure>
                      <Reassure>
                        {sv
                          ? "Google Meet-länk skickas till e-posten ovan"
                          : "The Google Meet link is sent to the email above"}
                      </Reassure>
                      <Reassure>
                        {sv
                          ? "Påminnelser 24 timmar och 1 timme före"
                          : "Reminders 24 hours and 1 hour before"}
                      </Reassure>
                    </ul>
                    {submitError ? (
                      <p
                        role="alert"
                        className="rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-xs text-destructive"
                      >
                        {submitError}
                      </p>
                    ) : null}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <div className="border-t border-border/60 bg-surface/60 px-6 py-4 sm:px-8">
              <div className="flex items-center gap-3">
                {step > 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={() => setStep((step - 1) as Step)}
                  >
                    <ArrowLeft className="h-4 w-4" /> {sv ? "Tillbaka" : "Back"}
                  </Button>
                ) : (
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Shield className="h-3 w-3" />{" "}
                    {sv ? "Ingen tid visas utan kvalificering" : "Times require qualification"}
                  </div>
                )}
                <div className="flex-1" />
                {step < 2 ? (
                  <Button
                    type="button"
                    size="lg"
                    variant="brand"
                    onClick={next}
                    disabled={step === 1 && loadingAvailability}
                  >
                    {sv ? "Fortsätt" : "Continue"} <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="lg"
                    variant="brand"
                    onClick={submit}
                    disabled={submitting || availabilityPreview}
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {sv ? "Bekräfta mötet" : "Confirm meeting"}
                  </Button>
                )}
              </div>
              {step === 2 ? (
                <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
                  {sv ? "Genom att boka godkänner du våra" : "By booking you agree to our"}{" "}
                  <a href="/terms" className="underline">
                    {sv ? "villkor" : "terms"}
                  </a>{" "}
                  {sv ? "och" : "and"}{" "}
                  <a href="/privacy" className="underline">
                    {sv ? "integritetspolicy" : "privacy policy"}
                  </a>
                  .
                </p>
              ) : null}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

const motionProps = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
  transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

function QualifyCheck({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 accent-[var(--brand)]"
      />
      <span>{label}</span>
    </label>
  );
}

function SuccessState({
  name,
  startsAt,
  meetUrl,
  locale,
  sv,
  onDone,
}: {
  name: string;
  startsAt: string;
  meetUrl: string;
  locale: string;
  sv: boolean;
  onDone: () => void;
}) {
  const start = new Date(startsAt);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 py-12 text-center sm:px-10"
    >
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand text-brand-foreground">
        <Check className="h-6 w-6" strokeWidth={2.5} />
      </div>
      <DialogTitle className="mt-6 text-2xl font-semibold tracking-tight">
        {sv ? "Mötet är bekräftat." : "The meeting is confirmed."}
      </DialogTitle>
      <DialogDescription className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {sv
          ? `${name.split(" ")[0] || "Tack"}, Google Calendar-inbjudan och Meet-länken har skickats.`
          : `${name.split(" ")[0] || "Thanks"}, the Calendar invitation and Meet link have been sent.`}
      </DialogDescription>
      <div className="mx-auto mt-6 max-w-sm space-y-3 rounded-2xl border border-border bg-surface px-5 py-4 text-left">
        <div className="flex items-center gap-2.5 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {start.toLocaleDateString(locale, {
              timeZone: "Europe/Stockholm",
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium tabular-nums">
            {start.toLocaleTimeString(locale, {
              timeZone: "Europe/Stockholm",
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            · Europe/Stockholm
          </span>
        </div>
        <a
          href={meetUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-sm font-semibold underline underline-offset-4"
        >
          {sv ? "Öppna Google Meet" : "Open Google Meet"}
        </a>
      </div>
      <Button variant="brand" size="lg" className="mt-8" onClick={onDone}>
        {sv ? "Klart" : "Done"}
      </Button>
    </motion.div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label
        htmlFor={id}
        className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
      >
        {label}
      </Label>
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-1.5 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="w-20 shrink-0 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span className="min-w-0 truncate text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function Reassure({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
      <span>{children}</span>
    </li>
  );
}

function formatDate(date: string, locale: string) {
  if (!date) return "—";
  return new Date(`${date}T12:00:00`).toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
