import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  AiError,
  AiLoading,
  AiResultActions,
  Markdown,
  PageIntro,
  ReviewNote,
} from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateCleaningSchedule } from "@/lib/ai.functions";

export const Route = createFileRoute("/ai/schedule")({
  head: () => ({
    meta: [
      { title: "AI Schedule Planner | Cape Cleaning Co" },
      {
        name: "description",
        content:
          "Plan cleaning jobs efficiently: assign cleaners, spot conflicts and prioritise urgent work.",
      },
      { property: "og:title", content: "AI Schedule Planner — Cape Cleaning Co" },
      {
        property: "og:description",
        content: "Turn your job list into an organised, conflict-checked cleaning schedule.",
      },
    ],
  }),
  component: SchedulePlanner,
});

function SchedulePlanner() {
  const [form, setForm] = useState({
    date: "",
    cleaners: "",
    jobs: "",
    locations: "",
    services: "",
    times: "",
    durations: "",
    priority: "",
    instructions: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState("");

  const run = async () => {
    if (!form.date.trim() || !form.cleaners.trim() || !form.jobs.trim()) {
      setValidation("Please provide the date, available cleaners and the job list before generating a schedule.");
      return;
    }
    setValidation("");
    setError(null);
    setLoading(true);
    try {
      const res = await generateCleaningSchedule({ data: form });
      setResult(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : null);
    } finally {
      setLoading(false);
    }
  };

  const field = (
    key: keyof typeof form,
    label: string,
    placeholder: string,
    rows?: number,
  ) => (
    <div>
      <Label htmlFor={key}>{label}</Label>
      {rows ? (
        <Textarea
          id={key}
          rows={rows}
          className="mt-1 bg-card"
          value={form[key]}
          placeholder={placeholder}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      ) : (
        <Input
          id={key}
          className="mt-1 bg-card"
          value={form[key]}
          placeholder={placeholder}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      )}
    </div>
  );

  return (
    <AppShell title="AI Schedule Planner">
      <PageIntro
        title="AI Schedule Planner"
        description="Give the AI your jobs, cleaners and times. It organises the day, flags conflicts and tells you what information is missing."
        action={<span />}
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-[14px] p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                className="mt-1 bg-card"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            {field("cleaners", "Available cleaners", "e.g. Lerato, Sipho, Amina")}
          </div>
          <div className="mt-3 grid gap-3">
            {field("jobs", "Customer / job list", "One job per line", 4)}
            {field("locations", "Locations", "e.g. Sea Point, Claremont", 2)}
            {field("services", "Cleaning services", "e.g. Deep clean, office clean", 2)}
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {field("times", "Appointment times", "e.g. 08:00, 11:30")}
            {field("durations", "Estimated durations", "e.g. 2h, 3h")}
            {field("priority", "Priority notes", "Urgent / High / Normal / Low")}
          </div>
          <div className="mt-3">{field("instructions", "Special instructions", "Access codes, pets, parking…", 3)}</div>
          {validation && <p className="mt-3 text-xs text-destructive">{validation}</p>}
          <Button className="mt-4" onClick={() => void run()} disabled={loading}>
            <CalendarClock className="size-4" /> Generate Schedule
          </Button>
        </div>

        <div className="space-y-3">
          {loading && <AiLoading />}
          {error !== null && !loading && <AiError message={error ?? undefined} onRetry={() => void run()} />}
          {!loading && result && (
            <div className="glass overflow-x-auto rounded-[14px] p-4">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-accent">
                AI-generated schedule
              </p>
              <Markdown>{result}</Markdown>
              <div className="mt-4">
                <AiResultActions
                  text={result}
                  onRegenerate={() => void run()}
                  onClear={() => setResult("")}
                />
              </div>
            </div>
          )}
          {!loading && !result && error === null && (
            <div className="glass rounded-[14px] p-4 text-sm text-muted-foreground">
              Your generated schedule will appear here as a table, with conflicts and missing information listed.
            </div>
          )}
          <ReviewNote />
        </div>
      </div>
    </AppShell>
  );
}
