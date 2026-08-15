import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  checkRateLimit,
  clientKey,
  isAllowedPublicOrigin,
  publicCorsHeaders,
  readJsonBody,
} from "@/lib/public-api.server";

const schema = z.object({
  language: z.literal("sv").default("sv"),
  disclosureAccepted: z.literal(true),
});

export const Route = createFileRoute("/api/public/voice-demo-sessions")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) =>
        new Response(null, { status: 204, headers: publicCorsHeaders(request) }),
      POST: async ({ request }) => {
        const cors = publicCorsHeaders(request);
        if (!isAllowedPublicOrigin(request))
          return json({ ok: false, error: "Forbidden." }, 403, cors);
        const inMemoryLimit = checkRateLimit(request, "voice-demo", {
          limit: 3,
          windowMs: 24 * 60 * 60_000,
        });
        if (!inMemoryLimit.allowed) {
          return json({ ok: false, error: "Du har nått dagens gräns för röstdemon." }, 429, {
            ...cors,
            "Retry-After": String(inMemoryLimit.retryAfterSeconds),
          });
        }

        let sessionId: string | null = null;
        try {
          const parsed = schema.safeParse(await readJsonBody(request));
          if (!parsed.success) {
            return json({ ok: false, error: "Bekräfta AI-informationen först." }, 400, cors);
          }
          const apiKey = process.env.RETELL_API_KEY;
          const agentId = process.env.RETELL_WEB_DEMO_AGENT_ID_SV;
          if (!apiKey || !agentId) {
            return json(
              {
                ok: false,
                error: "Röstdemon är inte ansluten ännu. Använd det simulerade samtalet.",
              },
              503,
              cors,
            );
          }

          const fingerprint = await hashClient(request);
          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            const { data, error } = await supabaseAdmin.rpc("reserve_voice_demo_session", {
              p_client_hash: fingerprint,
              p_language: parsed.data.language,
            });
            if (error) {
              const message = String(error.message || "");
              if (message.includes("voice_demo_daily_limit")) {
                return json(
                  { ok: false, error: "Du har nått dagens gräns för röstdemon." },
                  429,
                  cors,
                );
              }
              if (message.includes("voice_demo_monthly_limit")) {
                return json(
                  {
                    ok: false,
                    error: "Månadens demokvot är nådd. Använd det simulerade samtalet.",
                  },
                  429,
                  cors,
                );
              }
              throw error;
            }
            sessionId = String(data);
          } catch (error) {
            if (process.env.NODE_ENV === "production") throw error;
            sessionId = crypto.randomUUID();
          }

          const response = await fetch("https://api.retellai.com/v2/create-web-call", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              agent_id: agentId,
              agent_version: "latest_published",
              metadata: {
                source: "leadmap_vvs_web_demo",
                leadmap_voice_demo_session_id: sessionId,
              },
              retell_llm_dynamic_variables: {
                demo_disclosure:
                  "Börja med att tydligt säga att du är Leadmaps AI-demo och be användaren att inte dela känsliga uppgifter.",
              },
              agent_override: {
                agent: {
                  max_call_duration_ms: 120000,
                  data_storage_setting: "basic_attributes_only",
                  data_storage_retention_days: 1,
                },
              },
            }),
          });
          const data = (await response.json().catch(() => null)) as {
            access_token?: string;
            call_id?: string;
            message?: string;
          } | null;
          if (!response.ok || !data?.access_token || !data.call_id) {
            throw new Error(data?.message || `RETELL_CREATE_FAILED_${response.status}`);
          }

          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            await supabaseAdmin
              .from("voice_demo_sessions")
              .update({
                status: "issued",
                retell_call_id: data.call_id,
                updated_at: new Date().toISOString(),
              })
              .eq("id", sessionId);
          } catch (error) {
            if (process.env.NODE_ENV === "production") throw error;
          }

          return json(
            {
              ok: true,
              accessToken: data.access_token,
              callId: data.call_id,
              expiresInSeconds: 30,
              maxDurationSeconds: 120,
            },
            201,
            cors,
          );
        } catch (error) {
          console.error("[leadmap] voice demo session failed", error);
          if (sessionId) {
            try {
              const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
              await supabaseAdmin
                .from("voice_demo_sessions")
                .update({
                  status: "failed",
                  error_code: "session_create_failed",
                  updated_at: new Date().toISOString(),
                })
                .eq("id", sessionId);
            } catch {
              // The original error is the useful signal.
            }
          }
          return json(
            { ok: false, error: "Röstdemon kunde inte starta. Använd det simulerade samtalet." },
            503,
            cors,
          );
        }
      },
    },
  },
});

async function hashClient(request: Request) {
  const salt = process.env.VOICE_DEMO_RATE_LIMIT_SALT || "leadmap-local-preview";
  const encoded = new TextEncoder().encode(`${salt}:${clientKey(request)}`);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
  });
}
