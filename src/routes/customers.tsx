import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Chip, PageIntro } from "@/components/ui-kit";
import { Input } from "@/components/ui/input";
import { CUSTOMER_STATUSES, type CustomerStatus } from "@/lib/demo-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "Customers | Cape Cleaning Co" },
      {
        name: "description",
        content: "View and filter Cape Cleaning Co customer bookings, locations and job statuses.",
      },
      { property: "og:title", content: "Customers — Cape Cleaning Co" },
      {
        property: "og:description",
        content: "Customer bookings, cleaning locations and booking statuses in one place.",
      },
    ],
  }),
  component: CustomersPage,
});

const statusTone: Record<CustomerStatus, string> = {
  New: "bg-citrus/15 text-accent ring-citrus/30",
  Confirmed: "bg-primary/10 text-brand-deep ring-primary/20",
  "In Progress": "bg-primary/10 text-brand-deep ring-primary/20",
  Completed: "bg-brand-deep/10 text-brand-deep ring-primary/20",
  Cancelled: "bg-secondary text-muted-foreground ring-border",
};

function CustomersPage() {
  const { customers, updateCustomer } = useStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | CustomerStatus>("All");

  const filtered = customers.filter(
    (c) =>
      (status === "All" || c.status === status) &&
      (c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.location.toLowerCase().includes(query.toLowerCase()) ||
        c.service.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <AppShell title="Customers">
      <PageIntro
        title="Customers"
        description="Fictional demo records only. Sensitive personal information is intentionally excluded."
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, service or location"
          className="max-w-xs bg-card"
        />
        <div className="flex flex-wrap gap-1.5">
          {(["All", ...CUSTOMER_STATUSES] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition-colors ${
                status === s
                  ? "bg-primary text-primary-foreground ring-primary"
                  : "bg-card text-muted-foreground ring-border"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:hidden">
        {filtered.map((c) => (
          <div key={c.id} className="glass rounded-[14px] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <p className="text-[11px] text-muted-foreground">{c.contact}</p>
              </div>
              <Chip label={c.status} tone={statusTone[c.status]} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
              <div>
                <dt className="font-medium text-foreground">Service</dt>
                <dd>{c.service}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Booking date</dt>
                <dd>{c.bookingDate || "Not set"}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Location</dt>
                <dd>{c.location}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Notes</dt>
                <dd>{c.notes}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <div className="glass mt-4 hidden overflow-x-auto rounded-[14px] md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="p-3 font-medium">Customer</th>
              <th className="p-3 font-medium">Contact</th>
              <th className="p-3 font-medium">Service</th>
              <th className="p-3 font-medium">Booking date</th>
              <th className="p-3 font-medium">Location</th>
              <th className="p-3 font-medium">Notes</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((c) => (
              <tr key={c.id}>
                <td className="p-3 font-medium text-foreground">{c.name}</td>
                <td className="p-3 text-muted-foreground">{c.contact}</td>
                <td className="p-3 text-muted-foreground">{c.service}</td>
                <td className="p-3 text-muted-foreground">{c.bookingDate || "Not set"}</td>
                <td className="p-3 text-muted-foreground">{c.location}</td>
                <td className="max-w-[220px] p-3 text-muted-foreground">{c.notes}</td>
                <td className="p-3">
                  <select
                    value={c.status}
                    onChange={(e) =>
                      updateCustomer(c.id, { status: e.target.value as CustomerStatus })
                    }
                    className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-foreground ring-1 ring-border"
                  >
                    {CUSTOMER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">No customers match your filters.</p>
      )}
    </AppShell>
  );
}
