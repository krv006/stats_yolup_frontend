import { REQUESTER_ROLE_LABEL, TicketStatusLabel, type SupportTicket } from "@/entities/support";
import { cn } from "@/shared/lib/cn";
import { formatListStamp } from "@/shared/lib/format";
import { InitialsAvatar } from "@/shared/ui/avatar";
import { SearchInput } from "@/shared/ui/input";
import { Panel } from "@/shared/ui/panel";

export function TicketList({
  tickets,
  selectedId,
  query,
  onQueryChange,
  onSelect,
}: {
  tickets: SupportTicket[];
  selectedId: string | undefined;
  query: string;
  onQueryChange: (query: string) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <Panel aria-label="Murojaatlar ro‘yxati" className="flex min-h-0 flex-col">
      <div className="px-[15px] pt-[14px] pb-2">
        <SearchInput
          label="Murojaatlarni qidirish"
          placeholder="Murojaat yoki foydalanuvchi..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>
      <ul className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-[15px] pb-[15px]">
        {tickets.map((t) => (
          <li key={t.id}>
            <TicketCard ticket={t} selected={t.id === selectedId} onSelect={() => onSelect(t.id)} />
          </li>
        ))}
        {!tickets.length ? <li className="py-10 text-center text-body text-ink-secondary">Hech narsa topilmadi</li> : null}
      </ul>
    </Panel>
  );
}

function TicketCard({ ticket, selected, onSelect }: { ticket: SupportTicket; selected: boolean; onSelect: () => void }) {
  const { requester } = ticket;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "flex w-full flex-col rounded-lg border-[1.5px] px-3 pt-3 pb-2.5 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
        selected ? "border-action bg-action-subtle" : "border-transparent hover:bg-subtle"
      )}
    >
      <span className="flex items-center gap-2">
        <InitialsAvatar name={requester.name} className="size-7 bg-elevated text-caption" />
        <span className="min-w-0 flex-1 truncate text-body font-semibold text-ink-strong">{ticket.subject}</span>
        <TicketStatusLabel status={ticket.status} />
      </span>
      <span className="mt-1.5 truncate text-caption text-ink">{ticket.preview}</span>
      <span className="mt-[5px] flex items-center gap-3 text-caption text-ink-strong">
        <span className="min-w-0 flex-1 truncate">
          {requester.name} (@{requester.username})<span className="mx-2">|</span>
          {REQUESTER_ROLE_LABEL[requester.role]}
        </span>
        <span className="shrink-0 text-ink">{formatListStamp(ticket.createdAt)}</span>
      </span>
    </button>
  );
}
