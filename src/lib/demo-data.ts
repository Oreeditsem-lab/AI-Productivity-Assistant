export type Priority = "Urgent" | "High" | "Normal" | "Low";
export type TaskStatus = "Pending" | "In Progress" | "Completed";
export type CustomerStatus = "New" | "Confirmed" | "In Progress" | "Completed" | "Cancelled";

export type Task = {
  id: string;
  name: string;
  customer: string;
  cleaner: string;
  service: string;
  location: string;
  date: string;
  time: string;
  priority: Priority;
  status: TaskStatus;
  notes: string;
};

export type Customer = {
  id: string;
  name: string;
  contact: string;
  service: string;
  bookingDate: string;
  location: string;
  notes: string;
  status: CustomerStatus;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  requirements: string;
};

export const CLEANERS = ["Naledi K.", "Thabo M.", "Lerato N.", "Ayesha P."];
export const PRIORITIES: Priority[] = ["Urgent", "High", "Normal", "Low"];
export const TASK_STATUSES: TaskStatus[] = ["Pending", "In Progress", "Completed"];
export const CUSTOMER_STATUSES: CustomerStatus[] = [
  "New",
  "Confirmed",
  "In Progress",
  "Completed",
  "Cancelled",
];

const today = () => new Date().toISOString().slice(0, 10);

export const demoTasks: Task[] = [
  {
    id: "t1",
    name: "Deep clean — 3 bedroom apartment",
    customer: "Sarah Adams",
    cleaner: "Naledi K.",
    service: "Deep clean",
    location: "Sea Point",
    date: today(),
    time: "08:30",
    priority: "Urgent",
    status: "In Progress",
    notes: "Client requested oven and fridge interior. Keys with building concierge.",
  },
  {
    id: "t2",
    name: "Office clean — reception and boardroom",
    customer: "Michael Daniels",
    cleaner: "Thabo M.",
    service: "Office clean",
    location: "Cape Town CBD",
    date: today(),
    time: "10:00",
    priority: "Normal",
    status: "Pending",
    notes: "Access after 09:45 only. Sign in at security desk.",
  },
  {
    id: "t3",
    name: "Move-out clean",
    customer: "Thandi Mokoena",
    cleaner: "Lerato N.",
    service: "Move-out clean",
    location: "Claremont",
    date: today(),
    time: "11:30",
    priority: "High",
    status: "In Progress",
    notes: "Landlord inspection at 16:00 — must be finished before then.",
  },
  {
    id: "t4",
    name: "Weekly maintenance clean",
    customer: "James Williams",
    cleaner: "Naledi K.",
    service: "Weekly clean",
    location: "Observatory",
    date: today(),
    time: "13:00",
    priority: "Low",
    status: "Completed",
    notes: "Regular weekly visit. Pet on site (friendly dog).",
  },
  {
    id: "t5",
    name: "Post-renovation clean",
    customer: "Sarah Adams",
    cleaner: "Ayesha P.",
    service: "Post-renovation clean",
    location: "Sea Point",
    date: today(),
    time: "15:00",
    priority: "High",
    status: "Pending",
    notes: "Fine dust throughout. Requires industrial vacuum.",
  },
];

export const demoCustomers: Customer[] = [
  {
    id: "c1",
    name: "Sarah Adams",
    contact: "sarah.adams@example.com",
    service: "Deep clean",
    bookingDate: today(),
    location: "Sea Point",
    notes: "Prefers morning appointments.",
    status: "In Progress",
  },
  {
    id: "c2",
    name: "Michael Daniels",
    contact: "m.daniels@example.com",
    service: "Office clean",
    bookingDate: today(),
    location: "Cape Town CBD",
    notes: "Invoices to be sent to the office manager.",
    status: "Confirmed",
  },
  {
    id: "c3",
    name: "Thandi Mokoena",
    contact: "thandi.m@example.com",
    service: "Move-out clean",
    bookingDate: today(),
    location: "Claremont",
    notes: "Landlord inspection same day.",
    status: "In Progress",
  },
  {
    id: "c4",
    name: "James Williams",
    contact: "j.williams@example.com",
    service: "Weekly clean",
    bookingDate: today(),
    location: "Observatory",
    notes: "Recurring weekly booking.",
    status: "Completed",
  },
  {
    id: "c5",
    name: "Nadia Petersen",
    contact: "nadia.p@example.com",
    service: "Enquiry — deep clean",
    bookingDate: "",
    location: "Milnerton",
    notes: "Awaiting a quote. No date confirmed yet.",
    status: "New",
  },
];

export const demoServices: Service[] = [
  {
    id: "s1",
    name: "Standard clean",
    description: "Placeholder record — edit with your own service description.",
    duration: "Not set",
    price: "Not set",
    requirements: "Not set",
  },
  {
    id: "s2",
    name: "Deep clean",
    description: "Placeholder record — edit with your own service description.",
    duration: "Not set",
    price: "Not set",
    requirements: "Not set",
  },
  {
    id: "s3",
    name: "Office clean",
    description: "Placeholder record — edit with your own service description.",
    duration: "Not set",
    price: "Not set",
    requirements: "Not set",
  },
  {
    id: "s4",
    name: "Move-out clean",
    description: "Placeholder record — edit with your own service description.",
    duration: "Not set",
    price: "Not set",
    requirements: "Not set",
  },
  {
    id: "s5",
    name: "Post-renovation clean",
    description: "Placeholder record — edit with your own service description.",
    duration: "Not set",
    price: "Not set",
    requirements: "Not set",
  },
];
