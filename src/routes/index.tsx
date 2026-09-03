import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageIntro, PriorityChip, ReviewNote, StatusChip } from "@/components/ui-kit";
import { useStore } from "@/lib/store";
import type { TaskStatus } from "@/lib/demo-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | Cape Cleaning Co AI Operations Assistant" },
      {
        name: "description",
        content:
          "Cape Cleaning Co operations dashboard: today's cleaning jobs, pending requests and AI productivity tools.",
      },
      { property: "og:title", content: "Cape Cleaning Co — AI Cleaning Operations Assistant" },
      {
        property: "og:description",
        content: "Track cleaning jobs, customers and tasks with AI-assisted admin tools.",
      },
    ],
  }),
  component: Dashboard,
});

const QUICK_ACTIONS = [
  {
    to: "/ai/message",
    title: "Generate Customer Message",
    blurb: "Draft a polished, reviewable reply.",
    primary: true,
  },
  {
    to: "/ai/schedule",
    title: "Create Cleaning Schedule",
    blurb: "Organise jobs and flag conflicts.",
    primary: false,
  },
  {
    to: "/ai/notes",
    title: "Summarise Job Notes",
    blurb: "Turn long notes into a brief.",
    primary: false,
  },
  {
    to: "/ai/assistant",
    title: "Ask AI Assistant",
    blurb: "Answers from app info only.",
    primary: false,
  },
] as const;

function Dashboard() {
  const { tasks, customers, updateTask } = useStore();
  const todaysJobs = tasks.length;
  const pending = customers.filter((c) => c.status === "New" || c.status === "Confirmed").length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const attention = tasks.filter(
    (t) => (t.priority === "Urgent" || t.priority === "High") && t.status !== "Completed",
  ).length;

  const stats = [
    { label: "Today's Jobs", value: todaysJobs, note: "scheduled in the system", accent: false },
    { label: "Pending Customer Requests", value: pending, note: "awaiting reply", accent: false },
    { label: "Completed Jobs", value: completed, note: "marked complete today", accent: false },
    { label: "Tasks Requiring Attention", value: attention, note: "urgent or high priority", accent: true },
  ];

  const nextStatus: Record<TaskStatus, TaskStatus> = {
    Pending: "In Progress",
    "In Progress": "Completed",
    Completed: "Pending",
  };

  return (
    <AppShell title="Cape Town Operations">
      <PageIntro
        title="Welcome to Cape Cleaning Co"
        description="Your AI-powered cleaning operations assistant."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-[14px] p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              <span
                className={`grid size-7 place-items-center rounded-[8px] ${s.accent ? "bg-accent/10" : "bg-primary/10"}`}
              >
                <span
                  className={`size-2 rounded-sm ${s.accent ? "bg-accent" : "bg-primary"}`}
                />
              </span>
            </div>
            <p className="mt-3 font-display text-2xl font-semibold text-foreground">{s.value}</p>
            <p className={`mt-1 text-[11px] ${s.accent ? "text-accent" : "text-muted-foreground"}`}>
              {s.note}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-foreground">Quick AI actions</h2>
          <span className="text-xs font-medium text-muted-foreground">AI Tools</span>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className={`flex flex-col items-start gap-3 rounded-[14px] p-4 text-left transition-transform hover:-translate-y-0.5 ${
                a.primary ? "bg-primary/10 ring-1 ring-primary/20" : "glass"
              }`}
            >
              <span className="grid size-9 place-items-center rounded-[10px] bg-card/80 ring-1 ring-primary/20">
                <span className="size-3 rounded-[3px] bg-primary" />
              </span>
              <span className="font-display text-sm font-semibold text-foreground">{a.title}</span>
              <span className="text-[11px] leading-snug text-muted-foreground">{a.blurb}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between pb-3">
          <h2 className="font-display text-base font-semibold text-foreground">Today&apos;s tasks</h2>
          <span className="text-xs text-muted-foreground">Tap a status to advance it</span>
        </div>
        <div className="glass overflow-hidden rounded-[14px]">
          <div className="divide-y divide-border">
            {tasks.map((t) => (
              <div key={t.id} className="flex flex-wrap items-center gap-3 px-4 py-3.5">
                <div className="min-w-[140px] flex-1">
                  <p className="text-sm font-medium text-foreground">{t.customer}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {t.service} · {t.location}
                  </p>
                </div>
                <div className="hidden w-28 text-xs text-muted-foreground md:block">{t.cleaner}</div>
                <div className="hidden w-16 text-xs text-muted-foreground sm:block">{t.time}</div>
                <PriorityChip value={t.priority} />
                <button
                  type="button"
                  onClick={() => updateTask(t.id, { status: nextStatus[t.status] })}
                  aria-label={`Change status of ${t.name}`}
                >
                  <StatusChip value={t.status} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-6">
        <ReviewNote />
      </div>
    </AppShell>
  );
}
