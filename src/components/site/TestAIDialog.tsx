import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";

type AgentLang = "en" | "sv" | "es";

// Retell orb URLs — one dedicated agent per language.
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

const LANG_LABELS: Record<AgentLang, string> = {
  en: "English",
  sv: "Svenska",
  es: "Español",
};

type Phase = "idle" | "calling" | "ended";
type Turn = { role: "agent" | "user"; text: string; at: number };

export function TestAIDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { lang: uiLang } = useI18n();
  const defaultLang: AgentLang = (["en", "sv", "es"] as const).includes(uiLang as AgentLang)
    ? (uiLang as AgentLang)
    : "en";

  const [agentLang, setAgentLang] = useState<AgentLang>(defaultLang);
  const [phase, setPhase] = useState<Phase>("idle");
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState<Turn[]>([]);
  const tickRef = useRef<number | null>(null);
  const startRef = useRef<number>(Date.now());

  // Reset agent language when dialog opens
  useEffect(() => {
    if (!open) return;
    setAgentLang(defaultLang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // (Re)start timer whenever dialog opens or language changes
  useEffect(() => {
    if (!open) return;
    setPhase("calling");
    setSeconds(0);
    setTranscript([]);
    startRef.current = Date.now();
    if (tickRef.current) window.clearInterval(tickRef.current);
    tickRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = null;
    };
  }, [open, agentLang]);

  // Listen for transcript / call events posted by the Retell orb iframe.
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
    startRef.current = Date.now();
    if (tickRef.current) window.clearInterval(tickRef.current);
    tickRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
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
                    agentLang === l
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {LANG_LABELS[l]}
                </button>
              ))}
            </div>
          </div>
          <DialogDescription className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">
            Pick a language to hear the receptionist in {LANG_LABELS[agentLang]}. Each language
            uses a dedicated AI agent.
          </DialogDescription>
        </DialogHeader>

        <div className="px-5 md:px-7 flex items-center justify-between gap-3 py-2 border-y border-border/60">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className={`h-1.5 w-1.5 rounded-full ${phase === "calling" ? "bg-brand animate-pulse" : "bg-muted-foreground/40"}`} />
            {phase === "calling" ? "Live call" : phase === "ended" ? "Call ended" : "Idle"}
            <span className="tabular-nums normal-case tracking-normal ml-2">{mm}:{ss}</span>
          </div>
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
                      The embedded Retell widget runs in a sandboxed iframe and doesn't broadcast
                      per-turn transcript events to this page, so we can't reconstruct what was said here.
                    </p>
                    <p>
                      In production every real call is transcribed server-side and the full conversation,
                      caller intent and AI-written summary are saved to your dashboard automatically.
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
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-px w-6 bg-foreground/30" />
                  <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                    Call summary
                  </span>
                </div>
                <div className="border border-border/70 p-4 md:p-5 space-y-3 text-[13px]">
                  <Row label="Language" value={LANG_LABELS[agentLang]} />
                  <Row label="Agent" value={RETELL_ORBS[agentLang].agentId} mono />
                  <Row label="Duration" value={`${mm}:${ss}`} />
                  <Row label="Turns captured" value={String(transcript.length)} />
                  <Row label="You said" value={`${stats.userTurns.length} turn${stats.userTurns.length === 1 ? "" : "s"}`} />
                  <Row label="AI said" value={`${stats.agentTurns.length} turn${stats.agentTurns.length === 1 ? "" : "s"}`} />
                  <Row label="Words exchanged" value={String(stats.wordCount)} />
                  {hasTranscript ? (
                    <Row label="First caller line" value={stats.userTurns[0]?.text ?? "—"} />
                  ) : (
                    <Row
                      label="Note"
                      value="No transcript events were received from the demo orb, so per-turn stats above are zero. This is a limitation of the embedded demo only — your production dashboard records and summarises every real call."
                    />
                  )}
                </div>
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
