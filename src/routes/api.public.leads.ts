import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  createCalendarDemo,
  getAvailableCalendarSlots,
  isGoogleCalendarConfigured,
} from "@/lib/google-calendar.server";
import { recordServerMarketingEvent } from "@/lib/marketing-events.server";
import {
  checkRateLimit,
  isAllowedPublicOrigin,
  publicCorsHeaders,
  readJsonBody,
} from "@/lib/public-api.server";

const optionalText = (max: number) => z.string().trim().max(max).optional().default("");
const attributionSchema = z.object({
  source_page: optionalText(300),
  landing_path: optionalText(300),
  page_type: optionalText(80),
  cta_variant: optionalText(80),
  niche: optionalText(100),
  city: optionalText(100),
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
const schema = z.object({
  submissionId: z.string().uuid(),
  advertisingConsent: z.boolean().optional().default(false),
  name: z.string().trim().min(1).max(100),
  company: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(180),
  phone: z
    .string()
    .trim()
    .max(32)
    .refine((value) => !value || /^[+0-9\s\-()]+$/.test(value), "Invalid phone"),
  isVvsCompany: z.literal(true),
  isDecisionMaker: z.literal(true),
  hasMissedCallNeed: z.literal(true),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slot: z.string().regex(/^\d{2}:\d{2}$/),
  timezone: z.literal("Europe/Stockholm"),
  website: z.string().max(0).optional().default(""),
  attribution: attributionSchema,
});

export const Route = createFileRoute("/api/public/leads")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) =>
        new Response(null, { status: 204, headers: publicCorsHeaders(request) }),
      POST: async ({ request }) => {
        const cors = publicCorsHeaders(request);
        if (!isAllowedPublicOrigin(request))
          return json({ ok: false, error: "Forbidden." }, 403, cors);
        const limit = checkRateLimit(request, "booking", { limit: 5, windowMs: 10 * 60_000 });
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
              { ok: false, error: "Kontrollera uppgifter och kvalificering." },
              400,
              cors,
            );
          }
          const input = parsed.data;
          if (input.website) return json({ ok: true }, 200, cors);
          if (!isGoogleCalendarConfigured()) {
            return json({ ok: false, error: "Kalendern är inte ansluten ännu." }, 503, cors);
          }

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const db = supabaseAdmin;
          const { data: existingBooking, error: existingError } = await db
            .from("demo_bookings")
            .select("id, status, starts_at, ends_at, meet_url, updated_at")
            .eq("submission_id", input.submissionId)
            .maybeSingle();
          if (existingError) throw existingError;
          if (existingBooking?.status === "confirmed") {
            return json(
              {
                ok: true,
                duplicate: true,
                bookingId: existingBooking.id,
                startsAt: existingBooking.starts_at,
                endsAt: existingBooking.ends_at,
                meetUrl: existingBooking.meet_url,
              },
              200,
              cors,
            );
          }
          const reservationIsFresh =
            existingBooking?.status === "reserved" &&
            new Date(existingBooking.updated_at).getTime() >= Date.now() - 10 * 60_000;
          if (reservationIsFresh) {
            return json({ ok: false, error: "Bokningen behandlas redan." }, 409, cors);
          }

          const { data: activeReservations, error: reservationsError } = await db
            .from("demo_bookings")
            .select("id, starts_at, status, updated_at")
            .in("status", ["reserved", "confirmed"])
            .gte("starts_at", new Date().toISOString());
          if (reservationsError) throw reservationsError;
          const staleBefore = Date.now() - 10 * 60_000;
          const available = await getAvailableCalendarSlots({
            ignoreBookingId: existingBooking?.id,
            extraBusyStarts: (activeReservations || [])
              .filter(
                (row: { id: string; status: string; updated_at: string }) =>
                  row.id !== existingBooking?.id &&
                  (row.status === "confirmed" || new Date(row.updated_at).getTime() >= staleBefore),
              )
              .map((row: { starts_at: string }) => row.starts_at),
          });
          const selectedSlot = available.find(
            (candidate) => candidate.date === input.date && candidate.time === input.slot,
          );
          if (!selectedSlot) {
            return json(
              { ok: false, code: "slot_unavailable", error: "Tiden är inte längre ledig." },
              409,
              cors,
            );
          }

          const { data: bookingId, error: reserveError } = await db.rpc("reserve_demo_booking", {
            p_submission_id: input.submissionId,
            p_name: input.name,
            p_company: input.company,
            p_email: input.email,
            p_phone: input.phone,
            p_is_vvs_company: input.isVvsCompany,
            p_is_decision_maker: input.isDecisionMaker,
            p_has_missed_call_need: input.hasMissedCallNeed,
            p_starts_at: selectedSlot.startsAt,
            p_ends_at: selectedSlot.endsAt,
          });
          if (reserveError) {
            const message = String(reserveError.message || "");
            if (
              message.includes("booking_day_full") ||
              message.includes("booking_slot_taken") ||
              message.includes("booking_in_progress")
            ) {
              return json(
                { ok: false, code: "slot_unavailable", error: "Tiden är inte längre ledig." },
                409,
                cors,
              );
            }
            throw reserveError;
          }

          const leadPayload = {
            name: input.name,
            company: input.company,
            owner_name: input.name,
            email: input.email.toLowerCase(),
            phone: input.phone || null,
            preferred_time: `${input.date} ${input.slot} (Europe/Stockholm)`,
            status: "qualified",
            section: "demo",
            product: "leadmap",
            lead_source: "website_demo",
            source_page: input.attribution.source_page || null,
            source_campaign: input.attribution.utm_campaign || null,
            utm_source: input.attribution.utm_source || null,
            utm_medium: input.attribution.utm_medium || null,
            utm_campaign: input.attribution.utm_campaign || null,
            utm_term: input.attribution.utm_term || null,
            utm_content: input.attribution.utm_content || null,
            gclid: input.attribution.gclid || null,
            gbraid: input.attribution.gbraid || null,
            wbraid: input.attribution.wbraid || null,
            fbclid: input.attribution.fbclid || null,
            marketing_submission_id: input.submissionId,
            advertising_consent: input.advertisingConsent,
            booking_id: bookingId,
            is_vvs_company: true,
            is_decision_maker: true,
            has_missed_call_need: true,
            calendar_starts_at: selectedSlot.startsAt,
            booking_status: "reserved",
            notes: `Qualified VVS demo from ${input.attribution.source_page || "website"}`,
            user_agent: request.headers.get("user-agent") || null,
          };

          let leadId: string;
          const { data: insertedLead, error: leadError } = await db
            .from("leads")
            .insert(leadPayload)
            .select("id")
            .single();
          if (leadError?.code === "23505") {
            const { data: duplicateLead, error: duplicateError } = await db
              .from("leads")
              .select("id")
              .eq("marketing_submission_id", input.submissionId)
              .single();
            if (duplicateError || !duplicateLead?.id) throw duplicateError || leadError;
            leadId = duplicateLead.id;
          } else if (leadError || !insertedLead?.id) {
            throw leadError || new Error("LEAD_INSERT_FAILED");
          } else {
            leadId = insertedLead.id;
          }

          let calendarBooking;
          try {
            calendarBooking = await createCalendarDemo({
              bookingId: String(bookingId),
              company: input.company,
              name: input.name,
              email: input.email,
              phone: input.phone,
              slot: selectedSlot,
            });
          } catch (calendarError) {
            await db
              .from("demo_bookings")
              .update({
                status: "failed",
                error_code: "calendar_create_failed",
                updated_at: new Date().toISOString(),
              })
              .eq("id", bookingId);
            await db.from("leads").update({ booking_status: "failed" }).eq("id", leadId);
            throw calendarError;
          }

          const confirmationUpdate = {
            status: "confirmed",
            calendar_event_id: calendarBooking.eventId,
            meet_url: calendarBooking.meetUrl,
            updated_at: new Date().toISOString(),
          };
          const [{ error: bookingUpdateError }, { error: leadUpdateError }] = await Promise.all([
            db.from("demo_bookings").update(confirmationUpdate).eq("id", bookingId),
            db
              .from("leads")
              .update({
                status: "demo_booked",
                booking_status: "confirmed",
                calendar_event_id: calendarBooking.eventId,
                meet_url: calendarBooking.meetUrl,
              })
              .eq("id", leadId),
          ]);
          if (bookingUpdateError || leadUpdateError) {
            console.error("[leadmap] booking persisted partially after Calendar success", {
              bookingUpdateError,
              leadUpdateError,
              bookingId,
            });
          }

          try {
            await recordServerMarketingEvent({
              eventId: input.submissionId,
              eventName: "demo_booked",
              leadId,
              attribution: input.attribution,
              metadata: {
                booking_id: bookingId,
                starts_at: calendarBooking.startsAt,
                calendar_confirmed: true,
                advertising_consent: input.advertisingConsent,
              },
            });
          } catch (eventError) {
            console.error("[leadmap] confirmed booking event failed", eventError);
          }

          try {
            const { queueOwnerNotification } = await import("@/lib/owner-notifications.server");
            await queueOwnerNotification("owner-booking-notification", {
              name: input.name,
              company: input.company,
              email: input.email,
              phone: input.phone,
              preferredTime: `${input.date} ${input.slot} (Europe/Stockholm)`,
              meetUrl: calendarBooking.meetUrl,
            });
          } catch (notificationError) {
            console.error("[leadmap] booking notification failed", notificationError);
          }

          return json(
            {
              ok: true,
              duplicate: false,
              bookingId,
              startsAt: calendarBooking.startsAt,
              endsAt: calendarBooking.endsAt,
              meetUrl: calendarBooking.meetUrl,
            },
            201,
            cors,
          );
        } catch (error) {
          console.error("[leadmap] booking handler failed", error);
          return json(
            {
              ok: false,
              error: "Mötet kunde inte bekräftas. Välj en annan tid eller försök igen.",
            },
            503,
            cors,
          );
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
