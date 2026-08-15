export type ServerMarketingEventName =
  | "landing_view"
  | "audit_start"
  | "audit_submit"
  | "demo_open"
  | "demo_booked"
  | "qualified_lead"
  | "pilot_won";

export type ServerMarketingAttribution = {
  source_page?: string;
  landing_path?: string;
  page_type?: string;
  cta_variant?: string;
  niche?: string;
  city?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  referrer?: string;
};

type MarketingEventsWriter = {
  from: (table: "marketing_events") => {
    upsert: (
      values: Record<string, unknown>,
      options: { onConflict: string; ignoreDuplicates: boolean },
    ) => Promise<{ error: { message?: string } | null }>;
  };
};

export async function recordServerMarketingEvent(input: {
  eventId: string;
  eventName: ServerMarketingEventName;
  leadId?: string;
  attribution?: ServerMarketingAttribution;
  metadata?: Record<string, unknown>;
}) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const attribution = input.attribution || {};
  const writer = supabaseAdmin as unknown as MarketingEventsWriter;
  const { error } = await writer.from("marketing_events").upsert(
    {
      event_id: input.eventId,
      lead_id: input.leadId || null,
      product: "leadmap",
      event_name: input.eventName,
      source_page: attribution.source_page || null,
      landing_path: attribution.landing_path || null,
      page_type: attribution.page_type || null,
      cta_variant: attribution.cta_variant || null,
      niche: attribution.niche || null,
      city: attribution.city || null,
      utm_source: attribution.utm_source || null,
      utm_medium: attribution.utm_medium || null,
      utm_campaign: attribution.utm_campaign || null,
      utm_term: attribution.utm_term || null,
      utm_content: attribution.utm_content || null,
      gclid: attribution.gclid || null,
      gbraid: attribution.gbraid || null,
      wbraid: attribution.wbraid || null,
      fbclid: attribution.fbclid || null,
      referrer: attribution.referrer || null,
      metadata: input.metadata || {},
    },
    { onConflict: "event_id", ignoreDuplicates: true },
  );
  if (error) throw error;
}
