import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  checkRateLimit,
  isAllowedPublicOrigin,
  publicCorsHeaders,
  readJsonBody,
} from "@/lib/public-api.server";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(160),
  message: z.string().trim().min(5).max(2000),
  website: z.string().max(0).optional().default(""),
});

export const Route = createFileRoute("/api/public/messages")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) =>
        new Response(null, { status: 204, headers: publicCorsHeaders(request) }),
      POST: async ({ request }) => {
        const cors = publicCorsHeaders(request);
        if (!isAllowedPublicOrigin(request)) {
          return new Response(JSON.stringify({ ok: false, error: "Forbidden." }), {
            status: 403,
            headers: { "Content-Type": "application/json", ...cors },
          });
        }
        const limit = checkRateLimit(request, "contact", { limit: 5, windowMs: 10 * 60_000 });
        if (!limit.allowed) {
          return new Response(JSON.stringify({ ok: false, error: "Too many requests." }), {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": String(limit.retryAfterSeconds),
              ...cors,
            },
          });
        }
        try {
          const body = await readJsonBody(request);
          const parsed = schema.safeParse(body);
          if (!parsed.success) {
            return new Response(JSON.stringify({ ok: false, error: "Invalid input." }), {
              status: 400,
              headers: { "Content-Type": "application/json", ...cors },
            });
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
            return new Response(JSON.stringify({ ok: false, error: "Server error." }), {
              status: 500,
              headers: { "Content-Type": "application/json", ...cors },
            });
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
          return new Response(JSON.stringify({ ok: false, error: "Server error." }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...cors },
          });
        }
      },
    },
  },
});
