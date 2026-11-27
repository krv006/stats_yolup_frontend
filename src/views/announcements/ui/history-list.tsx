import { readBarClass, readShare, type AnnouncementSummary } from "@/entities/announcement";
import { formatDateTime } from "@/shared/lib/format";
import { Button } from "@/shared/ui/button";
import { ProgressBar } from "@/shared/ui/progress-bar";

export function AnnouncementHistoryList({
  items,
  onShowReaders,
}: {
  items: AnnouncementSummary[];
  onShowReaders: (id: string) => void;
}) {
  return (
    <ul className="-mx-[23px] mt-[17px] flex min-h-0 flex-1 flex-col gap-[25px] overflow-y-auto px-[23px]">
      {items.map((a) => (
        <li key={a.id} className="px-4 py-2">
          <div className="flex items-center justify-between gap-4 text-caption text-ink">
            <span className="truncate">
              {a.audience.kind === "all"
                ? `Hammaga (${a.audienceSize} foydalanuvchi)`
                : `${a.audience.user.name} (@${a.audience.user.username})`}
            </span>
            <time dateTime={a.sentAt} className="shrink-0">
              {formatDateTime(a.sentAt)}
            </time>
          </div>
          <p className="mt-[11px] text-body text-ink">{a.text}</p>
          <div className="mt-[11px] flex items-center gap-2.5">
            <ProgressBar
              value={readShare(a)}
              label="O‘qilganlik darajasi"
              colorClass={readBarClass(a)}
              className="w-40"
            />
            <span className="flex-1 text-caption font-semibold text-ink">{readLabel(a)}</span>
            <Button variant="secondary" size="xs" className="px-3 font-normal" onClick={() => onShowReaders(a.id)}>
              Kim o‘qidi
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function readLabel(a: AnnouncementSummary): string {
  if (a.audience.kind === "user") return a.readAt ? `O‘qidi (${a.readAt.slice(11, 16)} da)` : "Hali o‘qilmagan";
  return `${a.readCount} / ${a.audienceSize} o‘qidi (${readShare(a)}%)`;
}
