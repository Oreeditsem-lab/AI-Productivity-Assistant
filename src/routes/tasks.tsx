import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageIntro, PriorityChip, StatusChip } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CLEANERS,
  PRIORITIES,
  TASK_STATUSES,
  type Priority,
  type Task,
  type TaskStatus,
} from "@/lib/demo-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks | Cape Cleaning Co" },
      {
        name: "description",
        content:
          "Create, edit, filter and complete Cape Cleaning Co cleaning tasks by status and priority.",
      },
      { property: "og:title", content: "Task Management — Cape Cleaning Co" },
      {
        property: "og:description",
        content: "Manage cleaning tasks, assigned cleaners, priorities and job statuses.",
      },
    ],
  }),
  component: TasksPage,
});

const emptyTask: Omit<Task, "id"> = {
  name: "",
  customer: "",
  cleaner: CLEANERS[0],
  service: "",
  location: "",
  date: new Date().toISOString().slice(0, 10),
  time: "09:00",
  priority: "Normal",
  status: "Pending",
  notes: "",
};

function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask } = useStore();
  const [form, setForm] = useState(emptyTask);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | TaskStatus>("All");
  const [priorityFilter, setPriorityFilter] = useState<"All" | Priority>("All");

  const filtered = tasks.filter(
    (t) =>
      (statusFilter === "All" || t.status === statusFilter) &&
      (priorityFilter === "All" || t.priority === priorityFilter),
  );

  const submit = () => {
    if (!form.name.trim() || !form.customer.trim()) {
      setError("Please provide a task name and customer before creating the task.");
      return;
    }
    setError("");
    addTask(form);
    setForm(emptyTask);
  };

  return (
    <AppShell title="Tasks">
      <PageIntro
        title="Task management"
        description="Create and manage cleaning tasks, assign cleaners and track progress. All records shown are demo data."
      />

      <div className="glass mt-6 rounded-[14px] p-4">
        <h2 className="font-display text-base font-semibold text-foreground">Create task</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            className="bg-card"
            placeholder="Task name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            className="bg-card"
            placeholder="Customer"
            value={form.customer}
            onChange={(e) => setForm({ ...form, customer: e.target.value })}
          />
          <Input
            className="bg-card"
            placeholder="Cleaning service"
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
          />
          <Input
            className="bg-card"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <select
            className="rounded-md bg-card px-3 py-2 text-sm ring-1 ring-input"
            value={form.cleaner}
            onChange={(e) => setForm({ ...form, cleaner: e.target.value })}
            aria-label="Cleaner"
          >
            {CLEANERS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <Input
            className="bg-card"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            aria-label="Date"
          />
          <Input
            className="bg-card"
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            aria-label="Time"
          />
          <select
            className="rounded-md bg-card px-3 py-2 text-sm ring-1 ring-input"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
            aria-label="Priority"
          >
            {PRIORITIES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
        <Textarea
          className="mt-2 bg-card"
          rows={2}
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        <Button className="mt-3" onClick={submit}>
          <Plus className="size-4" /> Create task
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex flex-wrap gap-1.5">
          {(["All", ...TASK_STATUSES] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 ${statusFilter === s ? "bg-primary text-primary-foreground ring-primary" : "bg-card text-muted-foreground ring-border"}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["All", ...PRIORITIES] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriorityFilter(p)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 ${priorityFilter === p ? "bg-accent text-accent-foreground ring-accent" : "bg-card text-muted-foreground ring-border"}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {filtered.map((t) => (
          <div key={t.id} className="glass rounded-[14px] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-[180px] flex-1">
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {t.customer} · {t.service || "Service not set"} · {t.location || "Location not set"}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {t.date} at {t.time} · {t.cleaner}
                </p>
                {t.notes && <p className="mt-2 text-xs text-muted-foreground">{t.notes}</p>}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <PriorityChip value={t.priority} />
                <select
                  value={t.priority}
                  onChange={(e) => updateTask(t.id, { priority: e.target.value as Priority })}
                  className="rounded-full bg-secondary px-2.5 py-1 text-[11px] ring-1 ring-border"
                  aria-label={`Priority for ${t.name}`}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
                <StatusChip value={t.status} />
                <select
                  value={t.status}
                  onChange={(e) => updateTask(t.id, { status: e.target.value as TaskStatus })}
                  className="rounded-full bg-secondary px-2.5 py-1 text-[11px] ring-1 ring-border"
                  aria-label={`Status for ${t.name}`}
                >
                  {TASK_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <Button size="sm" variant="ghost" onClick={() => deleteTask(t.id)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">No tasks match these filters.</p>
        )}
      </div>
    </AppShell>
  );
}
