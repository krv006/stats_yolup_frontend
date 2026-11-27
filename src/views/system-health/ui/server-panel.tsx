"use client";

import {
  SERVER_RANGES,
  type MonitoringHistory,
  type ServerRange,
  type ServerStatus,
} from "@/entities/system";
import { formatCount, formatShortDateTime } from "@/shared/lib/format";
import { ChoiceGroup } from "@/shared/ui/choice-group";
import { Panel } from "@/shared/ui/panel";
import { ProgressBar } from "@/shared/ui/progress-bar";

/** Peaks above this read as "busy" rather than normal. */
const CPU_PEAK_ALERT = 20;
const MEMORY_ALERT = 85;

const pct = (value: number) => `${value.toFixed(1)}%`;

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div>
      <dt className="text-caption text-ink">{label}</dt>
      <dd className="mt-px text-numeric-sm text-ink">{value}</dd>
      <dd className="text-caption text-ink-secondary">{hint}</dd>
    </div>
  );
}

function Usage({ label, value, pctValue, colorClass }: { label: string; value: string; pctValue: number; colorClass: string }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-caption">
        <span className="text-ink">{label}</span>
        <span className="font-semibold text-ink">{value}</span>
      </div>
      <ProgressBar value={pctValue} label={label} colorClass={colorClass} className="mt-1 h-1.5 w-[calc(100%-10px)]" />
    </div>
  );
}

export function ServerPanel({
  status,
  history,
  range,
  onRangeChange,
}: {
  status: ServerStatus;
  history: MonitoringHistory | undefined;
  range: ServerRange;
  onRangeChange: (range: ServerRange) => void;
}) {
  const current = status.current!;
  const peak = history?.peak;
  const freeGb = Math.floor((current.memoryTotalMb - current.memoryUsedMb) / 100) / 10;

  return (
    <Panel className="px-[22px] pt-[17px] pb-[19px]">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink">Server holati (Backend konteyner)</h2>
          <p className="text-caption text-ink">
            CPU va operativ xotira (RAM) yuklamasi
            {history ? (
              <>
                <span className="px-2" aria-hidden="true">|</span>
                {history.points} ta nuqta
              </>
            ) : null}
            {peak ? (
              <>
                <span className="px-2" aria-hidden="true">|</span>
                Eng band vaqt: {formatShortDateTime(peak.createdAt)} (CPU {pct(peak.cpuPercent)})
              </>
            ) : null}
          </p>
        </div>
        <ChoiceGroup
          label="Davr"
          variant="pill"
          className="mt-1.5"
          value={range}
          onChange={onRangeChange}
          options={SERVER_RANGES.map((h) => ({ value: h, label: `${h} soat` }))}
        />
      </header>

      <dl className="mt-[25px] grid grid-cols-2 gap-y-5 pl-4 xl:grid-cols-4">
        <Metric
          label="CPU yuklamasi"
          value={pct(current.cpuPercent)}
          hint={
            peak
              ? peak.cpuPercent >= CPU_PEAK_ALERT
                ? `Pik yuklama: ${pct(peak.cpuPercent)}`
                : `Me’yorda (pik: ${pct(peak.cpuPercent)})`
              : "Me’yorda"
          }
        />
        <Metric label="Xotira (RAM)" value={pct(current.memoryPercent)} hint={current.memoryPercent >= MEMORY_ALERT ? "Yuqori" : "Barqaror"} />
        <Metric
          label="Ishlatilgan xotira"
          value={`${formatCount(current.memoryUsedMb)} / ${formatCount(current.memoryTotalMb)} MB`}
          hint={`${freeGb.toFixed(1)} GB bo‘sh`}
        />
        <Metric
          label="Oxirgi o‘lchov"
          value={formatShortDateTime(current.createdAt)}
          hint={`Har ${status.sampleIntervalMinutes} daqiqada`}
        />
      </dl>

      <div className="mt-[25px] grid gap-x-[27px] gap-y-4 lg:grid-cols-2">
        <Usage
          label={`CPU o‘rtacha bandligi (${range} soat)`}
          value={history ? `${pct(history.avgCpuPercent)} (Eng yuqori: ${pct(peak?.cpuPercent ?? 0)})` : "—"}
          pctValue={peak?.cpuPercent ?? 0}
          colorClass="bg-action"
        />
        <Usage
          label={`RAM xotira bandligi (${formatCount(current.memoryUsedMb)} MB / ${formatCount(current.memoryTotalMb)} MB)`}
          value={pct(current.memoryPercent)}
          pctValue={current.memoryPercent}
          colorClass="bg-plan-demo"
        />
      </div>
    </Panel>
  );
}
