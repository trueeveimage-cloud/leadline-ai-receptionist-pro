import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  company: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(180),
  phone: z
    .string()
    .trim()
    .min(6)
    .max(32)
    .regex(/^[+0-9\s\-()]+$/),
  industry: z.enum(["vvs", "electrician", "other"]),
  missedCallsPerWeek: z.string().trim().min(1).max(40),
  preferredContactMethod: z.enum(["email", "sms", "video"]),
  requestType: z.enum(["demo", "pilot"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().default(""),
  slot: z.string().regex(/^\d{2}:\d{2}$/).optional().default(""),
  timezone: z.string().trim().min(1).max(80),
  consent: z.literal(true),
  website: z.string().max(0).optional().default(""),
}).superRefine((value, ctx) => {
  if (value.preferredContactMethod !== "video") return;
  if (!value.date) ctx.addIssue({ code: "custom", path: ["date"], message: "Required for video meetings." });
  if (!value.slot) ctx.addIssue({ code: "custom", path: ["slot"], message: "Required for video meetings." });
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

export const Route = createFileRoute("/api/public/leads")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) =>
        new Response(null, { status: 204, headers: corsHeaders(request) }),
      POST: async ({ request }) => {
        const cors = corsHeaders(request);
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
              { status: 400, headers: { "Content-Type": "application/json", ...cors } },
            );
          }

          const input = parsed.data;
          const meeting = input.preferredContactMethod === "video"
            ? `${input.date} ${input.slot} (${input.timezone})`
            : "No meeting slot requested";
          const notes = [
            `Request: ${input.requestType}`,
            `Industry: ${input.industry}`,
            `Email: ${input.email}`,
            `Mobile: ${input.phone}`,
            `Missed calls/week: ${input.missedCallsPerWeek}`,
            `Preferred contact: ${input.preferredContactMethod}`,
            `Meeting: ${meeting}`,
            "Privacy consent: yes",
          ].join("\n");

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const crmPayload = {
            name: input.company,
            business_name: input.company,
            owner_name: input.name,
            phone: input.phone,
            email: input.email,
            category: input.industry,
            niche_label: input.industry,
            status: "interested",
            section: "both",
            product: "leadmap",
            lead_source: "website_booking",
            preferred_contact_method: input.preferredContactMethod,
            website_demo_requested: input.requestType === "demo",
            notes,
            user_agent: request.headers.get("user-agent") ?? null,
          };

          const { error: crmError } = await (supabaseAdmin as any).from("leads").insert(crmPayload);
          let insertError = crmError;
          if (crmError) {
            const fallback = await supabaseAdmin.from("leads").insert({
              name: input.name,
              company: input.company,
              phone: input.phone,
              preferred_time: notes,
              user_agent: request.headers.get("user-agent") ?? null,
            });
            insertError = fallback.error;
          }

          if (insertError) {
            console.error("[leadline] insert failed", insertError);
            return new Response(
              JSON.stringify({ ok: false, error: "Server error." }),
              { status: 500, headers: { "Content-Type": "application/json", ...cors } },
            );
          }

          try {
            const { queueOwnerNotification } = await import("@/lib/owner-notifications.server");
            await queueOwnerNotification("owner-booking-notification", {
              name: input.name,
              company: input.company,
              email: input.email,
              phone: input.phone,
              industry: input.industry,
              missedCallsPerWeek: input.missedCallsPerWeek,
              preferredContactMethod: input.preferredContactMethod,
              requestType: input.requestType,
              preferredTime: meeting,
            });
          } catch (notificationError) {
            console.error("[leadline] booking notification failed", notificationError);
          }

          return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json", ...cors },
          });
        } catch (err) {
          console.error("[leadline] lead handler failed", err);
          return new Response(
            JSON.stringify({ ok: false, error: "Server error." }),
            { status: 500, headers: { "Content-Type": "application/json", ...cors } },
          );
        }
      },
    },
  },
});
