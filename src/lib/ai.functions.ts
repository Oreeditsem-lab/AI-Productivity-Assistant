import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MODEL = "google/gemini-3.6-flash";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

async function callGateway(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured. Please contact your administrator.");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({ model: MODEL, messages }),
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 429) throw new Error("The AI assistant is busy right now. Please retry in a moment.");
    if (res.status === 402)
      throw new Error("AI credits have run out for this workspace. Please add credits to continue.");
    throw new Error(`AI request failed (${res.status}). ${body.slice(0, 200)}`);
  }

  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = json.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("The AI returned an empty response. Please try again.");
  return text;
}

const messageInput = z.object({
  customerName: z.string().min(1),
  customerType: z.string().default(""),
  purpose: z.string().min(1),
  service: z.string().default(""),
  date: z.string().default(""),
  time: z.string().default(""),
  details: z.string().default(""),
  tone: z.string().default("Professional"),
});

export const generateCustomerMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => messageInput.parse(data))
  .handler(async ({ data }) => {
    const prompt = `You are a professional customer service assistant for Cape Cleaning Co, a cleaning services company.

Using only the information provided by the employee, create a clear, professional and customer-friendly message.

Customer:
${data.customerName}${data.customerType ? ` (${data.customerType})` : ""}

Purpose:
${data.purpose}

Service:
${data.service || "Not provided"}

Appointment:
${[data.date, data.time].filter(Boolean).join(" at ") || "Not provided"}

Additional information:
${data.details || "Not provided"}

Tone:
${data.tone}

Do not invent prices, availability, policies, appointments or customer information.

If important information is missing, identify it before generating the final message.

Return only the message ready for the employee to review and send.`;

    return { text: await callGateway([{ role: "user", content: prompt }]) };
  });

const scheduleInput = z.object({
  date: z.string().default(""),
  cleaners: z.string().default(""),
  jobs: z.string().default(""),
  locations: z.string().default(""),
  services: z.string().default(""),
  times: z.string().default(""),
  durations: z.string().default(""),
  priority: z.string().default(""),
  instructions: z.string().default(""),
});

export const generateCleaningSchedule = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => scheduleInput.parse(data))
  .handler(async ({ data }) => {
    const prompt = `You are an operations scheduling assistant for Cape Cleaning Co, a cleaning services company.

Create an organised cleaning schedule using ONLY the information provided below.

Date: ${data.date || "Not provided"}
Available cleaners: ${data.cleaners || "Not provided"}
Customers / jobs: ${data.jobs || "Not provided"}
Locations: ${data.locations || "Not provided"}
Cleaning services: ${data.services || "Not provided"}
Appointment times: ${data.times || "Not provided"}
Estimated durations: ${data.durations || "Not provided"}
Priority notes: ${data.priority || "Not provided"}
Special instructions: ${data.instructions || "Not provided"}

Rules:
- Prioritise urgent jobs first, then high, normal, low.
- Never assign the same cleaner to overlapping jobs.
- Identify scheduling conflicts explicitly.
- Do not invent customers, cleaners, times, prices or availability.
- If information is insufficient, say exactly what information is missing instead of assuming.

Respond in this structure using markdown:

## Schedule
A markdown table with the columns: Time | Customer | Location | Cleaning Service | Cleaner | Priority | Status

## Conflicts
## Missing information
## Suggestions for a more efficient day`;

    return { text: await callGateway([{ role: "user", content: prompt }]) };
  });

const notesInput = z.object({ notes: z.string().min(1) });

export const summariseJobNotes = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => notesInput.parse(data))
  .handler(async ({ data }) => {
    const prompt = `You are an operations assistant for Cape Cleaning Co.

Convert the following customer or cleaning job notes into a concise, structured job brief.

Preserve all important information.

Do not invent information.

Identify missing information clearly.

Extract:

Customer/job
Location
Cleaning requirements
Special instructions
Priority
Appointment/deadline
Assigned employee
Action items
Additional notes

Then add a final section titled "Important Information" highlighting deadlines, special requests, risks, or anything the cleaner must know.

Use markdown headings and bullet points.

Original notes:
${data.notes}`;

    return { text: await callGateway([{ role: "user", content: prompt }]) };
  });

const assistantInput = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .min(1),
  context: z.string().default(""),
});

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => assistantInput.parse(data))
  .handler(async ({ data }) => {
    const system = `You are the Cape Cleaning Co AI Assistant, helping staff of a cleaning services company with day-to-day operations.

Answer using only general cleaning-operations knowledge and the application information supplied below.

You must NEVER invent: prices, appointment availability, company policies, customer information, guarantees or cleaning schedules.

If the information is unavailable, reply exactly:
"I don't have enough information to answer that accurately. Please confirm this with a Cape Cleaning Co staff member."

Keep answers concise, practical and written for a busy employee. Use markdown formatting where helpful.

Application information (demo data):
${data.context || "No application data supplied."}`;

    const text = await callGateway([
      { role: "system", content: system },
      ...data.messages.map((m) => ({ role: m.role, content: m.content }) as ChatMessage),
    ]);
    return { text };
  });
