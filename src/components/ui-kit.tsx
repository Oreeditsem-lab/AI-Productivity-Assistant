import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Priority, TaskStatus } from "@/lib/demo-data";

export function PageIntro({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="max-w-[34ch] text-balance font-display text-2xl font-semibold text-foreground lg:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-[62ch] text-pretty text-sm text-muted-foreground">{description}</p>
      </div>
      {action ?? (
        <span className="rounded-full bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground ring-1 ring-border">
          Demo Data
        </span>
      )}
    </div>
  );
}

export function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("glass rounded-[14px] p-4", className)}>{children}</div>;
}

const priorityClass: Record<Priority, string> = {
  Urgent: "bg-accent/10 text-accent ring-accent/20",
  High: "bg-citrus/15 text-accent ring-citrus/30",
  Normal: "bg-secondary text-muted-foreground ring-border",
  Low: "bg-secondary text-muted-foreground ring-border",
};

const statusClass: Record<TaskStatus, string> = {
  Pending: "bg-secondary text-muted-foreground ring-border",
  "In Progress": "bg-primary/10 text-brand-deep ring-primary/20",
  Completed: "bg-brand-deep/10 text-brand-deep ring-primary/20",
};

export function Chip({ label, tone }: { label: string; tone?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ring-1",
        tone ?? "bg-secondary text-muted-foreground ring-border",
      )}
    >
      {label}
    </span>
  );
}

export const PriorityChip = ({ value }: { value: Priority }) => (
  <Chip label={value} tone={priorityClass[value]} />
);
export const StatusChip = ({ value }: { value: TaskStatus }) => (
  <Chip label={value} tone={statusClass[value]} />
);

export function AiLoading() {
  return (
    <div className="glass flex items-center gap-3 rounded-[14px] p-4">
      <span className="ai-dot size-2.5 rounded-full bg-primary" />
      <p className="text-sm text-muted-foreground">AI is preparing your response...</p>
    </div>
  );
}

export function AiError({ message, onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <div className="rounded-[14px] bg-destructive/5 p-4 ring-1 ring-destructive/20">
      <p className="text-sm font-medium text-foreground">
        Sorry, I couldn&apos;t generate a response right now. Please try again.
      </p>
      {message && <p className="mt-1 text-xs text-muted-foreground">{message}</p>}
      <Button className="mt-3" size="sm" variant="outline" onClick={onRetry}>
        <RefreshCw className="size-3.5" /> Retry
      </Button>
    </div>
  );
}

export function Markdown({ children }: { children: string }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-foreground [&_h2]:mt-4 [&_h2]:font-display [&_h2]:text-base [&_h2]:font-semibold [&_h3]:font-display [&_h3]:text-sm [&_h3]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_strong]:font-semibold [&_table]:w-full [&_table]:border-collapse [&_table]:text-xs [&_td]:border [&_td]:border-border [&_td]:p-2 [&_th]:border [&_th]:border-border [&_th]:bg-secondary [&_th]:p-2 [&_th]:text-left">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

export function AiResultActions({
  text,
  onRegenerate,
  onClear,
}: {
  text: string;
  onRegenerate?: () => void;
  onClear?: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          void navigator.clipboard.writeText(text);
          toast.success("Copied to clipboard");
        }}
      >
        <Copy className="size-3.5" /> Copy
      </Button>
      {onRegenerate && (
        <Button size="sm" variant="outline" onClick={onRegenerate}>
          <RefreshCw className="size-3.5" /> Regenerate
        </Button>
      )}
      {onClear && (
        <Button size="sm" variant="ghost" onClick={onClear}>
          <Trash2 className="size-3.5" /> Clear
        </Button>
      )}
    </div>
  );
}

export function ReviewNote() {
  return (
    <p className="max-w-[64ch] text-pretty text-[11px] leading-relaxed text-muted-foreground">
      AI-generated responses should be reviewed by a Cape Cleaning Co employee before important
      decisions or customer communication.
    </p>
  );
}
