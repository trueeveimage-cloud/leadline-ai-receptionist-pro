import { createFileRoute } from "@tanstack/react-router";
import {
  calendarRules,
  getAvailableCalendarSlots,
  isGoogleCalendarConfigured,
} from "@/lib/google-calendar.server";
import { checkRateLimit, isAllowedPublicOrigin, publicCorsHeaders } from "@/lib/public-api.server";

export const Route = createFileRoute("/api/public/availability")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) =>
        new Response(null, { status: 204, headers: publicCorsHeaders(request, "GET, OPTIONS") }),
      GET: async ({ request }) => {
        const cors = publicCorsHeaders(request, "GET, OPTIONS");
        if (!isAllowedPublicOrigin(request))
          return json({ ok: false, error: "Forbidden." }, 403, cors);
        const limit = checkRateLimit(request, "availability", { limit: 30, windowMs: 10 * 60_000 });
        if (!limit.allowed) {
          return json({ ok: false, error: "För många försök." }, 429, {
            ...cors,
            "Retry-After": String(limit.retryAfterSeconds),
          });
        }

        try {
          let reservedStarts: string[] = [];
          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            const upper = new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString();
            const { data, error } = await supabaseAdmin
              .from("demo_bookings")
              .select("starts_at, status, updated_at")
              .in("status", ["reserved", "confirmed"])
              .gte("starts_at", new Date().toISOString())
              .lte("starts_at", upper);
            if (error) throw error;
            const staleBefore = Date.now() - 10 * 60_000;
            reservedStarts = (data || [])
              .filter(
                (row: { status: string; updated_at: string }) =>
                  row.status === "confirmed" || new Date(row.updated_at).getTime() >= staleBefore,
              )
              .map((row: { starts_at: string }) => row.starts_at);
          } catch (error) {
            if (process.env.NODE_ENV === "production") throw error;
          }

          const configured = isGoogleCalendarConfigured();
          if (!configured && process.env.NODE_ENV === "production") {
            return json({ ok: false, error: "Kalendern är inte ansluten ännu." }, 503, cors);
          }
          const slots = await getAvailableCalendarSlots({ extraBusyStarts: reservedStarts });
          return json(
            {
              ok: true,
              preview: !configured,
              timezone: "Europe/Stockholm",
              rules: calendarRules,
              slots,
            },
            200,
            cors,
          );
        } catch (error) {
          console.error("[leadmap] availability failed", error);
          return json({ ok: false, error: "Kunde inte hämta lediga tider." }, 503, cors);
        }
      },
    },
  },
});

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
  });
}
