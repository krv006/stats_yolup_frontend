"use client";

import { cn } from "@/shared/lib/cn";

/** On/off toggle (role="switch"); the visible label is passed as `label`. */
export function Switch({
  checked,
  onChange,
  label,
  disabled,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-[21px] w-9 shrink-0 items-center rounded-full border transition-colors outline-none",
        "focus-visible:ring-3 focus-visible:ring-ring/40 disabled:opacity-60",
        checked ? "border-action bg-action" : "border-line bg-track",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-[15px] rounded-full bg-elevated shadow-xs transition-transform",
          checked ? "translate-x-[17px]" : "translate-x-[2px]"
        )}
      />
    </button>
  );
}
