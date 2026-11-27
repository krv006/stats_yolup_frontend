"use client";

import {
  CLIENT_RANGES,
  type ClientHealthSummary,
  type ClientHealthUser,
  type ClientRange,
  type ClientRole,
} from "@/entities/system";
import { cn } from "@/shared/lib/cn";
import { formatShortDateTime } from "@/shared/lib/format";
import { ChoiceGroup } from "@/shared/ui/choice-group";
import { Panel } from "@/shared/ui/panel";

export const ROLE_LABEL: Record<ClientRole, string> = {
  teacher: "O‘qituvchi",
  student: "O‘quvchi",
  parent: "Ota-ona",
};

/** Below this the picture stutters noticeably. */
export const LOW_FPS = 15;

const RANGE_LABEL: Record<ClientRange, string> = { 24: "24s", 72: "3k", 168: "7k", 336: "14 kun" };

/** "Aziza Karimova" → "Aziza K." */
const shortName = (full: string) => {
  const [first = "", last = ""] = full.split(" ");
  return last ? `${first} ${last[0]}.` : first;
};

export const deviceLine = (u: ClientHealthUser) =>
  [u.cores ? `${u.cores} yadro` : null, u.memoryGb ? `${u.memoryGb} GB` : null, u.browser, u.os.split(" ")[0]]
    .filter(Boolean)
    .join(", ");

export function ClientHealthPanel({
  data,
  range,
  onRangeChange,
  onOpenUser,
}: {
  data: ClientHealthSummary;
  range: ClientRange;
  onRangeChange: (range: ClientRange) => void;
  onOpenUser: (user: ClientHealthUser) => void;
}) {
  const limitedShare = data.total ? Math.round((data.cpuLimitedTotal / data.total) * 100) : 0;
  const slowUsers = data.users.filter((u) => u.cpuLimitedReports > 0).length;
  const kpis = [
    { label: "Jami hisobotlar", value: `${data.total} ta` },
    { label: "CPU yetmagan", value: `${data.cpuLimitedTotal} ta (${limitedShare}%)` },
    { label: "Foydalanuvchilar", value: `${data.users.length} nafar` },
    { label: "Kompyuteri sekinlar", value: `${slowUsers} nafar` },
  ];

  return (
    <Panel className="px-5 pt-[17px] pb-1">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-ink">Mijoz salomatligi (Jonli dars qurilmalari)</h2>
        <ChoiceGroup
          label="Davr"
          variant="pill"
          value={range}
          onChange={onRangeChange}
          options={CLIENT_RANGES.map((h) => ({ value: h, label: RANGE_LABEL[h] }))}
        />
      </header>

      <dl className="mt-5 grid grid-cols-2 gap-y-4 px-3.5 pb-[21px] md:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label}>
            <dt className="text-caption text-ink">{k.label}</dt>
            <dd className="mt-px text-base leading-5 font-semibold text-ink">{k.value}</dd>
          </div>
        ))}
      </dl>

      <ul>
        {data.users.map((u) => {
          const slow = u.cpuLimitedReports > 0 || (u.minFps != null && u.minFps < LOW_FPS);
          return (
            <li key={u.userId} className="border-t border-line-subtle">
              <button
                type="button"
                onClick={() => onOpenUser(u)}
                className="flex w-full items-center gap-4 rounded-md pt-3 pb-[22px] text-left outline-none hover:bg-subtle/60 focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-body text-ink">
                    <span className="font-semibold">@{u.username}</span>
                    {u.role === "teacher" ? <span className="font-semibold"> ({shortName(u.fullName)})</span> : null}
                    <span className="ml-2">{ROLE_LABEL[u.role]}</span>
                  </span>
                  <span className="block truncate text-caption text-ink">{deviceLine(u)}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2.5 text-caption text-ink">
                  <span>{u.reports} hisobot</span>
                  {u.minFps != null ? (
                    <span className={cn("flex items-center gap-1.5", slow && "font-semibold")}>
                      {slow ? <span className="size-1.5 rounded-full bg-warning" aria-hidden="true" /> : null}
                      {u.minFps} FPS
                    </span>
                  ) : null}
                  {u.lastAt ? <span>{formatShortDateTime(u.lastAt)}</span> : null}
                </span>
              </button>
            </li>
          );
        })}
        {data.users.length === 0 ? (
          <li className="border-t border-line-subtle py-8 text-center text-body text-ink">
            Bu davrda jonli dars qurilma hisobotlari kelmagan.
          </li>
        ) : null}
      </ul>
    </Panel>
  );
}
