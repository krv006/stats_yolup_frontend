export type TicketStatus = "open" | "answered" | "closed";
export type RequesterRole = "student" | "teacher" | "parent";

export interface TicketMessage {
  id: string;
  from: "user" | "support";
  text: string;
  /** Local ISO date-time. */
  sentAt: string;
}

export interface SupportTicket {
  id: string;
  /** Human number shown to users, e.g. 1042. */
  number: number;
  subject: string;
  /** One-line summary for the list. */
  preview: string;
  status: TicketStatus;
  requester: { name: string; username: string; role: RequesterRole };
  createdAt: string;
  closedAt: string | null;
  messages: TicketMessage[];
}

export const TICKET_STATUSES: TicketStatus[] = ["open", "answered", "closed"];
