import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/customers", label: "Customers" },
  { to: "/services", label: "Cleaning Services" },
  { to: "/tasks", label: "Tasks" },
  { to: "/schedule", label: "Schedule" },
  { to: "/productivity", label: "Productivity" },
  { to: "/responsible-ai", label: "Responsible AI" },
] as const;

const AI_TOOLS = [
  { to: "/ai/message", label: "Message Generator" },
  { to: "/ai/schedule", label: "Schedule Planner" },
  { to: "/ai/notes", label: "Job Notes Summariser" },
  { to: "/ai/assistant", label: "AI Assistant" },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <p className="px-2 pb-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        Workspace
      </p>
      <nav className="flex flex-col gap-0.5">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            activeOptions={{ exact: item.to === "/" }}
            className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
            activeProps={{ className: "bg-primary/10 text-brand-deep" }}
          >
            <span className="grid size-4 shrink-0 place-items-center">
              <span className="size-2 rounded-sm bg-current opacity-60" />
            </span>
            {item.label}
          </Link>
        ))}
      </nav>
      <p className="px-2 pb-1.5 pt-4 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        AI Tools
      </p>
      <nav className="flex flex-col gap-0.5">
        {AI_TOOLS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
            activeProps={{ className: "bg-primary/10 text-brand-deep" }}
          >
            <span className="grid size-4 shrink-0 place-items-center">
              <span className="size-2 rounded-sm bg-accent/70" />
            </span>
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-2 pb-5">
      <div className="grid size-9 place-items-center rounded-[10px] bg-primary font-display text-sm font-semibold text-primary-foreground">
        C
      </div>
      <div className="leading-tight">
        <p className="font-display text-sm font-semibold text-foreground">Cape Cleaning Co</p>
        <p className="text-[11px] text-muted-foreground">Operations Assistant</p>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const dateLabel = new Date().toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="glass hidden w-64 shrink-0 flex-col gap-1 px-4 py-6 lg:flex">
        <Brand />
        <NavLinks />
        <div className="mt-auto rounded-[12px] bg-accent/10 p-3 ring-1 ring-accent/20">
          <p className="text-xs font-medium text-foreground">Responsible AI</p>
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
            AI drafts are always reviewed by staff before sending.
          </p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="glass sticky top-0 z-20 flex items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setOpen((v) => !v)}
              className="grid size-9 place-items-center rounded-[10px] ring-1 ring-border lg:hidden"
            >
              <Menu className="size-4" />
            </button>
            <div>
              <p className="text-xs font-medium text-muted-foreground">{dateLabel}</p>
              <p className="font-display text-sm font-semibold text-foreground">{title}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-brand-deep ring-1 ring-primary/20 sm:inline-flex">
              <span className="ai-dot size-1.5 rounded-full bg-primary" />
              AI ready
            </span>
            <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-deep text-xs font-semibold text-primary-foreground">
              LN
            </div>
          </div>
        </header>

        {open && (
          <div className="glass border-b border-border px-4 py-4 lg:hidden">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        )}

        <main className={cn("mx-auto max-w-6xl px-5 py-7 lg:px-8")}>
          {subtitle && <p className="sr-only">{subtitle}</p>}
          {children}
        </main>
      </div>
    </div>
  );
}
