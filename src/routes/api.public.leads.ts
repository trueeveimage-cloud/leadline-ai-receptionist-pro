import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  company: z.string().trim().min(1).max(120),
  phone: z
    .string()
    .trim()
    .min(6)
    .max(32)
    .regex(/^[+0-9\s\-()]+$/),
  time: z.string().trim().min(1).max(60),
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

          // Log the lead (visible in server-function-logs).
          // Hook this up to an email/CRM later.
          console.log("[leadline] new lead", {
            ...parsed.data,
            ua: request.headers.get("user-agent") ?? "",
            at: new Date().toISOString(),
          });

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
