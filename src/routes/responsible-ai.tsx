import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageIntro } from "@/components/ui-kit";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI | Cape Cleaning Co" },
      {
        name: "description",
        content:
          "How Cape Cleaning Co uses AI responsibly: human review, accuracy, privacy, transparency, fairness and limitations.",
      },
      { property: "og:title", content: "Responsible AI — Cape Cleaning Co" },
      {
        property: "og:description",
        content: "Safeguards, limitations and validation steps for AI use in cleaning operations.",
      },
    ],
  }),
  component: ResponsibleAiPage,
});

const PRINCIPLES = [
  {
    title: "Human review",
    body: "AI-generated customer communications and important scheduling recommendations must be reviewed by a human employee before they are sent or acted on.",
  },
  {
    title: "Accuracy",
    body: "The AI is instructed not to invent prices, availability, policies or customer details. Employees should verify important information before acting on it.",
  },
  {
    title: "Privacy",
    body: "Do not enter unnecessary sensitive customer information into AI prompts. Share only what is needed to complete the task.",
  },
  {
    title: "Transparency",
    body: "Every AI-assisted screen in this application is clearly labelled, and outputs are marked as drafts awaiting employee review.",
  },
  {
    title: "Bias and fairness",
    body: "AI recommendations must not be used to unfairly discriminate against employees or customers. Scheduling suggestions are advisory only.",
  },
  {
    title: "AI limitations",
    body: "AI can make mistakes, misread context or omit detail. It supports human judgement — it does not replace it.",
  },
];

const VALIDATION = [
  "Check that names, dates, times and locations in AI output match the source record.",
  "Confirm anything about price, availability or policy with a Cape Cleaning Co staff member.",
  "Read the 'missing information' section the AI produces before sending anything to a customer.",
  "Keep a human in the loop for complaints, cancellations and anything contractual.",
];

function ResponsibleAiPage() {
  return (
    <AppShell title="Responsible AI">
      <PageIntro
        title="Responsible AI at Cape Cleaning Co"
        description="These safeguards define how AI is used in day-to-day cleaning operations, and where human judgement stays in control."
        action={<span />}
      />

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <div key={p.title} className="glass rounded-[14px] p-4">
            <h2 className="font-display text-sm font-semibold text-foreground">{p.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-[14px] bg-accent/10 p-4 ring-1 ring-accent/20">
        <h2 className="font-display text-sm font-semibold text-foreground">Validation steps</h2>
        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          {VALIDATION.map((v) => (
            <li key={v} className="ml-4 list-disc">
              {v}
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
