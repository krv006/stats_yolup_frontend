"use client";

import { Dialog as Primitive } from "@base-ui/react/dialog";
import type { ClientHealthSummary, ClientHealthUser } from "@/entities/system";
import { cn } from "@/shared/lib/cn";
import { BACKDROP_CLASS, Dialog, POPUP_CLASS } from "@/shared/ui/dialog";

const specs = (u: ClientHealthUser) =>
  [u.cores ? `${u.cores} yadro` : null, u.memoryGb ? `${u.memoryGb} GB RAM` : null, u.browser, u.os].filter(
    (part): part is string => Boolean(part)
  );

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-caption">
      <dt className="text-ink">{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  );
}

/** Read-only device summary; closes on Escape or a click outside. */
export function DeviceReportDialog({
  user,
  summary,
  onClose,
}: {
  user: ClientHealthUser | null;
  summary: ClientHealthSummary | undefined;
  onClose: () => void;
}) {
  return (
    <Dialog open={user != null} onOpenChange={(open) => !open && onClose()}>
      {user ? (
        <Primitive.Portal>
          <Primitive.Backdrop className={BACKDROP_CLASS} />
          <Primitive.Popup className={cn(POPUP_CLASS, "max-w-120 pb-[21px]")}>
            <Primitive.Title className="text-title-lg text-ink">
              Qurilma hisoboti: @{user.username} ({user.fullName})
            </Primitive.Title>
            <Primitive.Description className="mt-1.5 text-body text-ink">
              {specs(user).map((part, i) => (
                <span key={part}>
                  {i > 0 ? <span className="px-1.5" aria-hidden="true">|</span> : null}
                  {part}
                </span>
              ))}
            </Primitive.Description>
            <dl className="mt-[13px] flex flex-col gap-[11px]">
              <Row
                label={`Yuborilgan hisobotlar (${summary?.reportIntervalSeconds ?? 30}s interval)`}
                value={`${user.reports} ta`}
              />
              <Row
                label="CPU cheklovi kuzatilgan"
                value={`${user.cpuLimitedReports} marta (${user.reports ? ((user.cpuLimitedReports / user.reports) * 100).toFixed(1) : "0"}%)`}
              />
              <Row label="Tarmoq uzilishi" value={`${user.bandwidthLimitedReports} marta`} />
              <Row
                label="Eng past kadr tezligi (FPS)"
                value={user.minFps != null ? `${user.minFps} FPS${user.minFpsContext ? ` (${user.minFpsContext})` : ""}` : "—"}
              />
            </dl>
          </Primitive.Popup>
        </Primitive.Portal>
      ) : null}
    </Dialog>
  );
}
