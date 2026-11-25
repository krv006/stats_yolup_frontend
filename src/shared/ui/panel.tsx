import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

/** The white bordered card every dashboard block sits on. */
export function Panel({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn("min-w-0 rounded-xl border border-line bg-surface shadow-xs", className)}
      {...props}
    />
  );
}

export function PanelHeader({ title, aside, className }: { title: ReactNode; aside?: ReactNode; className?: string }) {
  return (
    <header className={cn("flex items-center justify-between gap-4", className)}>
      <h2 className="text-title leading-4 text-ink">{title}</h2>
      {aside}
    </header>
  );
}
