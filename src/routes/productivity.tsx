import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { PageIntro } from "@/components/ui-kit";

export const Route = createFileRoute("/productivity")({
  head: () => ({
    meta: [
      { title: "Productivity Impact | Cape Cleaning Co" },
      {
        name: "description",
        content:
          "Demo estimates of time saved on customer messages, scheduling and job notes with the AI assistant.",
      },
      { property: "og:title", content: "Productivity Impact — Cape Cleaning Co" },
      {
        property: "og:description",
        content: "Illustrative demo estimates of AI-assisted admin time savings.",
      },
    ],
  }),
  component: ProductivityPage,
});

const METRICS = [
  {
    label: "Customer messages",
    manual: 12,
    withAi: 3,
    note: "Minutes to draft one customer message",
  },
  { label: "Daily schedule", manual: 45, withAi: 10, note: "Minutes to plan a day of jobs" },
  { label: "Job notes", manual: 15, withAi: 2, note: "Minutes to turn notes into a job brief" },
  { label: "Staff questions", manual: 8, withAi: 2, note: "Minutes to find an operational answer" },
];

const QUALITATIVE = [
  {
    title: "Consistency of communication",
    body: "Every customer message follows the same structure and tone, regardless of who writes it.",
  },
  {
    title: "Better organised cleaning tasks",
    body: "Jobs are captured with location, priority and assigned cleaner instead of loose notes.",
  },
  {
    title: "Faster handovers",
    body: "Structured job briefs mean cleaners get the same information in the same format each time.",
  },
];

function ProductivityPage() {
  const chartData = METRICS.map((m) => ({
    name: m.label,
    Manual: m.manual,
    "With AI": m.withAi,
  }));
  const savedPerTask = METRICS.reduce((sum, m) => sum + (m.manual - m.withAi), 0);

  return (
    <AppShell title="Productivity Impact">
      <PageIntro
        title="Productivity impact"
        description="All figures below are demo estimates for presentation purposes. They are not measured Cape Cleaning Co company data."
        action={
          <span className="rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent ring-1 ring-accent/20">
            Demo estimates
          </span>
        }
      />

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {METRICS.map((m) => (
          <div key={m.label} className="glass rounded-[14px] p-4">
            <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
            <p className="mt-3 font-display text-2xl font-semibold text-foreground">
              −{m.manual - m.withAi} min
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">{m.note}</p>
          </div>
        ))}
      </div>

      <div className="glass mt-6 rounded-[14px] p-4">
        <h2 className="font-display text-base font-semibold text-foreground">
          Minutes per task: manual vs AI-assisted
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Demo estimates · roughly {savedPerTask} minutes saved across one round of these four tasks.
        </p>
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "var(--secondary)" }} />
              <Bar dataKey="Manual" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="With AI" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {QUALITATIVE.map((q) => (
          <div key={q.title} className="glass rounded-[14px] p-4">
            <h3 className="font-display text-sm font-semibold text-foreground">{q.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{q.body}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
