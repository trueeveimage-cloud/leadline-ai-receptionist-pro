import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";
import { summarizeCall, type CallSummary } from "@/lib/call-summary.functions";

type AgentLang = "en" | "sv" | "es";

const RETELL_ORBS: Record<AgentLang, { url: string; agentId: string; token: string }> = {
  en: {
    url: "https://agent.retellai.com/orb/agent_9c9a94b6b4ff82ae796e40a3d9?token=dd61cb170807aabaa218567da83ac487",
    agentId: "agent_9c9a94b6b4ff82ae796e40a3d9",
    token: "dd61cb170807aabaa218567da83ac487",
  },
  sv: {
    url: "https://agent.retellai.com/orb/agent_e666bccc68d1d6e4b159a4b906?token=6a1f4c4171c68cc8dba23f661a2b3b48",
    agentId: "agent_e666bccc68d1d6e4b159a4b906",
    token: "6a1f4c4171c68cc8dba23f661a2b3b48",
  },
  es: {
    url: "https://agent.retellai.com/orb/agent_d753b54a79e058365a1629e759?token=d0a88faebb97c9d3063e9d9783be052c",
    agentId: "agent_d753b54a79e058365a1629e759",
    token: "d0a88faebb97c9d3063e9d9783be052c",
  },
};

const LANG_LABELS: Record<AgentLang, string> = { en: "English", sv: "Svenska", es: "Español" };

type Phase = "idle" | "calling" | "ended";
type Turn = { role: "agent" | "user"; text: string; at: number };

const SAMPLE_CALLS: Record<AgentLang, { label: string; business: string; turns: Turn[] }[]> = {
  en: [
    {
      label: "Plumber — burst pipe",
      business: "Residential plumbing",
      turns: [
        { role: "agent", text: "Hi, you've reached Andersson Plumbing, this is the AI receptionist. How can I help?", at: 0 },
        { role: "user", text: "Hey, my name is Mark Davies, I have a burst pipe in my kitchen, water everywhere.", at: 4000 },
        { role: "agent", text: "I'm sorry to hear that Mark. Have you been able to shut the main water valve off?", at: 9000 },
        { role: "user", text: "Yes I shut it off. I need someone here as soon as possible. I'm on 14 Birch Road, Gothenburg.", at: 14000 },
        { role: "agent", text: "Understood. What number should we call you back on?", at: 20000 },
        { role: "user", text: "Zero seven zero, two two one, four four eight eight.", at: 24000 },
        { role: "agent", text: "Got it. I'll mark this as emergency and the on-call plumber will call you within 15 minutes.", at: 30000 },
        { role: "user", text: "Thank you, please hurry.", at: 35000 },
      ],
    },
  ],
  sv: [
    {
      label: "Tandläkare — bokning",
      business: "Tandvårdsklinik",
      turns: [
        { role: "agent", text: "Hej, du har ringt Citytand. Jag är AI-receptionisten, vad kan jag hjälpa dig med?", at: 0 },
        { role: "user", text: "Hej, jag heter Sofia Eklund och jag skulle vilja boka en kontroll.", at: 4000 },
        { role: "agent", text: "Absolut Sofia. När passar det dig bäst, förmiddag eller eftermiddag?", at: 9000 },
        { role: "user", text: "Helst tisdag förmiddag om det går, runt halv elva.", at: 14000 },
        { role: "agent", text: "Tisdag tio trettio fungerar bra. Vilket telefonnummer ska vi nå dig på?", at: 19000 },
        { role: "user", text: "Det är noll sju tre, fem fem fem, ett två tre fyra.", at: 24000 },
        { role: "agent", text: "Tack, jag noterar bokningsförslaget och kliniken bekräftar inom dagen.", at: 29000 },
      ],
    },
  ],
  es: [
    {
      label: "Taller — cita coche",
      business: "Taller de coches",
      turns: [
        { role: "agent", text: "Hola, ha llamado al Taller García. Soy la recepcionista de IA, ¿en qué puedo ayudarle?", at: 0 },
        { role: "user", text: "Hola, soy Carlos Méndez. Mi coche hace un ruido raro al frenar.", at: 4000 },
        { role: "agent", text: "Entiendo Carlos. ¿Qué marca y modelo es el coche?", at: 9000 },
        { role: "user", text: "Es un Volkswagen Golf de 2019.", at: 13000 },
        { role: "agent", text: "Perfecto. ¿Cuándo le iría bien traerlo, esta semana o la próxima?", at: 17000 },
        { role: "user", text: "Esta semana si puede ser, jueves por la tarde.", at: 22000 },
        { role: "agent", text: "Anoto jueves tarde. ¿Su teléfono de contacto?", at: 26000 },
        { role: "user", text: "Seis cinco cinco, uno dos tres, cuatro cinco seis.", at: 30000 },
      ],
    },
  ],
};

export function TestAIDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { lang: uiLang } = useI18n();
  const defaultLang: AgentLang = (["en", "sv", "es"] as const).includes(uiLang as AgentLang)
    ? (uiLang as AgentLang)
    : "en";

  const [agentLang, setAgentLang] = useState<AgentLang>(defaultLang);
  const [phase, setPhase] = useState<Phase>("idle");
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState<Turn[]>([]);
  const [businessType, setBusinessType] = useState<string | undefined>(undefined);
  const [summary, setSummary] = useState<CallSummary | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const tickRef = useRef<number | null>(null);
  const startRef = useRef<number>(Date.now());

  const summarize = useServerFn(summarizeCall);

  useEffect(() => {
    if (!open) return;
    setAgentLang(defaultLang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setPhase("calling");
    setSeconds(0);
    setTranscript([]);
    setSummary(null);
    setSummaryError(null);
    setBusinessType(undefined);
    startRef.current = Date.now();
    if (tickRef.current) window.clearInterval(tickRef.current);
    tickRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = null;
    };
  }, [open, agentLang]);

  useEffect(() => {
    if (!open) return;
    const onMessage = (e: MessageEvent) => {
      if (typeof e.origin === "string" && e.origin && !e.origin.includes("retellai.com")) return;
      const data: any = e.data;
      if (!data || typeof data !== "object") return;
      const pushTurn = (role: string | undefined, text: string | undefined) => {
        if (!text) return;
        const r: Turn["role"] = role === "user" ? "user" : "agent";
        setTranscript((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.role === r && last.text === text) return prev;
          return [...prev, { role: r, text, at: Date.now() - startRef.current }];
        });
      };
      if (Array.isArray(data.transcript)) {
        const turns: Turn[] = data.transcript
          .map((t: any, i: number) => ({
            role: t.role === "user" ? "user" : "agent",
            text: typeof t.content === "string" ? t.content : t.text || t.message || "",
            at: typeof t.timestamp === "number" ? t.timestamp : i * 1000,
          }))
          .filter((t: Turn) => t.text);
        if (turns.length) setTranscript(turns);
      }
      if (data.transcript_update?.role) {
        pushTurn(data.transcript_update.role, data.transcript_update.content || data.transcript_update.text);
      }
      if (data.type === "transcript" || data.event === "transcript" || data.event === "update") {
        pushTurn(data.role, data.content || data.text || data.message);
      }
      if (data.type === "call_ended" || data.event === "call_ended" || data.event === "agent_call_ended") {
        endCall();
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const endCall = () => {
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
    setPhase("ended");
  };

  const reset = () => {
    setPhase("calling");
    setSeconds(0);
    setTranscript([]);
    setSummary(null);
    setSummaryError(null);
    setBusinessType(undefined);
    startRef.current = Date.now();
    if (tickRef.current) window.clearInterval(tickRef.current);
    tickRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const loadSample = (i: number) => {
    const s = SAMPLE_CALLS[agentLang][i];
    if (!s) return;
    setTranscript(s.turns);
    setBusinessType(s.business);
    setSummary(null);
    setSummaryError(null);
    const last = s.turns[s.turns.length - 1]?.at ?? 0;
    setSeconds(Math.round(last / 1000) + 5);
    endCall();
  };

  const runSummary = async () => {
    if (!transcript.length) return;
    setSummarizing(true);
    setSummaryError(null);
    setSummary(null);
    try {
      const result = await summarize({
        data: {
          language: agentLang,
          businessType,
          transcript: transcript.map((t) => ({ role: t.role, text: t.text })),
        },
      });
      setSummary(result);
    } catch (err: any) {
      setSummaryError(err?.message || "Failed to generate summary.");
    } finally {
      setSummarizing(false);
    }
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const stats = useMemo(() => {
    const userTurns = transcript.filter((t) => t.role === "user");
    const agentTurns = transcript.filter((t) => t.role === "agent");
    const wordCount = transcript.reduce(
      (n, t) => n + t.text.trim().split(/\s+/).filter(Boolean).length,
      0,
    );
    return { userTurns, agentTurns, wordCount };
  }, [transcript]);

  const hasTranscript = transcript.length > 0;

  const fmtAt = (ms: number) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  };

  const urgencyBadge = (u: CallSummary["urgency"]) => {
    const map: Record<CallSummary["urgency"], string> = {
      emergency: "bg-red-500/15 text-red-600 border-red-500/30",
      high: "bg-amber-500/15 text-amber-700 border-amber-500/30",
      medium: "bg-foreground/10 text-foreground border-border",
      low: "bg-muted text-muted-foreground border-border",
    };
    return map[u];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[96vw] p-0 overflow-hidden bg-background border-border max-h-[96vh] flex flex-col gap-0">
        <DialogHeader className="px-5 md:px-7 pt-4 md:pt-5 pb-2 space-y-1.5">
          <div className="flex items-center justify-between gap-3 flex-wrap pr-7">
            <DialogTitle className="text-base md:text-lg font-light tracking-tight">
              Talk to the AI receptionist
            </DialogTitle>
            <div className="flex items-center gap-1 border border-border/70 p-0.5">
              {(Object.keys(RETELL_ORBS) as AgentLang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setAgentLang(l)}
                  className={`text-[10px] uppercase tracking-[0.2em] px-2 py-1 transition-colors ${
                    agentLang === l ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {LANG_LABELS[l]}
                </button>
              ))}
            </div>
          </div>
          <DialogDescription className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">
            Live demo in {LANG_LABELS[agentLang]} — or load a sample call below to see the AI-written summary the owner receives.
          </DialogDescription>
        </DialogHeader>

        <div className="px-5 md:px-7 flex items-center justify-between gap-3 py-2 border-y border-border/60 flex-wrap">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className={`h-1.5 w-1.5 rounded-full ${phase === "calling" ? "bg-brand animate-pulse" : "bg-muted-foreground/40"}`} />
            {phase === "calling" ? "Live call" : phase === "ended" ? "Call ended" : "Idle"}
            <span className="tabular-nums normal-case tracking-normal ml-2">{mm}:{ss}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {SAMPLE_CALLS[agentLang].map((s, i) => (
              <button
                key={s.label}
                onClick={() => loadSample(i)}
                className="text-[10px] uppercase tracking-[0.25em] border border-border px-2.5 py-1 hover:bg-secondary transition-colors"
              >
                Load: {s.label}
              </button>
            ))}
            {phase === "calling" ? (
              <button
                onClick={endCall}
                className="text-[10px] uppercase tracking-[0.3em] text-foreground hover:opacity-70 transition-opacity"
              >
                End & view summary
              </button>
            ) : (
              <button
                onClick={reset}
                className="text-[10px] uppercase tracking-[0.3em] text-foreground hover:opacity-70 transition-opacity"
              >
                Restart
              </button>
            )}
          </div>
        </div>

        <div className="relative w-full flex-1 min-h-[75vh] md:min-h-[640px] bg-background overflow-y-auto">
          {phase !== "ended" && open && (
            <iframe
              key={agentLang}
              src={RETELL_ORBS[agentLang].url}
              title={`Leadmap AI receptionist demo (${LANG_LABELS[agentLang]})`}
              allow="microphone; autoplay; clipboard-write"
              className="absolute inset-0 w-full h-full border-0"
            />
          )}
          {phase === "ended" && (
            <div className="p-5 md:p-7 space-y-5">
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-6 bg-foreground/30" />
                    <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                      Transcript
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    {hasTranscript ? `${transcript.length} turn${transcript.length === 1 ? "" : "s"} captured` : "Not captured"}
                  </span>
                </div>

                {!hasTranscript ? (
                  <div className="border border-dashed border-border/70 p-4 md:p-5 text-[13px] text-muted-foreground leading-relaxed space-y-2">
                    <p>
                      <span className="text-foreground">No transcript data was received from the demo orb.</span>{" "}
                      Use one of the "Load:" buttons above to feed a realistic sample transcript into the AI and see the summary your dashboard would produce.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 text-[13px] leading-relaxed border-l border-border/70 pl-4 max-h-[280px] overflow-y-auto">
                    {transcript.map((t, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="text-muted-foreground/70 text-[10px] uppercase tracking-[0.25em] w-14 shrink-0 pt-0.5 tabular-nums">
                          {fmtAt(t.at)}
                        </span>
                        <span className={`text-[10px] uppercase tracking-[0.3em] w-10 shrink-0 pt-0.5 ${t.role === "user" ? "text-brand" : "text-muted-foreground"}`}>
                          {t.role === "user" ? "You" : "AI"}
                        </span>
                        <p className="flex-1 min-w-0 break-words">{t.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-6 bg-foreground/30" />
                    <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                      AI call summary
                    </span>
                  </div>
                  {hasTranscript && (
                    <button
                      onClick={runSummary}
                      disabled={summarizing}
                      className="text-[10px] uppercase tracking-[0.3em] bg-foreground text-background px-3 py-1.5 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {summarizing ? "Generating…" : summary ? "Regenerate" : "Generate summary"}
                    </button>
                  )}
                </div>

                {summaryError && (
                  <div className="border border-red-500/30 bg-red-500/5 text-red-600 p-4 text-[12px] mb-3">
                    {summaryError}
                  </div>
                )}

                {!summary && !summaryError && (
                  <div className="border border-border/70 p-4 md:p-5 space-y-3 text-[13px]">
                    <Row label="Language" value={LANG_LABELS[agentLang]} />
                    <Row label="Duration" value={`${mm}:${ss}`} />
                    <Row label="Turns captured" value={String(transcript.length)} />
                    <Row label="You said" value={`${stats.userTurns.length} turn${stats.userTurns.length === 1 ? "" : "s"}`} />
                    <Row label="AI said" value={`${stats.agentTurns.length} turn${stats.agentTurns.length === 1 ? "" : "s"}`} />
                    <Row label="Words exchanged" value={String(stats.wordCount)} />
                    {hasTranscript && (
                      <p className="text-[11px] text-muted-foreground pt-1">
                        Click <span className="text-foreground">Generate summary</span> to send this transcript to the Leadmap AI and see the structured owner brief.
                      </p>
                    )}
                  </div>
                )}

                {summary && (
                  <div className="border border-border/70 p-4 md:p-5 space-y-4 text-[13px]">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Caller</div>
                        <div className="text-lg font-light mt-1">{summary.caller_name}</div>
                        <div className="text-[12px] text-muted-foreground">{summary.phone}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase tracking-[0.25em] border px-2 py-1 ${urgencyBadge(summary.urgency)}`}>
                          {summary.urgency}
                        </span>
                        <span className={`text-[10px] uppercase tracking-[0.25em] border px-2 py-1 ${summary.qualified ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30" : "bg-muted text-muted-foreground border-border"}`}>
                          {summary.qualified ? "Qualified" : "Not qualified"}
                        </span>
                      </div>
                    </div>

                    <div className="h-px bg-border/60" />

                    <Row label="Intent" value={summary.intent} />
                    <Row label="Job / service" value={summary.job_type} />
                    <Row label="Preferred time" value={summary.preferred_time} />
                    <Row label="Location" value={summary.location} />
                    <Row label="Next step" value={summary.next_step} />

                    <div className="pt-2">
                      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
                        Owner summary
                      </div>
                      <p className="text-[14px] leading-relaxed">{summary.summary}</p>
                    </div>

                    <details className="pt-2">
                      <summary className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground cursor-pointer hover:text-foreground">
                        Raw JSON payload (sent to your dashboard / email)
                      </summary>
                      <pre className="mt-2 p-3 bg-muted/50 text-[11px] overflow-x-auto border border-border/60">
{JSON.stringify(summary, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground w-32 shrink-0 pt-0.5">
        {label}
      </div>
      <div className={`text-foreground leading-snug flex-1 min-w-0 break-words ${mono ? "font-mono text-[11px]" : ""}`}>
        {value}
      </div>
    </div>
  );
}
