import { CHAT_ROLE_LABEL, COMPLAINT_REASON_LABEL, type Complaint } from "@/entities/complaint";
import { cn } from "@/shared/lib/cn";
import { formatDateTime } from "@/shared/lib/format";
import { InitialsAvatar } from "@/shared/ui/avatar";
import { Panel } from "@/shared/ui/panel";

export function ComplaintList({
  title,
  complaints,
  selectedId,
  onSelect,
}: {
  title: string;
  complaints: Complaint[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <Panel aria-label={title} className="flex min-h-0 flex-col">
      <h2 className="px-4 pt-4 text-title text-ink">{title}</h2>
      <ul className="mt-2.5 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 pb-4">
        {complaints.map((c) => (
          <li key={c.id}>
            <ComplaintCard complaint={c} selected={c.id === selectedId} onSelect={() => onSelect(c.id)} />
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function ComplaintCard({ complaint, selected, onSelect }: { complaint: Complaint; selected: boolean; onSelect: () => void }) {
  const { accused, reporter } = complaint;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "flex w-full flex-col rounded-lg border-[1.5px] px-[15px] pt-3.5 pb-3 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
        selected ? "border-danger bg-danger-bg" : "border-transparent hover:bg-subtle"
      )}
    >
      <span className="flex items-center gap-[11px]">
        <InitialsAvatar name={accused.name} className="size-[30px]" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[14px] leading-[17px] font-medium text-ink">{accused.name}</span>
          <span className="truncate text-caption text-ink">
            @{accused.username}
            <span className="mx-2">|</span>
            {CHAT_ROLE_LABEL[accused.role]}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5 self-start pt-0.5 text-caption font-medium text-ink-strong">
          <span className="size-1.5 rounded-full bg-danger" aria-hidden="true" />
          {COMPLAINT_REASON_LABEL[complaint.reason]}
        </span>
      </span>
      <span className="mt-2 truncate text-caption text-ink">
        Shikoyat qilgan: {reporter.name} (@{reporter.username})
      </span>
      <span className="mt-[7px] text-caption text-ink">Sana: {formatDateTime(complaint.sentAt)}</span>
    </button>
  );
}
