import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listLeads } from "@/lib/leads.functions";

export const Route = createFileRoute("/LeadLineBookings")({
  head: () => ({
    meta: [
      { title: "Bookings" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: BookingsPage,
});

function BookingsPage() {
  const fetchLeads = useServerFn(listLeads);
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["leads"],
    queryFn: () => fetchLeads(),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {data?.leads.length ?? 0} total
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="text-sm rounded-full border px-4 py-2 hover:bg-muted transition"
          >
            {isFetching ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : error || data?.error ? (
          <p className="text-sm text-red-600">
            {(error as Error)?.message ?? data?.error}
          </p>
        ) : data && data.leads.length === 0 ? (
          <p className="text-sm text-muted-foreground">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">When</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Preferred time</th>
                </tr>
              </thead>
              <tbody>
                {data?.leads.map((l) => (
                  <tr key={l.id} className="border-t">
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {new Date(l.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-medium">{l.name}</td>
                    <td className="px-4 py-3">{l.company}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`tel:${l.phone}`}
                        className="underline-offset-2 hover:underline"
                      >
                        {l.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3">{l.preferred_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
