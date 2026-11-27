"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useComplaints } from "@/entities/complaint";
import { useTeacherRoster } from "@/entities/plan";
import { useSupportTickets } from "@/entities/support";
import { NAV_ITEMS, SYSTEM_HEALTH_HREF, findNavItem } from "@/shared/config/navigation";
import { cn } from "@/shared/lib/cn";

/** Reads the URL; render inside <Suspense> (see SidebarFallback). */
export function Sidebar() {
  return <SidebarView pathname={usePathname()} />;
}

/** Same sidebar without an active item, for the prerendered shell. */
export function SidebarFallback() {
  return <SidebarView pathname={null} />;
}

/** Live counters: pending sign-ups, open support tickets and new complaints. */
const TEACHERS_HREF = "/oqituvchilar";
const SUPPORT_HREF = "/murojaatlar";
const COMPLAINTS_HREF = "/shikoyatlar";

function SidebarView({ pathname }: { pathname: string | null }) {
  const pending = useTeacherRoster("default").data?.applicants.length;
  const openTickets = useSupportTickets("default").data?.filter((t) => t.status === "open").length;
  const newComplaints = useComplaints("default").data?.filter((c) => c.status === "new").length;
  const live: Record<string, number | undefined> = {
    [TEACHERS_HREF]: pending,
    [SUPPORT_HREF]: openTickets,
    [COMPLAINTS_HREF]: newComplaints,
  };


  return (
    <aside className="sticky top-0 flex h-dvh w-(--layout-sidebar) shrink-0 flex-col border-r border-line bg-elevated px-4 pt-5 pb-5">
      <Link href="/" className="flex items-center gap-2.5 px-1.5">
        <span className="grid size-7 place-items-center rounded-md bg-action text-label font-semibold text-ink-inverse">
          Y
        </span>
        <span className="text-title text-ink-strong">YolUp Admin</span>
      </Link>

      <nav aria-label="Asosiy menyu" className="mt-6 flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname != null && findNavItem(pathname)?.href === href;
          const count = live[href];
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-[34px] items-center gap-3 rounded-md px-2.5 text-body transition-colors",
                active
                  ? "bg-action-subtle font-medium text-brand"
                  : "text-ink-secondary hover:bg-subtle hover:text-ink"
              )}
            >
              <Icon className={cn("size-4 shrink-0", active ? "text-brand" : "text-ink-tertiary")} strokeWidth={1.75} />
              <span className="min-w-0 flex-1 truncate">{label}</span>
              {count ? (
                <span
                  className={cn("text-caption", active ? "font-semibold text-brand" : "text-ink-muted")}
                  aria-label={`${count} ta yangi`}
                >
                  {count}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <Link
        href={SYSTEM_HEALTH_HREF}
        className="mt-auto flex items-center gap-2 self-start rounded-xs px-1.5 text-caption text-ink-tertiary hover:text-ink"
      >
        <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
        Tizim barqaror
      </Link>
    </aside>
  );
}
