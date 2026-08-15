import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import type { RetellWebClient as RetellWebClientType } from "retell-client-js-sdk";
import { Check, Loader2, Mic, PhoneOff, Play, ShieldCheck, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { summarizeCall, type CallSummary } from "@/lib/call-summary.functions";

type Phase = "idle" | "starting" | "calling" | "ended";
type Turn = { role: "agent" | "user"; text: string; at: number };

type RetellUpdate = {
  transcript?: Array<{
    role?: string;
    content?: string;
    text?: string;
    words?: Array<{ word?: string }>;
  }>;
};

const SAMPLE_TURNS: Turn[] = [
  {
    role: "agent",
    text: "Hej, du har kommit till Leadmaps VVS-demo. Jag är en AI-assistent. Dela inga känsliga uppgifter. Vad gäller ärendet?",
    at: 0,
  },
  {
    role: "user",
    text: "Det läcker under diskbänken och jag behöver hjälp så snart som möjligt.",
    at: 4_000,
  },
  {
    role: "agent",
    text: "Har du kunnat stänga av vattnet, och vilken ort gäller det?",
    at: 9_000,
  },
  {
    role: "user",
    text: "Ja, vattnet är avstängt. Det gäller Solna.",
    at: 14_000,
  },
  {
    role: "agent",
    text: "Tack. Jag skickar en brådskande återkopplingsförfrågan. VVS-företaget bekräftar själv nästa steg.",
    at: 20_000,
  },
];

export function TestAIDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const { lang } = useI18n();
  const sv = lang === "sv";
  const [phase, setPhase] = useState<Phase>("idle");
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState<Turn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [agentTalking, setAgentTalking] = useState(false);
  const [summary, setSummary] = useState<CallSummary | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const clientRef = useRef<RetellWebClientType | null>(null);
  const startedAt = useRef(Date.now());
  const summarize = useServerFn(summarizeCall);

  const stopLiveCall = () => {
    clientRef.current?.stopCall();
    clientRef.current = null;
    setAgentTalking(false);
    setPhase((current) => (current === "idle" ? current : "ended"));
  };

  useEffect(() => {
    if (!open) {
      clientRef.current?.stopCall();
      clientRef.current = null;
      return;
    }
    setPhase("idle");
    setSeconds(0);
    setTranscript([]);
    setError(null);
    setSummary(null);
    setSummaryError(null);
  }, [open]);

  useEffect(() => {
    if (phase !== "calling") return;
    const timer = window.setInterval(() => {
      setSeconds((current) => {
        const next = current + 1;
        if (next >= 120) stopLiveCall();
        return Math.min(next, 120);
      });
    }, 1_000);
    return () => window.clearInterval(timer);
  }, [phase]);

  const startLiveDemo = async () => {
    setPhase("starting");
    setError(null);
    setSummary(null);
    setSummaryError(null);
    setTranscript([]);
    setSeconds(0);
    startedAt.current = Date.now();
    try {
      const response = await fetch("/api/public/voice-demo-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: "sv", disclosureAccepted: true }),
      });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        accessToken?: string;
        error?: string;
      } | null;
      if (!response.ok || !data?.ok || !data.accessToken) {
        throw new Error(data?.error || "Röstdemon kunde inte starta.");
      }

      const { RetellWebClient } = await import("retell-client-js-sdk");
      const client = new RetellWebClient();
      client.on("call_started", () => setPhase("calling"));
      client.on("call_ended", () => {
        clientRef.current = null;
        setAgentTalking(false);
        setPhase("ended");
      });
      client.on("agent_start_talking", () => setAgentTalking(true));
      client.on("agent_stop_talking", () => setAgentTalking(false));
      client.on("update", (update: RetellUpdate) => {
        if (!Array.isArray(update.transcript)) return;
        const turns = update.transcript
          .map((turn, index): Turn => {
            const text =
              turn.content ||
              turn.text ||
              turn.words?.map((word) => word.word || "").join(" ") ||
              "";
            return {
              role: turn.role === "user" ? "user" : "agent",
              text: text.trim(),
              at: Date.now() - startedAt.current + index,
            };
          })
          .filter((turn) => turn.text);
        if (turns.length) setTranscript(turns);
      });
      client.on("error", () => {
        setError("Röstdemon avbröts. Det simulerade samtalet finns kvar nedan.");
        client.stopCall();
      });
      clientRef.current = client;
      await client.startCall({ accessToken: data.accessToken, sampleRate: 24_000 });
    } catch (startError) {
      clientRef.current = null;
      setPhase("idle");
      setError(startError instanceof Error ? startError.message : "Röstdemon kunde inte starta.");
    }
  };

  const loadSample = () => {
    clientRef.current?.stopCall();
    clientRef.current = null;
    setTranscript(SAMPLE_TURNS);
    setSeconds(25);
    setError(null);
    setSummary(null);
    setSummaryError(null);
    setPhase("ended");
  };

  const runSummary = async () => {
    if (!transcript.length) return;
    setSummarizing(true);
    setSummary(null);
    setSummaryError(null);
    try {
      const result = await summarize({
        data: {
          language: "sv",
          businessType: "VVS-företag",
          transcript: transcript.map((turn) => ({ role: turn.role, text: turn.text })),
        },
      });
      setSummary(result);
    } catch (summaryFailure) {
      setSummaryError(
        summaryFailure instanceof Error
          ? summaryFailure.message
          : "Sammanfattningen kunde inte skapas.",
      );
    } finally {
      setSummarizing(false);
    }
  };

  const clock = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const wordCount = useMemo(
    () =>
      transcript.reduce((count, turn) => count + turn.text.split(/\s+/).filter(Boolean).length, 0),
    [transcript],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[94vh] w-[calc(100vw-1.5rem)] flex-col gap-0 overflow-hidden border-border bg-background p-0 sm:max-w-3xl">
        <div className="border-b border-border/60 px-5 pb-5 pt-6 md:px-7">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Svensk VVS-röstdemo · högst 2 minuter
          </p>
          <DialogTitle className="mt-2 text-2xl font-light">
            {sv ? "Prata med Leadmaps AI-demo" : "Talk to Leadmap's Swedish AI demo"}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {sv
              ? "Du pratar med en AI, inte en människa. Dela inga känsliga eller verkliga kunduppgifter. Samtalet används bara för att visa ett VVS-flöde."
              : "You are speaking with AI, not a person. Do not share sensitive or real customer information."}
          </DialogDescription>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-5 py-3 md:px-7">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            <span
              className={`h-2 w-2 rounded-full ${
                phase === "calling" ? "animate-pulse bg-brand" : "bg-muted-foreground/40"
              }`}
            />
            {phase === "idle"
              ? "Klar att starta"
              : phase === "starting"
                ? "Ansluter"
                : phase === "calling"
                  ? agentTalking
                    ? "AI talar"
                    : "Lyssnar"
                  : "Samtal avslutat"}
            <span className="ml-2 tabular-nums tracking-normal">{clock}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {phase === "idle" ? (
              <Button type="button" variant="brand" size="sm" onClick={startLiveDemo}>
                <Mic className="h-4 w-4" /> Starta riktig röstdemo
              </Button>
            ) : null}
            {phase === "starting" ? (
              <Button type="button" variant="outline" size="sm" disabled>
                <Loader2 className="h-4 w-4 animate-spin" /> Ansluter…
              </Button>
            ) : null}
            {phase === "calling" ? (
              <Button type="button" variant="outline" size="sm" onClick={stopLiveCall}>
                <PhoneOff className="h-4 w-4" /> Avsluta
              </Button>
            ) : null}
            <Button type="button" variant="outline" size="sm" onClick={loadSample}>
              <Play className="h-4 w-4" /> Visa simulerat samtal
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 md:p-7">
          {error ? (
            <p className="mb-5 border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-700">
              {error}
            </p>
          ) : null}

          {phase === "idle" && !transcript.length ? (
            <div className="grid min-h-72 place-items-center border border-dashed border-border p-8 text-center">
              <div className="max-w-md">
                <div className="relative mx-auto grid h-24 w-24 place-items-center rounded-full border border-border bg-surface">
                  <span className="absolute inset-3 animate-pulse rounded-full border border-brand/40" />
                  <Sparkles className="h-8 w-8 text-brand" />
                </div>
                <h3 className="mt-6 text-xl font-light">
                  Riktig röst eller tydligt märkt simulering
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Den riktiga demon kräver mikrofon och en ansluten Retell-agent. Simuleringen
                  använder bara syntetiska uppgifter och fungerar alltid.
                </p>
                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" /> 3 försök per enhet/dag · 100 minuter/månad
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-7">
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Transkript
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {transcript.length} repliker · {wordCount} ord
                  </p>
                </div>
                {transcript.length ? (
                  <div className="max-h-72 space-y-3 overflow-y-auto border-l border-border pl-4">
                    {transcript.map((turn, index) => (
                      <div
                        key={`${turn.role}-${index}`}
                        className="grid grid-cols-[44px_1fr] gap-3 text-sm leading-relaxed"
                      >
                        <span
                          className={`text-[10px] uppercase tracking-[0.2em] ${turn.role === "user" ? "text-brand" : "text-muted-foreground"}`}
                        >
                          {turn.role === "user" ? "Du" : "AI"}
                        </span>
                        <p>{turn.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="border border-dashed border-border p-5 text-sm text-muted-foreground">
                    Transkriptet visas när röstdemon har börjat. Du kan alltid öppna simuleringen.
                  </p>
                )}
              </section>

              {phase === "ended" && transcript.length ? (
                <section className="border-t border-border pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        Exempel på överlämning
                      </p>
                      <h3 className="mt-2 text-xl font-light">Sammanfattning till VVS-företaget</h3>
                    </div>
                    <Button
                      type="button"
                      variant="brand"
                      size="sm"
                      onClick={runSummary}
                      disabled={summarizing}
                    >
                      {summarizing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      {summary ? "Skapa igen" : "Skapa sammanfattning"}
                    </Button>
                  </div>
                  {summaryError ? (
                    <p className="mt-4 text-sm text-destructive">{summaryError}</p>
                  ) : null}
                  {summary ? (
                    <div className="mt-4 grid gap-3 border border-border bg-surface p-5 sm:grid-cols-2">
                      <SummaryRow label="Ärende" value={summary.intent} />
                      <SummaryRow label="Prioritet" value={summary.urgency} />
                      <SummaryRow label="Kund" value={summary.customer_name || "Ej angivet"} />
                      <SummaryRow label="Nästa steg" value={summary.next_step} />
                    </div>
                  ) : (
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      Klicka för att omvandla samtalet till ett tydligt, handlingsbart underlag.
                    </p>
                  )}
                </section>
              ) : null}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-surface/60 px-5 py-4 md:px-7">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Check className="h-4 w-4 text-brand" /> AI-information visas före första interaktionen
          </div>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Stäng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
