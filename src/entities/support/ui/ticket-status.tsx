import { cn } from "@/shared/lib/cn";
import { TICKET_STATUS_DOT, TICKET_STATUS_LABEL } from "../lib/ticket-meta";
import type { TicketStatus } from "../model/types";

export function TicketStatusLabel({ status, className }: { status: TicketStatus; className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1.5 text-caption font-medium text-ink-strong", className)}>
      <span className={cn("size-1.5 rounded-full", TICKET_STATUS_DOT[status])} aria-hidden="true" />
      {TICKET_STATUS_LABEL[status]}
    </span>
  );
}
