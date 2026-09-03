import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import {
  demoCustomers,
  demoServices,
  demoTasks,
  type Customer,
  type Service,
  type Task,
} from "./demo-data";

type AppData = {
  tasks: Task[];
  customers: Customer[];
  services: Service[];
};

type Store = AppData & {
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addService: (service: Omit<Service, "id">) => void;
  updateService: (id: string, patch: Partial<Service>) => void;
  deleteService: (id: string) => void;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;
  resetDemoData: () => void;
};

const STORAGE_KEY = "cape-cleaning-co:data:v1";

const initial: AppData = {
  tasks: demoTasks,
  customers: demoCustomers,
  services: demoServices,
};

const StoreContext = createContext<Store | null>(null);

const newId = () => Math.random().toString(36).slice(2, 10);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(initial);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setData(JSON.parse(raw) as AppData);
      } catch {
        /* ignore corrupt state and keep demo data */
      }
    }
  }, []);

  const persist = useCallback((next: AppData) => {
    setData(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }, []);

  const value: Store = {
    ...data,
    addTask: (task) => persist({ ...data, tasks: [{ ...task, id: newId() }, ...data.tasks] }),
    updateTask: (id, patch) =>
      persist({ ...data, tasks: data.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }),
    deleteTask: (id) => persist({ ...data, tasks: data.tasks.filter((t) => t.id !== id) }),
    addService: (service) =>
      persist({ ...data, services: [...data.services, { ...service, id: newId() }] }),
    updateService: (id, patch) =>
      persist({
        ...data,
        services: data.services.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      }),
    deleteService: (id) => persist({ ...data, services: data.services.filter((s) => s.id !== id) }),
    updateCustomer: (id, patch) =>
      persist({
        ...data,
        customers: data.customers.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      }),
    resetDemoData: () => persist(initial),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
