import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listLeads,
  listMessages,
  setLeadContacted,
  setMessageContacted,
  addCustomerNote,
  listCustomerNotes,
  setLeadLifecycle,
} from "@/lib/crm.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/LeadLineNoti")({
  head: () => ({
    meta: [{ title: "Inbox · Leadmap" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: NotiPage,
});

type Tab = "bookings" | "messages";

type CrmLead = {
  id: string;
  name: string;
  company: string;
  phone: string | null;
  email: string | null;
  preferred_time: string;
  contacted: boolean;
  status: string | null;
  first_invoice_value_sek: number | null;
  advertising_consent: boolean;
  is_vvs_company: boolean | null;
  is_decision_maker: boolean | null;
  has_missed_call_need: boolean | null;
  created_at: string;
};

function NotiPage() {
  const [tab, setTab] = useState<Tab>("bookings");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");
  const [selected, setSelected] = useState<string | null>(null);

  const fetchLeads = useServerFn(listLeads);
  const fetchMessages = useServerFn(listMessages);

  const [hasSession, setHasSession] = useState(false);
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setHasSession(!!data.session?.access_token);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setHasSession(!!session?.access_token);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const leadsQ = useQuery({
    queryKey: ["crm-leads"],
    queryFn: () => fetchLeads(),
    enabled: hasSession,
  });
  const msgsQ = useQuery({
    queryKey: ["crm-messages"],
    queryFn: () => fetchMessages(),
    enabled: hasSession,
  });

  const openBookings = leadsQ.data?.leads.filter((l) => !l.contacted).length ?? 0;
  const openMessages = msgsQ.data?.messages.filter((m) => !m.contacted).length ?? 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Inbox</h1>
            <p className="text-sm text-muted-foreground mt-1">
              All bookings and messages, in one place.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                leadsQ.refetch();
                msgsQ.refetch();
              }}
            >
              Refresh
            </Button>
          </div>
        </header>

        <div className="flex gap-2 mb-6 border-b border-border">
          <TabBtn
            active={tab === "bookings"}
            onClick={() => {
              setTab("bookings");
              setSelected(null);
            }}
          >
            Bookings {openBookings > 0 && <Badge>{openBookings}</Badge>}
          </TabBtn>
          <TabBtn
            active={tab === "messages"}
            onClick={() => {
              setTab("messages");
              setSelected(null);
            }}
          >
            Messages {openMessages > 0 && <Badge>{openMessages}</Badge>}
          </TabBtn>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Input
            placeholder="Search by name, email, or phone…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-sm h-9"
          />
          <div className="flex gap-1 rounded-full border border-border p-1">
            {(["all", "open", "done"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 h-7 rounded-full text-xs font-medium transition ${
                  filter === f
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? "All" : f === "open" ? "Not contacted" : "Contacted"}
              </button>
            ))}
          </div>
        </div>

        {tab === "bookings" ? (
          <BookingsTable
            isLoading={leadsQ.isLoading}
            leads={leadsQ.data?.leads ?? []}
            query={query}
            filter={filter}
            onSelect={setSelected}
            selectedKey={selected}
          />
        ) : (
          <MessagesTable
            isLoading={msgsQ.isLoading}
            messages={msgsQ.data?.messages ?? []}
            query={query}
            filter={filter}
            onSelect={setSelected}
            selectedKey={selected}
          />
        )}
      </div>

      {selected && <CustomerDrawer customerKey={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition ${
        active
          ? "border-foreground text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-1.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-brand text-brand-foreground text-[10px] font-semibold">
      {children}
    </span>
  );
}

function StatusPill({ contacted }: { contacted: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
        contacted
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${contacted ? "bg-emerald-500" : "bg-amber-500"}`}
      />
      {contacted ? "Contacted" : "Open"}
    </span>
  );
}

function LifecyclePill({ status }: { status: string | null }) {
  const normalized = status?.toLowerCase() || "interested";
  const won = ["pilot_won", "won", "closed_won", "customer"].includes(normalized);
  const qualified = ["qualified", "qualified_lead", "demo_booked"].includes(normalized);
  const label = won ? "Pilot won" : qualified ? "Qualified" : "New lead";
  const tone = won
    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    : qualified
      ? "bg-sky-500/10 text-sky-600 dark:text-sky-400"
      : "bg-muted text-muted-foreground";

  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${tone}`}>
      {label}
    </span>
  );
}

function BookingsTable({
  isLoading,
  leads,
  query,
  filter,
  onSelect,
  selectedKey,
}: {
  isLoading: boolean;
  leads: CrmLead[];
  query: string;
  filter: "all" | "open" | "done";
  onSelect: (key: string) => void;
  selectedKey: string | null;
}) {
  const qc = useQueryClient();
  const toggle = useServerFn(setLeadContacted);
  const setLifecycle = useServerFn(setLeadLifecycle);
  const mut = useMutation({
    mutationFn: (v: { id: string; contacted: boolean }) => toggle({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crm-leads"] }),
  });
  const lifecycleMut = useMutation({
    mutationFn: (
      value:
        | { id: string; status: "qualified" }
        | { id: string; status: "pilot_won"; firstInvoiceValueSek: number },
    ) => setLifecycle({ data: value }),
    onSuccess: (result) => {
      if (!result.ok) {
        window.alert(result.error || "Could not update the lead stage.");
        return;
      }
      qc.invalidateQueries({ queryKey: ["crm-leads"] });
    },
  });

  const recordPilotWon = (lead: CrmLead) => {
    const raw = window.prompt("First invoice amount in SEK, excluding VAT:");
    if (raw === null) return;
    const firstInvoiceValueSek = Number(raw.trim().replace(",", "."));
    if (!Number.isFinite(firstInvoiceValueSek) || firstInvoiceValueSek <= 0) {
      window.alert("Enter a positive invoice amount.");
      return;
    }
    lifecycleMut.mutate({ id: lead.id, status: "pilot_won", firstInvoiceValueSek });
  };

  const filtered = leads.filter((l) => {
    if (filter === "open" && l.contacted) return false;
    if (filter === "done" && !l.contacted) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.company.toLowerCase().includes(q) ||
      (l.phone || "").toLowerCase().includes(q) ||
      (l.email || "").toLowerCase().includes(q)
    );
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (filtered.length === 0)
    return <p className="text-sm text-muted-foreground py-8 text-center">No bookings.</p>;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">When</th>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Company</th>
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Preferred</th>
            <th className="px-4 py-3 font-medium">Lead stage</th>
            <th className="px-4 py-3 font-medium">Follow-up</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((l) => (
            <tr
              key={l.id}
              className={`border-t border-border cursor-pointer hover:bg-muted/30 transition ${
                selectedKey === (l.phone || l.email || l.name) ? "bg-muted/40" : ""
              }`}
              onClick={() => onSelect(l.phone || l.email || l.name)}
            >
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground text-xs">
                {new Date(l.created_at).toLocaleString()}
              </td>
              <td className="px-4 py-3 font-medium">{l.name}</td>
              <td className="px-4 py-3">{l.company}</td>
              <td className="px-4 py-3">
                {l.phone ? (
                  <a
                    href={`tel:${l.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="hover:underline"
                  >
                    {l.phone}
                  </a>
                ) : l.email ? (
                  <a
                    href={`mailto:${l.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="hover:underline"
                  >
                    {l.email}
                  </a>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3 text-xs">{l.preferred_time}</td>
              <td className="px-4 py-3">
                <LifecyclePill status={l.status} />
                {["pilot_won", "won", "closed_won", "customer"].includes(
                  l.status?.toLowerCase() || "",
                ) && l.first_invoice_value_sek ? (
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    {l.first_invoice_value_sek.toLocaleString("sv-SE")} SEK
                  </div>
                ) : null}
              </td>
              <td className="px-4 py-3">
                <StatusPill contacted={l.contacted} />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  {!["pilot_won", "won", "closed_won", "customer"].includes(
                    l.status?.toLowerCase() || "",
                  ) && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={lifecycleMut.isPending}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          ["qualified", "qualified_lead", "demo_booked"].includes(
                            l.status?.toLowerCase() || "",
                          )
                        ) {
                          recordPilotWon(l);
                        } else {
                          lifecycleMut.mutate({ id: l.id, status: "qualified" });
                        }
                      }}
                    >
                      {["qualified", "qualified_lead", "demo_booked"].includes(
                        l.status?.toLowerCase() || "",
                      )
                        ? "Record pilot"
                        : "Qualify"}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant={l.contacted ? "outline" : "default"}
                    onClick={(e) => {
                      e.stopPropagation();
                      mut.mutate({ id: l.id, contacted: !l.contacted });
                    }}
                  >
                    {l.contacted ? "Reopen" : "Mark contacted"}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MessagesTable({
  isLoading,
  messages,
  query,
  filter,
  onSelect,
  selectedKey,
}: {
  isLoading: boolean;
  messages: {
    id: string;
    name: string;
    email: string;
    message: string;
    contacted: boolean;
    created_at: string;
  }[];
  query: string;
  filter: "all" | "open" | "done";
  onSelect: (key: string) => void;
  selectedKey: string | null;
}) {
  const qc = useQueryClient();
  const toggle = useServerFn(setMessageContacted);
  const mut = useMutation({
    mutationFn: (v: { id: string; contacted: boolean }) => toggle({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crm-messages"] }),
  });

  const filtered = messages.filter((m) => {
    if (filter === "open" && m.contacted) return false;
    if (filter === "done" && !m.contacted) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (filtered.length === 0)
    return <p className="text-sm text-muted-foreground py-8 text-center">No messages.</p>;

  return (
    <div className="grid gap-3">
      {filtered.map((m) => (
        <div
          key={m.id}
          className={`rounded-2xl border border-border p-4 cursor-pointer hover:border-foreground/30 transition ${
            selectedKey === m.email ? "border-foreground/50 bg-muted/30" : ""
          }`}
          onClick={() => onSelect(m.email)}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">{m.name}</span>
                <a
                  href={`mailto:${m.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-muted-foreground hover:underline truncate"
                >
                  {m.email}
                </a>
                <StatusPill contacted={m.contacted} />
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                {new Date(m.created_at).toLocaleString()}
              </div>
            </div>
            <Button
              size="sm"
              variant={m.contacted ? "outline" : "default"}
              onClick={(e) => {
                e.stopPropagation();
                mut.mutate({ id: m.id, contacted: !m.contacted });
              }}
            >
              {m.contacted ? "Reopen" : "Mark contacted"}
            </Button>
          </div>
          <p className="text-sm whitespace-pre-wrap text-foreground/90">{m.message}</p>
        </div>
      ))}
    </div>
  );
}

function CustomerDrawer({ customerKey, onClose }: { customerKey: string; onClose: () => void }) {
  const fetchNotes = useServerFn(listCustomerNotes);
  const addNote = useServerFn(addCustomerNote);
  const qc = useQueryClient();
  const [note, setNote] = useState("");

  const notesQ = useQuery({
    queryKey: ["customer-notes", customerKey],
    queryFn: () => fetchNotes({ data: { customerKey } }),
  });

  const mut = useMutation({
    mutationFn: (body: string) => addNote({ data: { customerKey, body } }),
    onSuccess: () => {
      setNote("");
      qc.invalidateQueries({ queryKey: ["customer-notes", customerKey] });
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <aside className="w-full max-w-md bg-background border-l border-border overflow-y-auto">
        <div className="p-6 border-b border-border flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Customer
            </div>
            <div className="font-semibold text-lg truncate">{customerKey}</div>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-sm font-semibold mb-3">Add note</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Called — left voicemail. Will follow up Tue."
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <Button
              size="sm"
              className="mt-2"
              disabled={!note.trim() || mut.isPending}
              onClick={() => mut.mutate(note.trim())}
            >
              {mut.isPending ? "Saving…" : "Save note"}
            </Button>
          </section>

          <section>
            <h3 className="text-sm font-semibold mb-3">History</h3>
            {notesQ.isLoading ? (
              <p className="text-xs text-muted-foreground">Loading…</p>
            ) : (notesQ.data?.notes.length ?? 0) === 0 ? (
              <p className="text-xs text-muted-foreground">No notes yet.</p>
            ) : (
              <ul className="space-y-3">
                {notesQ.data?.notes.map((n) => (
                  <li key={n.id} className="rounded-xl border border-border p-3">
                    <div className="text-[11px] text-muted-foreground mb-1">
                      {new Date(n.created_at).toLocaleString()}
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{n.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </aside>
    </div>
  );
}
