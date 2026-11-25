import { cn } from "@/shared/lib/cn";

/** Thin meter. `value` is 0–100; the label is required for screen readers. */
export function ProgressBar({
  value,
  label,
  colorClass,
  className,
}: {
  value: number;
  label: string;
  colorClass: string;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className={cn("h-1 overflow-hidden rounded-full bg-track", className)}
    >
      <div className={cn("h-full rounded-full transition-[width] duration-300", colorClass)} style={{ width: `${clamped}%` }} />
    </div>
  );
}
