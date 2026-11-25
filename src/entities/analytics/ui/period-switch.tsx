"use client";

import { cn } from "@/shared/lib/cn";
import type { DashboardPeriod } from "../model/types";

const PERIODS: Array<{ value: DashboardPeriod; label: string }> = [
  { value: "day", label: "Kun" },
  { value: "week", label: "Hafta" },
  { value: "month", label: "Oy" },
  { value: "year", label: "Yil" },
];

export function PeriodSwitch({
  value,
  onChange,
}: {
  value: DashboardPeriod;
  onChange: (period: DashboardPeriod) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Davr" className="flex gap-1.5 rounded-lg bg-track px-1 py-[3px]">
      {PERIODS.map((period) => {
        const active = period.value === value;
        return (
          <button
            key={period.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(period.value)}
            className={cn(
              "h-[30px] rounded-md px-3.5 text-body transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
              active ? "bg-surface font-semibold text-ink shadow-xs" : "font-medium text-ink-secondary hover:text-ink"
            )}
          >
            {period.label}
          </button>
        );
      })}
    </div>
  );
}
