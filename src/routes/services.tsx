import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageIntro } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import type { Service } from "@/lib/demo-data";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Cleaning Services | Cape Cleaning Co" },
      {
        name: "description",
        content:
          "Editable Cape Cleaning Co service records: description, typical duration, price status and special requirements.",
      },
      { property: "og:title", content: "Cleaning Services — Cape Cleaning Co" },
      {
        property: "og:description",
        content: "Administrators can add, edit and remove cleaning service records.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServiceCard({ service }: { service: Service }) {
  const { updateService, deleteService } = useStore();
  const [draft, setDraft] = useState(service);
  const dirty = JSON.stringify(draft) !== JSON.stringify(service);

  return (
    <div className="glass rounded-[14px] p-4">
      <Input
        value={draft.name}
        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        className="bg-card font-display font-semibold"
        aria-label="Service name"
      />
      <Textarea
        value={draft.description}
        onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        className="mt-2 bg-card text-sm"
        rows={2}
        aria-label="Service description"
      />
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Input
          value={draft.duration}
          onChange={(e) => setDraft({ ...draft, duration: e.target.value })}
          className="bg-card text-sm"
          placeholder="Typical duration"
          aria-label="Typical duration"
        />
        <Input
          value={draft.price}
          onChange={(e) => setDraft({ ...draft, price: e.target.value })}
          className="bg-card text-sm"
          placeholder="Price / status"
          aria-label="Price or status"
        />
      </div>
      <Input
        value={draft.requirements}
        onChange={(e) => setDraft({ ...draft, requirements: e.target.value })}
        className="mt-2 bg-card text-sm"
        placeholder="Special requirements"
        aria-label="Special requirements"
      />
      <div className="mt-3 flex gap-2">
        <Button size="sm" disabled={!dirty} onClick={() => updateService(service.id, draft)}>
          <Save className="size-3.5" /> Save
        </Button>
        <Button size="sm" variant="ghost" onClick={() => deleteService(service.id)}>
          <Trash2 className="size-3.5" /> Remove
        </Button>
      </div>
    </div>
  );
}

function ServicesPage() {
  const { services, addService } = useStore();

  return (
    <AppShell title="Cleaning Services">
      <PageIntro
        title="Cleaning Services"
        description="Service offerings and prices have not been supplied, so these are editable placeholder records for an administrator to customise."
        action={
          <Button
            onClick={() =>
              addService({
                name: "New service",
                description: "Placeholder record — edit with your own service description.",
                duration: "Not set",
                price: "Not set",
                requirements: "Not set",
              })
            }
          >
            <Plus className="size-4" /> Add service
          </Button>
        }
      />
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </div>
    </AppShell>
  );
}
