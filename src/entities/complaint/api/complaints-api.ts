import type { DemoScenario } from "@/shared/api/demo-scenario";
import { mockDelay, mockRespond } from "@/shared/api/mock";
import { todayIso } from "@/shared/lib/format";
import type { Complaint } from "../model/types";
import { complaintDb } from "./mock-db";

async function resolve(id: string, status: "approved" | "rejected"): Promise<Complaint> {
  await mockDelay();
  const complaint = complaintDb.complaints.find((c) => c.id === id);
  if (!complaint) throw new Error("Shikoyat topilmadi.");
  if (complaint.status !== "new") throw new Error("Bu shikoyat bo‘yicha qaror allaqachon qabul qilingan.");
  Object.assign(complaint, { status, resolvedAt: todayIso() });
  return structuredClone(complaint);
}

/** Chat-safety moderation endpoints (mock). */
export const complaintsApi = {
  getComplaints(scenario: DemoScenario, signal?: AbortSignal) {
    return mockRespond(scenario, () => complaintDb.complaints, { empty: () => [], signal });
  },
  /** Upholds the complaint: the reported user gets a warning / chat restriction. */
  approve: (id: string) => resolve(id, "approved"),
  reject: (id: string) => resolve(id, "rejected"),
};
