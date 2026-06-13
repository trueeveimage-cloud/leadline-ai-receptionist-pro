import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(160),
  message: z.string().trim().min(5).max(2000),
});

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

export const Route = createFileRoute("/api/public/messages")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => null);
          const parsed = schema.safeParse(body);
          if (!parsed.success) {
            return new Response(
              JSON.stringify({ ok: false, error: "Invalid input." }),
              { status: 400, headers: { "Content-Type": "application/json", ...CORS } },
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
              { status: 500, headers: { "Content-Type": "application/json", ...CORS } },
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
            headers: { "Content-Type": "application/json", ...CORS },
          });
        } catch (err) {
          console.error("[leadmap] message handler failed", err);
          return new Response(
            JSON.stringify({ ok: false, error: "Server error." }),
            { status: 500, headers: { "Content-Type": "application/json", ...CORS } },
          );
        }
      },
    },
  },
});
