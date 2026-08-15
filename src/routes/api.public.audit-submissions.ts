import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { recordServerMarketingEvent } from "@/lib/marketing-events.server";
import {
  checkRateLimit,
  isAllowedPublicOrigin,
  publicCorsHeaders,
  readJsonBody,
} from "@/lib/public-api.server";

const contact = z
  .string()
  .trim()
  .min(6)
  .max(180)
  .refine(
    (value) => z.string().email().safeParse(value).success || /^[+0-9\s\-()]{6,32}$/.test(value),
    "Ange ett giltigt telefonnummer eller en giltig e-postadress.",
  );
const optionalText = (max: number) => z.string().trim().max(max).optional().default("");
const schema = z.object({
  submissionId: z.string().uuid(),
  advertisingConsent: z.boolean().optional().default(false),
  businessName: z.string().trim().min(1).max(140),
  ownerName: z.string().trim().min(1).max(100),
  contact,
  niche: z.literal("VVS").optional().default("VVS"),
  city: optionalText(100),
  website: optionalText(220),
  missedCallsPerWeek: optionalText(80),
  companyWebsite: z.string().max(0).optional().default(""),
  source_page: optionalText(300),
  landing_path: optionalText(300),
  page_type: optionalText(80),
  cta_variant: optionalText(80),
  utm_source: optionalText(120),
  utm_medium: optionalText(120),
  utm_campaign: optionalText(160),
  utm_term: optionalText(200),
  utm_content: optionalText(200),
  gclid: optionalText(300),
  gbraid: optionalText(300),
  wbraid: optionalText(300),
  fbclid: optionalText(300),
  referrer: optionalText(300),
});

export const Route = createFileRoute("/api/public/audit-submissions")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) =>
        new Response(null, { status: 204, headers: publicCorsHeaders(request) }),
      POST: async ({ request }) => {
        const cors = publicCorsHeaders(request);
        if (!isAllowedPublicOrigin(request)) {
          return json({ ok: false, error: "Forbidden." }, 403, cors);
        }
        const limit = checkRateLimit(request, "audit", { limit: 5, windowMs: 10 * 60_000 });
        if (!limit.allowed) {
          return json(
            { ok: false, error: "För många försök. Vänta en stund och försök igen." },
            429,
            { ...cors, "Retry-After": String(limit.retryAfterSeconds) },
          );
        }

        try {
          const parsed = schema.safeParse(await readJsonBody(request));
          if (!parsed.success) {
            return json(
              { ok: false, error: "Kontrollera de obligatoriska uppgifterna." },
              400,
              cors,
            );
          }
          const input = parsed.data;
          if (input.companyWebsite) return json({ ok: true }, 200, cors);

          const isEmail = z.string().email().safeParse(input.contact).success;
          const email = isEmail ? input.contact : "";
          const phone = isEmail ? null : input.contact;
          const preferredContactMethod = isEmail ? "E-post" : "Samtal";
          const attribution = {
            source_page: input.source_page || "/missade-samtal-audit",
            landing_path: input.landing_path,
            page_type: input.page_type || "audit",
            cta_variant: input.cta_variant || "audit_form",
            niche: "vvs",
            city: input.city,
            utm_source: input.utm_source,
            utm_medium: input.utm_medium,
            utm_campaign: input.utm_campaign,
            utm_term: input.utm_term,
            utm_content: input.utm_content,
            gclid: input.gclid,
            gbraid: input.gbraid,
            wbraid: input.wbraid,
            fbclid: input.fbclid,
            referrer: input.referrer,
          };
          const notes = [
            "Website audit submission",
            "Niche: VVS",
            input.city ? `City: ${input.city}` : null,
            `Preferred contact: ${preferredContactMethod}`,
            input.missedCallsPerWeek
              ? `Estimated missed calls/week: ${input.missedCallsPerWeek}`
              : null,
            input.website ? `Website: ${input.website}` : null,
            `Source page: ${attribution.source_page}`,
            `UTM: ${input.utm_source}/${input.utm_medium}/${input.utm_campaign}`,
          ]
            .filter(Boolean)
            .join("\n");

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const crmPayload = {
            name: input.ownerName,
            company: input.businessName,
            owner_name: input.ownerName,
            phone,
            email: email || null,
            preferred_time: `Audit via ${preferredContactMethod}`,
            city: input.city || null,
            category: "VVS",
            niche_label: "VVS",
            website: input.website || null,
            status: "interested",
            section: isEmail ? "email" : "phone",
            product: "leadmap",
            lead_source: "website_audit",
            source_page: attribution.source_page,
            source_campaign: input.utm_campaign || null,
            utm_source: input.utm_source || null,
            utm_medium: input.utm_medium || null,
            utm_campaign: input.utm_campaign || null,
            utm_term: input.utm_term || null,
            utm_content: input.utm_content || null,
            gclid: input.gclid || null,
            gbraid: input.gbraid || null,
            wbraid: input.wbraid || null,
            fbclid: input.fbclid || null,
            preferred_contact_method: preferredContactMethod,
            audit_data: {
              missed_calls_per_week: input.missedCallsPerWeek,
              website: input.website,
              attribution,
            },
            website_demo_requested: true,
            seo_landing_page: attribution.landing_path || null,
            notes,
            marketing_submission_id: input.submissionId,
            advertising_consent: input.advertisingConsent,
            user_agent: request.headers.get("user-agent") || null,
          };

          const { error: crmError } = await supabaseAdmin.from("leads").insert(crmPayload);
          const duplicate = crmError?.code === "23505";
          if (crmError && !duplicate) {
            console.error("[leadmap] audit insert failed", { crmError });
            return json({ ok: false, error: "Serverfel. Försök igen senare." }, 500, cors);
          }

          try {
            await recordServerMarketingEvent({
              eventId: input.submissionId,
              eventName: "audit_submit",
              attribution,
              metadata: {
                preferred_contact_method: preferredContactMethod,
                advertising_consent: input.advertisingConsent,
              },
            });
          } catch (eventError) {
            console.error("[leadmap] audit event failed", eventError);
          }

          if (!duplicate) {
            try {
              const { queueOwnerNotification } = await import("@/lib/owner-notifications.server");
              await queueOwnerNotification("owner-message-notification", {
                name: input.ownerName,
                email: email || input.contact,
                message: notes,
              });
            } catch (notificationError) {
              console.error("[leadmap] audit notification failed", notificationError);
            }
          }

          return json({ ok: true, duplicate }, 200, cors);
        } catch (error) {
          console.error("[leadmap] audit handler failed", error);
          return json({ ok: false, error: "Serverfel. Försök igen senare." }, 500, cors);
        }
      },
    },
  },
});

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}
