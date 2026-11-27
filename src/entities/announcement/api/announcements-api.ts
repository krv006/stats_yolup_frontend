import type { DemoScenario } from "@/shared/api/demo-scenario";
import { mockDelay, mockRespond } from "@/shared/api/mock";
import { toIsoDate } from "@/shared/lib/format";
import type {
  AnnouncementHistory,
  AnnouncementReaders,
  AnnouncementSummary,
  Recipient,
  SendAnnouncementInput,
} from "../model/types";
import { announcementDb as db, type AnnouncementRow } from "./mock-db";

const user = (id: string): Recipient => {
  const found = db.directory.find((u) => u.id === id);
  if (!found) throw new Error("Foydalanuvchi topilmadi.");
  return found;
};

function summary(row: AnnouncementRow): AnnouncementSummary {
  const single = row.target !== "all";
  return {
    id: row.id,
    audience: single ? { kind: "user", user: user(row.target) } : { kind: "all" },
    audienceSize: single ? 1 : db.directory.length,
    text: row.text,
    sentAt: row.sentAt,
    readCount: row.reads.size,
    readAt: single ? (row.reads.get(row.target) ?? null) : null,
  };
}

function history(): AnnouncementHistory {
  const count = (role: Recipient["role"]) => db.directory.filter((u) => u.role === role).length;
  return {
    items: db.rows.map(summary),
    activeUsers: { teachers: count("teacher"), students: count("student") },
  };
}

const nowIso = () => {
  const d = new Date();
  return `${toIsoDate(d)}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

/** Broadcast & direct-message endpoints (mock). */
export const announcementsApi = {
  getHistory(scenario: DemoScenario, signal?: AbortSignal) {
    return mockRespond(scenario, history, {
      empty: () => ({ ...history(), items: [] }),
      signal,
    });
  },

  getReaders(id: string, signal?: AbortSignal) {
    return mockRespond(
      "default",
      (): AnnouncementReaders => {
        const row = db.rows.find((r) => r.id === id);
        if (!row) throw new Error("E’lon topilmadi.");
        const readers = [...row.reads].map(([userId, readAt]) => ({ user: user(userId), readAt }));
        return { announcement: summary(row), readers: readers.sort((a, b) => a.readAt.localeCompare(b.readAt)) };
      },
      { signal }
    );
  },

  /** Name / @username lookup for a direct message. */
  searchRecipients(query: string, signal?: AbortSignal) {
    const q = query.trim().toLowerCase().replace(/^@/, "");
    return mockRespond(
      "default",
      () => (q ? db.directory.filter((u) => u.name.toLowerCase().includes(q) || u.username.includes(q)).slice(0, 6) : []),
      { signal }
    );
  },

  async send({ audience, text }: SendAnnouncementInput) {
    await mockDelay();
    if (audience.kind === "user") user(audience.userId);
    const row: AnnouncementRow = {
      id: `a-new-${db.nextId++}`,
      target: audience.kind === "all" ? "all" : audience.userId,
      text,
      sentAt: nowIso(),
      reads: new Map(),
    };
    db.rows.unshift(row);
    return summary(row);
  },
};
