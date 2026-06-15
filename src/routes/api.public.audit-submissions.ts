import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  businessName: z.string().trim().min(1).max(140),
  ownerName: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(6).max(32).regex(/^[+0-9\s\-()]+$/),
  email: z.string().trim().email().max(180),
  niche: z.string().trim().min(1).max(120),
  city: z.string().trim().min(1).max(100),
  website: z.string().trim().max(220).optional().default(""),
  missedCallsPerWeek: z.string().trim().max(80).optional().default(""),
  preferredContactMethod: z.string().trim().max(40).optional().default("E-post"),
  source_page: z.string().trim().max(300).optional().default("/missade-samtal-audit"),
  city_page: z.string().trim().max(120).optional().default(""),
  niche_page: z.string().trim().max(120).optional().default(""),
  case_study_page: z.string().trim().max(120).optional().default(""),
  utm_source: z.string().trim().max(120).optional().default("website"),
  utm_medium: z.string().trim().max(120).optional().default("audit_funnel"),
  utm_campaign: z.string().trim().max(160).optional().default("missade_samtal_audit"),
});

const ALLOWED_ORIGINS = new Set([
  "https://www.leadmap.se",
  "https://leadmap.se",
  "https://leadline-ai-receptionist-pro.lovable.app",
  "https://id-preview--db12fc5f-e412-441a-9002-745e2cbf253f.lovable.app",
]);

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin");
  const allowedOrigin =
    origin && (ALLOWED_ORIGINS.has(origin) || origin.startsWith("http://localhost:"))
      ? origin
      : "https://www.leadmap.se";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  } as const;
}

export const Route = createFileRoute("/api/public/audit-submissions")({
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
              JSON.stringify({ ok: false, error: "Invalid input.", issues: parsed.error.flatten().fieldErrors }),
              { status: 400, headers: { "Content-Type": "application/json", ...cors } },
            );
          }

          const input = parsed.data;
          const auditData = {
            missed_calls_per_week: input.missedCallsPerWeek,
            preferred_contact_method: input.preferredContactMethod,
            website: input.website,
            source_page: input.source_page,
            city_page: input.city_page,
            niche_page: input.niche_page,
            case_study_page: input.case_study_page,
            utm_source: input.utm_source,
            utm_medium: input.utm_medium,
            utm_campaign: input.utm_campaign,
          };
          const notes = [
            "Website audit submission",
            `Niche: ${input.niche}`,
            `City: ${input.city}`,
            `Preferred contact: ${input.preferredContactMethod}`,
            input.missedCallsPerWeek ? `Estimated missed calls/week: ${input.missedCallsPerWeek}` : null,
            input.website ? `Website: ${input.website}` : null,
            `Source page: ${input.source_page}`,
            `UTM: ${input.utm_source}/${input.utm_medium}/${input.utm_campaign}`,
          ]
            .filter(Boolean)
            .join("\n");

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          const crmPayload = {
            name: input.businessName,
            business_name: input.businessName,
            owner_name: input.ownerName,
            phone: input.phone,
            email: input.email,
            city: input.city,
            category: input.niche,
            niche_label: input.niche,
            website: input.website || null,
            status: "interested",
            section: "both",
            product: "leadmap",
            lead_source: "website_audit",
            source_page: input.source_page,
            source_campaign: input.utm_campaign,
            utm_source: input.utm_source,
            utm_medium: input.utm_medium,
            utm_campaign: input.utm_campaign,
            preferred_contact_method: input.preferredContactMethod,
            audit_data: auditData,
            website_demo_requested: true,
            seo_landing_page: input.city_page || input.niche_page ? input.source_page : null,
            case_study_page: input.case_study_page || null,
            notes,
            user_agent: request.headers.get("user-agent") ?? null,
          };

          const { error: crmError } = await (supabaseAdmin as any).from("leads").insert(crmPayload);

          if (crmError) {
            const fallbackPayload = {
              name: input.ownerName,
              company: input.businessName,
              phone: input.phone,
              preferred_time: `Audit via ${input.preferredContactMethod}. ${notes}`,
              user_agent: request.headers.get("user-agent") ?? null,
            };
            const { error: fallbackError } = await supabaseAdmin.from("leads").insert(fallbackPayload);
            if (fallbackError) {
              console.error("[leadmap] audit insert failed", { crmError, fallbackError });
              return new Response(JSON.stringify({ ok: false, error: "Server error." }), {
                status: 500,
                headers: { "Content-Type": "application/json", ...cors },
              });
            }
          }

          try {
            const { queueOwnerNotification } = await import("@/lib/owner-notifications.server");
            await queueOwnerNotification("owner-message-notification", {
              name: input.ownerName,
              email: input.email,
              message: notes,
            });
          } catch (notificationError) {
            console.error("[leadmap] audit notification failed", notificationError);
          }

          return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json", ...cors },
          });
        } catch (err) {
          console.error("[leadmap] audit handler failed", err);
          return new Response(JSON.stringify({ ok: false, error: "Server error." }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...cors },
          });
        }
      },
    },
  },
});
