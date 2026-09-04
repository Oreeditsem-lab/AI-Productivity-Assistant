import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AiError, AiLoading, Markdown, PageIntro, ReviewNote } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askAssistant } from "@/lib/ai.functions";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/ai/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant | Cape Cleaning Co" },
      {
        name: "description",
        content:
          "Ask the Cape Cleaning Co AI Assistant about services, bookings, job preparation and customer replies.",
      },
      { property: "og:title", content: "AI Assistant — Cape Cleaning Co" },
      {
        property: "og:description",
        content: "A conversational assistant for Cape Cleaning Co staff, grounded in your app data.",
      },
    ],
  }),
  component: Assistant,
});

const SUGGESTIONS = [
  "What cleaning services do we offer?",
  "How do I prepare for a cleaning appointment?",
  "How can I reschedule a booking?",
  "How do I respond to a customer complaint?",
  "Help me create a cleaning task list.",
];

type Msg = { role: "user" | "assistant"; content: string };

function Assistant() {
  const { tasks, customers, services } = useStore();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const context = [
    `Services (editable placeholders): ${services
      .map((s) => `${s.name} — ${s.description} | duration: ${s.duration} | price: ${s.price}`)
      .join("; ")}`,
    `Customers (demo data): ${customers
      .map((c) => `${c.name} — ${c.service}, ${c.location}, ${c.bookingDate}, status ${c.status}`)
      .join("; ")}`,
    `Tasks (demo data): ${tasks
      .map((t) => `${t.name} — ${t.customer}, ${t.cleaner}, ${t.date} ${t.time}, ${t.priority}, ${t.status}`)
      .join("; ")}`,
  ].join("\n");

  const send = async (text: string, history: Msg[] = messages) => {
    const next: Msg[] = [...history, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);
    try {
      const res = await askAssistant({ data: { messages: next, context } });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : null);
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) {
      const idx = messages.lastIndexOf(lastUser);
      void send(lastUser.content, messages.slice(0, idx));
    }
  };

  return (
    <AppShell title="AI Assistant">
      <PageIntro
        title="Cape Cleaning Co AI Assistant"
        description="How can I help you today?"
        action={<span />}
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="glass flex min-h-[60vh] flex-col rounded-[14px] p-4">
          <div className="flex-1 space-y-3 overflow-y-auto">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Ask a question, or start with one of the suggestions.
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-[14px] bg-primary px-3 py-2 text-sm text-primary-foreground"
                    : "max-w-[95%] rounded-[14px] bg-card px-3 py-2 text-sm ring-1 ring-border"
                }
              >
                {m.role === "user" ? m.content : <Markdown>{m.content}</Markdown>}
              </div>
            ))}
            {loading && <AiLoading />}
            {error !== null && !loading && <AiError message={error ?? undefined} onRetry={retry} />}
          </div>

          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim() && !loading) void send(input.trim());
            }}
          >
            <Input
              className="bg-card"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              aria-label="Message the AI assistant"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              <Send className="size-4" /> Send
            </Button>
          </form>
        </div>

        <div className="space-y-3">
          <div className="glass rounded-[14px] p-4">
            <p className="text-[11px] font-medium uppercase tracking-wide text-accent">
              Suggested questions
            </p>
            <div className="mt-3 grid gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={loading}
                  onClick={() => void send(s)}
                  className="rounded-md bg-card px-3 py-2 text-left text-sm ring-1 ring-border transition-colors hover:bg-accent/10"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <ReviewNote />
        </div>
      </div>
    </AppShell>
  );
}
