import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { queueOwnerNotification } from "@/lib/owner-notifications.server";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  company: z.string().trim().min(1).max(120),
  phone: z
    .string()
    .trim()
    .min(6)
    .max(32)
    .regex(/^[+0-9\s\-()]+$/),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slot: z.string().regex(/^\d{2}:\d{2}$/),
  timezone: z.string().trim().min(1).max(80),
});

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

export const Route = createFileRoute("/api/public/leads")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => null);
          const parsed = schema.safeParse(body);
          if (!parsed.success) {
            return new Response(
              JSON.stringify({
                ok: false,
                error: "Invalid input.",
                issues: parsed.error.flatten().fieldErrors,
              }),
              { status: 400, headers: { "Content-Type": "application/json", ...CORS } },
            );
          }

          const { error: insertError } = await supabaseAdmin
            .from("leads")
            .insert({
              name: parsed.data.name,
              company: parsed.data.company,
              phone: parsed.data.phone,
              preferred_time: `${parsed.data.date} ${parsed.data.slot} (${parsed.data.timezone})`,
              user_agent: request.headers.get("user-agent") ?? null,
            });

          if (insertError) {
            console.error("[leadline] insert failed", insertError);
            return new Response(
              JSON.stringify({ ok: false, error: "Server error." }),
              { status: 500, headers: { "Content-Type": "application/json", ...CORS } },
            );
          }

          try {
            await queueOwnerNotification("owner-booking-notification", {
              name: parsed.data.name,
              company: parsed.data.company,
              phone: parsed.data.phone,
              preferredTime: `${parsed.data.date} ${parsed.data.slot} (${parsed.data.timezone})`,
            });
          } catch (notificationError) {
            console.error("[leadline] booking notification failed", notificationError);
          }

          return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json", ...CORS },
          });
        } catch (err) {
          console.error("[leadline] lead handler failed", err);
          return new Response(
            JSON.stringify({ ok: false, error: "Server error." }),
            { status: 500, headers: { "Content-Type": "application/json", ...CORS } },
          );
        }
      },
    },
  },
});
