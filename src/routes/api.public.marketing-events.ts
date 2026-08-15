import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  checkRateLimit,
  isAllowedPublicOrigin,
  publicCorsHeaders,
  readJsonBody,
} from "@/lib/public-api.server";
import { recordServerMarketingEvent } from "@/lib/marketing-events.server";

const publicEventNames = ["landing_view", "audit_start", "demo_open"] as const;
const optionalText = z.string().trim().max(300).optional().default("");
const attributionSchema = z.object({
  source_page: optionalText,
  landing_path: optionalText,
  page_type: z.string().trim().max(80).optional().default(""),
  cta_variant: z.string().trim().max(80).optional().default(""),
  niche: z.string().trim().max(100).optional().default(""),
  city: z.string().trim().max(100).optional().default(""),
  utm_source: z.string().trim().max(120).optional().default(""),
  utm_medium: z.string().trim().max(120).optional().default(""),
  utm_campaign: z.string().trim().max(160).optional().default(""),
  utm_term: z.string().trim().max(200).optional().default(""),
  utm_content: z.string().trim().max(200).optional().default(""),
  gclid: z.string().trim().max(300).optional().default(""),
  gbraid: z.string().trim().max(300).optional().default(""),
  wbraid: z.string().trim().max(300).optional().default(""),
  fbclid: z.string().trim().max(300).optional().default(""),
  referrer: optionalText,
});
const schema = z.object({
  eventId: z.string().uuid(),
  eventName: z.enum(publicEventNames),
  attribution: attributionSchema,
  metadata: z
    .record(z.string(), z.union([z.string().max(500), z.number(), z.boolean(), z.null()]))
    .optional()
    .default({}),
});

export const Route = createFileRoute("/api/public/marketing-events")({
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
        const limit = checkRateLimit(request, "marketing-events", { limit: 30, windowMs: 60_000 });
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
          const parsed = schema.safeParse(await readJsonBody(request));
          if (!parsed.success) {
            return new Response(JSON.stringify({ ok: false, error: "Invalid input." }), {
              status: 400,
              headers: { "Content-Type": "application/json", ...cors },
            });
          }
          await recordServerMarketingEvent(parsed.data);
          return new Response(null, { status: 204, headers: cors });
        } catch (error) {
          console.error("[leadmap] marketing event failed", error);
          return new Response(JSON.stringify({ ok: false }), {
            status: 202,
            headers: { "Content-Type": "application/json", ...cors },
          });
        }
      },
    },
  },
});
