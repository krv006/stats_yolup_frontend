import type { RequesterRole, TicketStatus } from "../model/types";

export const TICKET_STATUS_LABEL: Record<TicketStatus, string> = {
  open: "Ochiq",
  answered: "Javob berilgan",
  closed: "Yopilgan",
};

export const TICKET_STATUS_DOT: Record<TicketStatus, string> = {
  open: "bg-action",
  answered: "bg-success",
  closed: "bg-ink-muted",
};

export const REQUESTER_ROLE_LABEL: Record<RequesterRole, string> = {
  student: "O‘quvchi",
  teacher: "O‘qituvchi",
  parent: "Ota-ona",
};
