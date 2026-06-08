import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

// Preview / dev: keep the inbox publicly viewable so we can iterate without
// logging in. Production (published .lovable.app + custom domains): require
// auth so CRM data isn't exposed.
function isPreviewHost(host: string): boolean {
  if (import.meta.env.DEV) return true;
  if (host === "localhost" || host === "127.0.0.1") return true;
  // Lovable sandbox preview & shareable preview subdomains
  if (host.endsWith(".lovableproject.com")) return true;
  if (host.includes("id-preview--")) return true;
  if (host.includes("-preview.")) return true;
  return false;
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    if (typeof window !== "undefined" && isPreviewHost(window.location.hostname)) {
      return { user: null };
    }
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth" });
    }
    return { user: data.user };
  },
  component: () => <Outlet />,
});
