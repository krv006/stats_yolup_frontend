import type { ChatRole, ComplaintReason, ComplaintStatus } from "../model/types";

export const COMPLAINT_REASON_LABEL: Record<ComplaintReason, string> = {
  harassment: "Bezovta qilish",
  spam: "Spam xabar",
  insult: "Haqoratli so‘zlar",
};

/** Long label shown in the detail header. */
export const COMPLAINT_STATUS_LABEL: Record<ComplaintStatus, string> = {
  new: "Yangi shikoyat",
  approved: "Tasdiqlangan (Chora ko‘rilgan)",
  rejected: "Rad etilgan",
};

export const CHAT_ROLE_LABEL: Record<ChatRole, string> = {
  student: "O‘quvchi",
  teacher: "O‘qituvchi",
  parent: "Ota-ona",
};
