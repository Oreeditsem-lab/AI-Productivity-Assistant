import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageIntro, PriorityChip, StatusChip } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Schedule | Cape Cleaning Co" },
      {
        name: "description",
        content: "Today's Cape Cleaning Co cleaning schedule by time, cleaner, location and priority.",
      },
      { property: "og:title", content: "Cleaning Schedule — Cape Cleaning Co" },
      {
        property: "og:description",
        content: "See the day's cleaning jobs in time order with assigned cleaners and priorities.",
      },
    ],
  }),
  component: SchedulePage,
});

function SchedulePage() {
  const { tasks } = useStore();
  const ordered = [...tasks].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <AppShell title="Schedule">
      <PageIntro
        title="Cleaning schedule"
        description="The current day's jobs in time order. Use the AI Schedule Planner to draft a new plan and check for conflicts."
        action={
          <Button asChild>
            <Link to="/ai/schedule">Open AI Schedule Planner</Link>
          </Button>
        }
      />

      <div className="mt-6 grid gap-3 md:hidden">
        {ordered.map((t) => (
          <div key={t.id} className="glass rounded-[14px] p-4">
            <div className="flex items-center justify-between">
              <p className="font-display text-sm font-semibold text-foreground">{t.time}</p>
              <StatusChip value={t.status} />
            </div>
            <p className="mt-2 text-sm text-foreground">{t.customer}</p>
            <p className="text-[11px] text-muted-foreground">
              {t.service} · {t.location} · {t.cleaner}
            </p>
            <div className="mt-2">
              <PriorityChip value={t.priority} />
            </div>
          </div>
        ))}
      </div>

      <div className="glass mt-6 hidden overflow-x-auto rounded-[14px] md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="p-3 font-medium">Time</th>
              <th className="p-3 font-medium">Customer</th>
              <th className="p-3 font-medium">Location</th>
              <th className="p-3 font-medium">Cleaning service</th>
              <th className="p-3 font-medium">Cleaner</th>
              <th className="p-3 font-medium">Priority</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ordered.map((t) => (
              <tr key={t.id}>
                <td className="p-3 font-medium text-foreground">{t.time}</td>
                <td className="p-3 text-muted-foreground">{t.customer}</td>
                <td className="p-3 text-muted-foreground">{t.location}</td>
                <td className="p-3 text-muted-foreground">{t.service}</td>
                <td className="p-3 text-muted-foreground">{t.cleaner}</td>
                <td className="p-3">
                  <PriorityChip value={t.priority} />
                </td>
                <td className="p-3">
                  <StatusChip value={t.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
