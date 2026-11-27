export type ComplaintStatus = "new" | "approved" | "rejected";
export type ComplaintReason = "harassment" | "spam" | "insult";
export type ChatRole = "student" | "teacher" | "parent";

export interface ChatUser {
  name: string;
  username: string;
  role: ChatRole;
}

export interface ComplaintMessage {
  id: string;
  /** Who wrote it: the reported user or the one who complained. */
  author: "accused" | "reporter";
  text: string;
  /** "19:51" */
  time: string;
}

export interface Complaint {
  id: string;
  status: ComplaintStatus;
  reason: ComplaintReason;
  /** The user being reported. */
  accused: ChatUser;
  reporter: ChatUser;
  /** Local ISO date-time. */
  sentAt: string;
  resolvedAt: string | null;
  /** Last messages of the private chat, oldest first. */
  messages: ComplaintMessage[];
}
