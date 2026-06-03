import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const RETELL_ORB_URL =
  "https://agent.retellai.com/orb/agent_3b81fadcba03101e07cb4911e6?token=e5cd68c4559382a072c5483135d4dc83";

type Phase = "idle" | "calling" | "ended";
type Turn = { role: "agent" | "user"; text: string };

export function TestAIDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState<Turn[]>([]);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    setPhase("calling");
    setSeconds(0);
    setTranscript([]);
    tickRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = null;
    };
  }, [open]);

  // Listen for transcript events posted by the Retell orb iframe.
  useEffect(() => {
    if (!open) return;
    const onMessage = (e: MessageEvent) => {
      if (typeof e.origin === "string" && !e.origin.includes("retellai.com")) return;
      const data: any = e.data;
      if (!data || typeof data !== "object") return;

      // Retell posts a variety of shapes; defensively extract turns.
      const pushTurn = (role: string | undefined, text: string | undefined) => {
        if (!text) return;
        const r: Turn["role"] = role === "user" ? "user" : "agent";
        setTranscript((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.role === r && last.text === text) return prev;
          return [...prev, { role: r, text }];
        });
      };

      if (Array.isArray(data.transcript)) {
        const turns: Turn[] = data.transcript
          .map((t: any) => ({
            role: t.role === "user" ? "user" : "agent",
            text: typeof t.content === "string" ? t.content : t.text || "",
          }))
          .filter((t: Turn) => t.text);
        if (turns.length) setTranscript(turns);
      } else if (data.type === "transcript" || data.event === "transcript") {
        pushTurn(data.role, data.content || data.text);
      } else if (data.type === "call_ended" || data.event === "call_ended") {
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
    if (tickRef.current) window.clearInterval(tickRef.current);
    tickRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  // Derive a real summary from the transcript.
  const userTurns = transcript.filter((t) => t.role === "user");
  const intent = userTurns[0]?.text ?? "—";
  const wordCount = transcript.reduce((n, t) => n + t.text.split(/\s+/).length, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-background border-border max-h-[92vh] flex flex-col gap-0">
        <DialogHeader className="px-5 md:px-7 pt-5 md:pt-6 pb-3 space-y-2">
          <div className="flex items-center justify-between gap-3 flex-wrap pr-7">
            <DialogTitle className="text-base md:text-lg font-light tracking-tight">
              Talk to the AI receptionist
            </DialogTitle>
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground border border-border/70 px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              English demo
            </span>
          </div>
          <DialogDescription className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">
            Live demo speaks <span className="text-foreground">English only</span>. Production
            receptionists run in Swedish, Spanish, German and more. Allow microphone access when
            prompted.
          </DialogDescription>
        </DialogHeader>

        <div className="px-5 md:px-7 flex items-center justify-between gap-3 py-2.5 border-y border-border/60">
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

        <div className="relative w-full flex-1 min-h-[340px] md:min-h-[460px] bg-background overflow-y-auto">
          {phase !== "ended" && open && (
            <iframe
              src={RETELL_ORB_URL}
              title="Leadmap AI receptionist demo"
              allow="microphone; autoplay; clipboard-write"
              className="absolute inset-0 w-full h-full border-0"
            />
          )}
          {phase === "ended" && (
            <div className="p-5 md:p-7 space-y-5">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-px w-6 bg-foreground/30" />
                  <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                    Transcript
                  </span>
                </div>
                {transcript.length === 0 ? (
                  <p className="text-[13px] text-muted-foreground border-l border-border/70 pl-4 leading-relaxed">
                    No transcript was captured for this session. In production, every call is
                    transcribed and saved to your dashboard automatically.
                  </p>
                ) : (
                  <div className="space-y-2.5 text-[13px] leading-relaxed border-l border-border/70 pl-4 max-h-[260px] overflow-y-auto">
                    {transcript.map((t, i) => (
                      <p key={i}>
                        <span className="text-muted-foreground text-[10px] uppercase tracking-[0.3em] mr-2">
                          {t.role === "user" ? "You" : "AI"}
                        </span>
                        {t.text}
                      </p>
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
                  <Row label="Duration" value={`${mm}:${ss}`} />
                  <Row label="Turns" value={transcript.length ? String(transcript.length) : "—"} />
                  <Row label="Words exchanged" value={wordCount ? String(wordCount) : "—"} />
                  <Row label="Caller intent" value={intent} />
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground w-32 shrink-0 pt-0.5">
        {label}
      </div>
      <div className="text-foreground leading-snug flex-1 min-w-0 break-words">{value}</div>
    </div>
  );
}
