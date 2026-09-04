import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { summariseJobNotes } from "@/lib/ai.functions";

export const Route = createFileRoute("/ai/notes")({
  head: () => ({
    meta: [
      { title: "Job Notes Summariser | Cape Cleaning Co" },
      {
        name: "description",
        content:
          "Turn long customer or cleaning job notes into a structured job brief with action items and priorities.",
      },
      { property: "og:title", content: "Job Notes Summariser — Cape Cleaning Co" },
      {
        property: "og:description",
        content: "Paste messy job notes and get a clear, structured brief for the cleaning team.",
      },
    ],
  }),
  component: NotesSummariser,
});

function NotesSummariser() {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState("");

  const run = async () => {
    if (!notes.trim()) {
      setValidation("Please paste the customer or job notes before summarising.");
      return;
    }
    setValidation("");
    setError(null);
    setLoading(true);
    try {
      const res = await summariseJobNotes({ data: { notes } });
      setResult(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Job Notes Summariser">
      <PageIntro
        title="Job Notes Summariser"
        description="Paste long customer instructions or job notes. The AI produces a structured brief and highlights anything the cleaner must know."
        action={<span />}
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-[14px] p-4">
          <Textarea
            rows={16}
            className="bg-card"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste customer/job notes here..."
            aria-label="Customer or job notes"
          />
          {validation && <p className="mt-3 text-xs text-destructive">{validation}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => void run()} disabled={loading}>
              <FileText className="size-4" /> Summarise Notes
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setNotes("");
                setResult("");
                setError(null);
                setValidation("");
              }}
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {loading && <AiLoading />}
          {error !== null && !loading && <AiError message={error ?? undefined} onRetry={() => void run()} />}
          {!loading && result && (
            <div className="glass rounded-[14px] p-4">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-accent">
                AI-generated job brief
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
              Your structured job brief will appear here.
            </div>
          )}
          <ReviewNote />
        </div>
      </div>
    </AppShell>
  );
}
