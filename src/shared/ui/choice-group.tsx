"use client";

import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

export interface Choice<T extends string | number> {
  value: T;
  label: ReactNode;
}

const VARIANTS = {
  /** Equal columns; the selected one gets a quiet outline. */
  outline: {
    root: "grid auto-cols-fr grid-flow-col gap-1",
    item: "rounded-md border px-3 py-[7.5px] text-center",
    on: "border-line bg-surface shadow-xs",
    off: "border-transparent hover:bg-subtle",
  },
  /** Compact segmented control on a track (time ranges). */
  pill: {
    root: "inline-flex gap-0.5 rounded-md bg-track p-0.5",
    item: "h-[19px] rounded-[5px] px-1 text-caption",
    on: "bg-surface font-medium text-ink shadow-xs",
    off: "text-ink hover:bg-surface/60",
  },
  /** Content-width chips; the selected one is brand-tinted. */
  brand: {
    root: "flex flex-wrap gap-1",
    item: "h-[33px] rounded-lg border-[1.5px] px-3 text-body",
    on: "border-action bg-action-subtle font-medium text-ink",
    off: "border-transparent text-ink hover:bg-subtle",
  },
  /** Two-line option cards (title + hint); the selected one is brand-tinted. */
  card: {
    root: "grid auto-cols-fr grid-flow-col gap-2.5",
    item: "flex h-[58px] flex-col items-start justify-center rounded-lg border-[1.5px] px-[13px] text-left",
    on: "border-action bg-action-subtle",
    off: "border-transparent hover:bg-subtle",
  },
} as const;

/** Single-choice radio group rendered as buttons. */
export function ChoiceGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
  variant = "outline",
  className,
}: {
  label: string;
  options: Choice<T>[];
  value: T;
  onChange: (value: T) => void;
  variant?: keyof typeof VARIANTS;
  className?: string;
}) {
  const v = VARIANTS[variant];
  return (
    <div role="radiogroup" aria-label={label} className={cn(v.root, className)}>
      {options.map((option) => {
        const checked = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            onClick={() => onChange(option.value)}
            className={cn(
              "outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/40",
              v.item,
              checked ? v.on : v.off
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
