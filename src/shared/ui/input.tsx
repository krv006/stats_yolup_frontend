import { Search } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

const FIELD_CLASS =
  "rounded-md border border-line bg-surface text-body text-ink outline-none placeholder:text-ink-secondary " +
  "focus-within:border-action focus-within:ring-3 focus-within:ring-ring/20 aria-invalid:border-danger";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(FIELD_CLASS, "h-9 w-full px-3", className)} {...props} />;
}

export function SearchInput({ className, label, ...props }: ComponentProps<"input"> & { label: string }) {
  return (
    <label className={cn(FIELD_CLASS, "flex h-[34px] items-center gap-2 px-3", className)}>
      <Search className="size-3.5 shrink-0 text-ink-secondary" aria-hidden="true" />
      <span className="sr-only">{label}</span>
      <input type="search" className="min-w-0 flex-1 bg-transparent text-caption outline-none placeholder:text-ink" {...props} />
    </label>
  );
}

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-caption text-ink">{label}</span>
      {children}
      {error ? (
        <span role="alert" className="text-caption text-danger-fg">{error}</span>
      ) : hint ? (
        <span className="text-caption text-ink-secondary">{hint}</span>
      ) : null}
    </label>
  );
}
