"use client";

import { RECIPIENT_ROLE_LABEL, useAnnouncementReaders } from "@/entities/announcement";
import { formatDateTime } from "@/shared/lib/format";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui/dialog";
import { Skeleton } from "@/shared/ui/skeleton";

/** "Kim o‘qidi": who opened an announcement and when. */
export function ReadersDialog({ announcementId, onClose }: { announcementId: string | null; onClose: () => void }) {
  const query = useAnnouncementReaders(announcementId);
  const data = query.data;

  return (
    <Dialog open={announcementId != null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showClose={false} className="max-w-120 pb-[15px]">
        <DialogTitle className="pr-0">
          Xabarni o‘qigan foydalanuvchilar
          {data ? ` (${data.announcement.readCount} / ${data.announcement.audienceSize})` : ""}
        </DialogTitle>
        <DialogDescription className="mt-3 truncate text-caption text-ink">
          {data ? `E’lon: '${data.announcement.text}'` : "Yuklanmoqda..."}
        </DialogDescription>

        {query.isError ? (
          <p role="alert" className="py-8 text-center text-body text-danger-fg">
            Ro‘yxatni yuklab bo‘lmadi.
          </p>
        ) : !data ? (
          <div aria-busy="true" className="mt-2 flex flex-col">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-[22px]">
                <Skeleton className="h-3.5 w-45" />
                <Skeleton className="h-3 w-35" />
              </div>
            ))}
          </div>
        ) : data.readers.length ? (
          <ul className="mt-2 max-h-80 overflow-y-auto">
            {data.readers.map(({ user, readAt }) => (
              <li key={user.id} className="flex items-center justify-between gap-4 px-3 py-[15px]">
                <div className="min-w-0">
                  <p className="truncate text-body font-medium text-ink">
                    {user.name} (@{user.username})
                  </p>
                  <p className="text-caption text-ink">{RECIPIENT_ROLE_LABEL[user.role]}</p>
                </div>
                <span className="shrink-0 text-caption text-ink">O‘qidi: {formatDateTime(readAt)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-8 text-center text-body text-ink-secondary">Hali hech kim o‘qimagan.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
