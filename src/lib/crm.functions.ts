import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const listLeads = createServerFn({ method: "GET" }).handler(async () => {
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

export const listMessages = createServerFn({ method: "GET" }).handler(async () => {
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
  .inputValidator((input) => toggleSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("leads")
      .update({ contacted: data.contacted })
      .eq("id", data.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true, error: null as string | null };
  });

export const setMessageContacted = createServerFn({ method: "POST" })
  .inputValidator((input) => toggleSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("messages")
      .update({ contacted: data.contacted })
      .eq("id", data.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true, error: null as string | null };
  });

const listNotesSchema = z.object({
  customerKey: z.string().min(1).max(320),
});

export const listCustomerNotes = createServerFn({ method: "GET" })
  .inputValidator((input) => listNotesSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: notes, error } = await supabaseAdmin
      .from("customer_notes")
      .select("id, customer_key, body, created_at")
      .eq("customer_key", data.customerKey.toLowerCase())
      .order("created_at", { ascending: false });
    if (error) return { notes: [], error: error.message };
    return { notes: notes ?? [], error: null as string | null };
  });

const addNoteSchema = z.object({
  customerKey: z.string().min(1).max(320),
  body: z.string().trim().min(1).max(4000),
});

export const addCustomerNote = createServerFn({ method: "POST" })
  .inputValidator((input) => addNoteSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("customer_notes").insert({
      customer_key: data.customerKey.toLowerCase(),
      body: data.body,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, error: null as string | null };
  });

const customerSchema = z.object({
  customerKey: z.string().min(1).max(320),
});

export const getCustomerHistory = createServerFn({ method: "GET" })
  .inputValidator((input) => customerSchema.parse(input))
  .handler(async ({ data }) => {
    const key = data.customerKey.toLowerCase();
    const [{ data: msgs }, { data: leads }, { data: notes }] = await Promise.all([
      supabaseAdmin
        .from("messages")
        .select("id, name, email, message, contacted, created_at")
        .ilike("email", key)
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("leads")
        .select("id, name, company, phone, preferred_time, contacted, created_at")
        .or(`phone.eq.${key},name.ilike.${key}`)
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("customer_notes")
        .select("id, customer_key, body, created_at")
        .eq("customer_key", key)
        .order("created_at", { ascending: false }),
    ]);
    return {
      messages: msgs ?? [],
      leads: leads ?? [],
      notes: notes ?? [],
    };
  });
