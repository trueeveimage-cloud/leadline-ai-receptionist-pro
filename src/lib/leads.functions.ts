import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const listLeads = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("leads")
    .select("id, name, company, phone, preferred_time, user_agent, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("[leadline] listLeads failed", error);
    return { leads: [], error: error.message };
  }
  return { leads: data ?? [], error: null as string | null };
});
