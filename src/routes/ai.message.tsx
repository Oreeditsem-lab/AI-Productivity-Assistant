import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
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
import { generateCustomerMessage } from "@/lib/ai.functions";

export const Route = createFileRoute("/ai/message")({
  head: () => ({
    meta: [
      { title: "AI Message Generator | Cape Cleaning Co" },
      {
        name: "description",
        content:
          "Generate professional Cape Cleaning Co customer emails: quotes, confirmations, reminders and follow-ups.",
      },
      { property: "og:title", content: "AI Message Generator — Cape Cleaning Co" },
      {
        property: "og:description",
        content: "Draft customer-ready cleaning messages in seconds, then review before sending.",
      },
    ],
  }),
  component: MessageGenerator,
});

const PURPOSES = [
  "Quote",
  "Booking confirmation",
  "Appointment reminder",
  "Follow-up",
  "Rescheduling",
  "Cancellation",
  "Thank you",
  "Feedback request",
  "Complaint response",
  "General enquiry",
];
const TONES = ["Professional", "Friendly", "Formal", "Persuasive", "Apologetic"];
const CUSTOMER_TYPES = ["Residential", "Commercial", "New customer", "Recurring customer"];

function MessageGenerator() {
  const [form, setForm] = useState({
    customerName: "",
    customerType: CUSTOMER_TYPES[0] as string,
    purpose: PURPOSES[0] as string,
    service: "",
    date: "",
    time: "",
    details: "",
    tone: TONES[0] as string,
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState("");

  const run = async () => {
    if (!form.customerName.trim() || !form.purpose) {
      setValidation("Please provide the customer name and message purpose before generating the message.");
      return;
    }
    setValidation("");
    setError(null);
    setLoading(true);
    try {
      const res = await generateCustomerMessage({ data: form });
      setResult(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="AI Message Generator">
      <PageIntro
        title="AI Message Generator"
        description="Create professional customer emails and messages from the details you supply. The AI will not invent prices, availability or policies."
        action={<span />}
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-[14px] p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="customerName">Customer name</Label>
              <Input
                id="customerName"
                className="mt-1 bg-card"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                placeholder="e.g. Sarah Adams"
              />
            </div>
            <div>
              <Label htmlFor="customerType">Customer type</Label>
              <select
                id="customerType"
                className="mt-1 w-full rounded-md bg-card px-3 py-2 text-sm ring-1 ring-input"
                value={form.customerType}
                onChange={(e) => setForm({ ...form, customerType: e.target.value })}
              >
                {CUSTOMER_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="purpose">Message purpose</Label>
              <select
                id="purpose"
                className="mt-1 w-full rounded-md bg-card px-3 py-2 text-sm ring-1 ring-input"
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              >
                {PURPOSES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="service">Cleaning service</Label>
              <Input
                id="service"
                className="mt-1 bg-card"
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                placeholder="e.g. Deep clean"
              />
            </div>
            <div>
              <Label htmlFor="date">Appointment date</Label>
              <Input
                id="date"
                type="date"
                className="mt-1 bg-card"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="time">Appointment time</Label>
              <Input
                id="time"
                type="time"
                className="mt-1 bg-card"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-3">
            <Label htmlFor="details">Additional details</Label>
            <Textarea
              id="details"
              rows={4}
              className="mt-1 bg-card"
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              placeholder="Anything the customer needs to know"
            />
          </div>
          <div className="mt-3">
            <Label htmlFor="tone">Tone</Label>
            <select
              id="tone"
              className="mt-1 w-full rounded-md bg-card px-3 py-2 text-sm ring-1 ring-input"
              value={form.tone}
              onChange={(e) => setForm({ ...form, tone: e.target.value })}
            >
              {TONES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          {validation && <p className="mt-3 text-xs text-destructive">{validation}</p>}
          <Button className="mt-4" onClick={() => void run()} disabled={loading}>
            <Sparkles className="size-4" /> Generate Message
          </Button>
        </div>

        <div className="space-y-3">
          {loading && <AiLoading />}
          {error !== null && !loading && <AiError message={error} onRetry={() => void run()} />}
          {!loading && result && (
            <div className="glass rounded-[14px] p-4">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-accent">
                AI-generated draft
              </p>
              <Markdown>{result}</Markdown>
              <div className="mt-4">
                <AiResultActions
                  text={result}
                  onRegenerate={() => void run()}
                  onClear={() => setResult("")}
                />
              </div>
              <Textarea
                className="mt-3 bg-card"
                rows={8}
                value={result}
                onChange={(e) => setResult(e.target.value)}
                aria-label="Edit the generated message"
              />
            </div>
          )}
          {!loading && !result && error === null && (
            <div className="glass rounded-[14px] p-4 text-sm text-muted-foreground">
              Your generated message will appear here, ready to review, edit and copy.
            </div>
          )}
          <ReviewNote />
        </div>
      </div>
    </AppShell>
  );
}
