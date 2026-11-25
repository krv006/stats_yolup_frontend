import { cn } from "@/shared/lib/cn";
import { initials } from "@/shared/lib/format";

const SIZES = { sm: "size-8", md: "size-[34px]", lg: "size-9" } as const;

/** Initials disc — decorative; the name is always rendered next to it. */
export function InitialsAvatar({ name, size = "sm", className }: { name: string; size?: keyof typeof SIZES; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full border border-line bg-chip text-caption font-semibold text-ink",
        SIZES[size],
        className
      )}
    >
      {initials(name)}
    </span>
  );
}
