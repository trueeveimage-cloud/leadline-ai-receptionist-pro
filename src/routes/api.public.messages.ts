import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(160),
  message: z.string().trim().min(5).max(2000),
  website: z.string().max(0).optional().default(""),
});

const ALLOWED_ORIGINS = new Set([
  "https://www.leadmap.se",
  "https://leadmap.se",
  "https://leadline-ai-receptionist-pro.lovable.app",
  "https://id-preview--db12fc5f-e412-441a-9002-745e2cbf253f.lovable.app",
]);

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin");
  const allowedOrigin = origin && (ALLOWED_ORIGINS.has(origin) || origin.startsWith("http://localhost:")) ? origin : "https://www.leadmap.se";
  return {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Vary": "Origin",
  } as const;
}

export const Route = createFileRoute("/api/public/messages")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => new Response(null, { status: 204, headers: corsHeaders(request) }),
      POST: async ({ request }) => {
        const cors = corsHeaders(request);
        try {
          const body = await request.json().catch(() => null);
          const parsed = schema.safeParse(body);
          if (!parsed.success) {
            return new Response(
              JSON.stringify({ ok: false, error: "Invalid input." }),
              { status: 400, headers: { "Content-Type": "application/json", ...cors } },
            );
          }
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { error } = await supabaseAdmin.from("messages").insert({
            name: parsed.data.name,
            email: parsed.data.email,
            message: parsed.data.message,
            user_agent: request.headers.get("user-agent") ?? null,
          });
          if (error) {
            console.error("[leadmap] message insert failed", error);
            return new Response(
              JSON.stringify({ ok: false, error: "Server error." }),
              { status: 500, headers: { "Content-Type": "application/json", ...cors } },
            );
          }
          try {
            const { queueOwnerNotification } = await import("@/lib/owner-notifications.server");
            await queueOwnerNotification("owner-message-notification", parsed.data);
          } catch (notificationError) {
            console.error("[leadmap] message notification failed", notificationError);
          }
          return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json", ...cors },
          });
        } catch (err) {
          console.error("[leadmap] message handler failed", err);
          return new Response(
            JSON.stringify({ ok: false, error: "Server error." }),
            { status: 500, headers: { "Content-Type": "application/json", ...cors } },
          );
        }
      },
    },
  },
});
