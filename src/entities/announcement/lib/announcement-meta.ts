import type { AnnouncementSummary, RecipientRole } from "../model/types";

export const RECIPIENT_ROLE_LABEL: Record<RecipientRole, string> = {
  student: "O‘quvchi",
  teacher: "O‘qituvchi",
};

/** Share of recipients that opened it, 0–100. */
export function readShare(a: AnnouncementSummary): number {
  return a.audienceSize ? Math.round((a.readCount / a.audienceSize) * 100) : 0;
}

/** Bar colour: personal messages teal, broadcasts green once nearly everyone read them. */
export function readBarClass(a: AnnouncementSummary): string {
  if (a.audience.kind === "user") return "bg-plan-demo";
  return readShare(a) >= 95 ? "bg-success" : "bg-action";
}
