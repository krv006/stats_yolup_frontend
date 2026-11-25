import Link from "next/link";
import { PLAN_DOT, type Plan, type PlanId } from "@/entities/plan";
import { cn } from "@/shared/lib/cn";

export function PlanTabs({ plans, active }: { plans: Plan[]; active: PlanId }) {
  const total = plans.reduce((acc, p) => acc + p.stats.teacherCount, 0);
  const tabs = [
    { href: "/tariflar", label: "Barcha tariflar", count: total, dot: null, current: false },
    ...plans.map((p) => ({
      href: `/tariflar/${p.id}`,
      label: p.name,
      count: p.stats.teacherCount,
      dot: PLAN_DOT[p.id],
      current: p.id === active,
    })),
  ];

  return (
    <nav aria-label="Tariflar" className="flex flex-wrap gap-[3px] rounded-lg bg-track p-[3px]">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={tab.current ? "page" : undefined}
          className={cn(
            "flex h-[30px] items-center gap-2 rounded-md px-[13px] text-body transition-colors",
            tab.current ? "bg-surface font-medium text-ink shadow-xs" : "text-ink-secondary hover:text-ink"
          )}
        >
          {tab.dot ? <span className={cn("size-[7px] rounded-full", tab.dot)} aria-hidden="true" /> : null}
          {tab.label}
          <span className="font-normal text-ink-tertiary">{tab.count}</span>
        </Link>
      ))}
    </nav>
  );
}
