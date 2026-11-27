"use client";

import { useEffect, useRef } from "react";
import { CloseTicketButton } from "@/features/support-close";
import { ReplyComposer } from "@/features/support-reply";
import { REQUESTER_ROLE_LABEL, TicketStatusLabel, type SupportTicket } from "@/entities/support";
import { cn } from "@/shared/lib/cn";
import { formatMessageStamp } from "@/shared/lib/format";
import { InitialsAvatar } from "@/shared/ui/avatar";
import { Panel } from "@/shared/ui/panel";

const SUPPORT_NAME = "YolUp Qo‘llab-quvvatlash";

export function Conversation({ ticket }: { ticket: SupportTicket }) {
  const { requester } = ticket;
  const role = REQUESTER_ROLE_LABEL[requester.role];
  const scroller = useRef<HTMLOListElement>(null);

  // Keep the newest message in view when a reply lands.
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [ticket.messages.length]);

  return (
    <Panel aria-label={`Murojaat #${ticket.number}`} className="flex min-h-0 flex-col">
      <header className="flex items-center gap-3 border-b border-line px-[22px] py-4">
        <InitialsAvatar name={requester.name} size="lg" className="size-[38px]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-[16px] leading-5 font-semibold text-ink-strong">{ticket.subject}</h2>
            <TicketStatusLabel status={ticket.status} />
          </div>
          <p className="mt-0.5 truncate text-caption text-ink">
            {requester.name} (@{requester.username})<span className="mx-2">|</span>
            {role}
            <span className="mx-2">|</span>Murojaat #{ticket.number}
          </p>
        </div>
        <CloseTicketButton ticket={ticket} />
      </header>

      <ol ref={scroller} className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-[21px] py-5">
        {ticket.messages.map((m) => {
          const fromSupport = m.from === "support";
          return (
            <li
              key={m.id}
              className={cn("w-full rounded-xl px-4 py-3", fromSupport ? "max-w-125 self-end bg-action-subtle" : "max-w-130 self-start")}
            >
              <div className="flex items-center justify-between gap-4 text-caption">
                <span className="font-semibold text-ink-strong">
                  {fromSupport ? SUPPORT_NAME : `${requester.name} (${role})`}
                </span>
                <time dateTime={m.sentAt} className="text-ink">
                  {formatMessageStamp(m.sentAt)}
                </time>
              </div>
              <p className="mt-1.5 text-body leading-[19px] whitespace-pre-line text-ink-strong">{m.text}</p>
            </li>
          );
        })}
      </ol>

      <ReplyComposer ticket={ticket} />
    </Panel>
  );
}
