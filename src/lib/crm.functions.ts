import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("id, name, company, phone, preferred_time, contacted, user_agent, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      console.error("[crm] listLeads failed", error);
      return { leads: [], error: error.message };
    }
    return { leads: data ?? [], error: null as string | null };
  });

export const listMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("messages")
      .select("id, name, email, message, contacted, user_agent, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      console.error("[crm] listMessages failed", error);
      return { messages: [], error: error.message };
    }
    return { messages: data ?? [], error: null as string | null };
  });

const toggleSchema = z.object({
  id: z.string().uuid(),
  contacted: z.boolean(),
});

export const setLeadContacted = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => toggleSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("leads")
      .update({ contacted: data.contacted })
      .eq("id", data.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true, error: null as string | null };
  });

export const setMessageContacted = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => toggleSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("messages")
      .update({ contacted: data.contacted })
      .eq("id", data.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true, error: null as string | null };
  });

const listNotesSchema = z.object({
  customerKey: z.string().min(1).max(320).regex(/^[a-zA-Z0-9._@+\- ]+$/),
});

export const listCustomerNotes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => listNotesSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: notes, error } = await supabaseAdmin
      .from("customer_notes")
      .select("id, customer_key, body, created_at")
      .eq("customer_key", data.customerKey.toLowerCase())
      .order("created_at", { ascending: false });
    if (error) return { notes: [], error: error.message };
    return { notes: notes ?? [], error: null as string | null };
  });

const addNoteSchema = z.object({
  customerKey: z.string().min(1).max(320).regex(/^[a-zA-Z0-9._@+\- ]+$/),
  body: z.string().trim().min(1).max(4000),
});

export const addCustomerNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => addNoteSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("customer_notes").insert({
      customer_key: data.customerKey.toLowerCase(),
      body: data.body,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, error: null as string | null };
  });

const customerSchema = z.object({
  customerKey: z.string().min(1).max(320).regex(/^[a-zA-Z0-9._@+\- ]+$/),
});

export const getCustomerHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => customerSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const key = data.customerKey.toLowerCase();
    const [msgsRes, leadsByPhone, leadsByName, notesRes] = await Promise.all([
      supabaseAdmin
        .from("messages")
        .select("id, name, email, message, contacted, created_at")
        .ilike("email", key)
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("leads")
        .select("id, name, company, phone, preferred_time, contacted, created_at")
        .eq("phone", key)
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("leads")
        .select("id, name, company, phone, preferred_time, contacted, created_at")
        .ilike("name", key)
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("customer_notes")
        .select("id, customer_key, body, created_at")
        .eq("customer_key", key)
        .order("created_at", { ascending: false }),
    ]);
    const leadsMap = new Map<string, NonNullable<typeof leadsByPhone.data>[number]>();
    for (const l of leadsByPhone.data ?? []) leadsMap.set(l.id, l);
    for (const l of leadsByName.data ?? []) leadsMap.set(l.id, l);
    return {
      messages: msgsRes.data ?? [],
      leads: Array.from(leadsMap.values()),
      notes: notesRes.data ?? [],
    };
  });
