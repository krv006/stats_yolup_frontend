import type { DemoScenario } from "@/shared/api/demo-scenario";
import { mockDelay, mockRespond } from "@/shared/api/mock";
import { toIsoDate } from "@/shared/lib/format";
import type { SupportTicket } from "../model/types";
import { supportDb } from "./mock-db";

function ticket(id: string): SupportTicket {
  const found = supportDb.tickets.find((t) => t.id === id);
  if (!found) throw new Error("Murojaat topilmadi.");
  return found;
}

const nowIso = () => {
  const d = new Date();
  return `${toIsoDate(d)}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

/** Support desk endpoints (mock). */
export const supportApi = {
  getTickets(scenario: DemoScenario, signal?: AbortSignal) {
    return mockRespond(scenario, () => supportDb.tickets, { empty: () => [], signal });
  },

  /** Sends a support reply; an open ticket becomes "answered". */
  async reply(ticketId: string, text: string) {
    await mockDelay();
    const t = ticket(ticketId);
    if (t.status === "closed") throw new Error("Yopilgan murojaatga javob yuborib bo‘lmaydi.");
    t.messages.push({ id: `m-new-${supportDb.nextMessageId++}`, from: "support", text, sentAt: nowIso() });
    t.status = "answered";
    return structuredClone(t);
  },

  async close(ticketId: string) {
    await mockDelay();
    const t = ticket(ticketId);
    t.status = "closed";
    t.closedAt = toIsoDate(new Date());
    return structuredClone(t);
  },
};
