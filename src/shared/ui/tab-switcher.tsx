"use client";

import { cn } from "@/shared/lib/cn";

export interface TabOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

/** Page-level segmented tabs (title row, right side). */
export function TabSwitcher<T extends string>({
  tabs,
  value,
  onChange,
  label,
  className,
}: {
  tabs: Array<TabOption<T>>;
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div role="tablist" aria-label={label} className={cn("flex gap-[3px] rounded-lg bg-track p-[5px]", className)}>
      {tabs.map((t) => (
        <button
          key={t.value}
          type="button"
          role="tab"
          aria-selected={t.value === value}
          onClick={() => onChange(t.value)}
          className={cn(
            "flex h-[29px] items-center gap-2 rounded-md px-3 text-body transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
            t.value === value ? "bg-surface font-semibold text-ink shadow-xs" : "text-ink hover:text-ink-strong"
          )}
        >
          {t.label}
          {t.count != null ? <span className="text-caption font-normal">{t.count}</span> : null}
        </button>
      ))}
    </div>
  );
}
