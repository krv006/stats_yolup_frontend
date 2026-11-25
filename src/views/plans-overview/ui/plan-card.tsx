import { ChevronRight, Plus, Sparkle } from "lucide-react";
import Link from "next/link";
import { CAPACITY_WARN_PCT, PLAN_DOT, capacityPct, priceLabel, type Plan } from "@/entities/plan";
import { cn } from "@/shared/lib/cn";
import { formatCount, formatUsd } from "@/shared/lib/format";
import { Button, buttonVariants } from "@/shared/ui/button";
import { Panel } from "@/shared/ui/panel";
import { ProgressBar } from "@/shared/ui/progress-bar";

export type PlanCardMode = "overview" | "settings";

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col">
      <dt className="text-caption text-ink-secondary">{label}</dt>
      <dd className="text-title leading-[18px] font-medium text-ink">{formatCount(value)}</dd>
    </div>
  );
}

function Meter({ label, value, pct, colorClass }: { label: string; value: string; pct: number; colorClass: string }) {
  return (
    <div className="mt-[27px]">
      <div className="flex items-center justify-between gap-2 text-caption text-ink-secondary">
        <span>{label}</span>
        <span className="font-semibold text-ink">{value}</span>
      </div>
      <ProgressBar value={pct} label={`${label}: ${value}`} colorClass={colorClass} className="mt-1.5 h-1.5" />
    </div>
  );
}

export function PlanCard({
  plan,
  mode,
  dirty = false,
  onEdit,
  onNewDemo,
}: {
  plan: Plan;
  mode: PlanCardMode;
  /** Has unsaved edits (settings mode). */
  dirty?: boolean;
  onEdit?: () => void;
  onNewDemo?: () => void;
}) {
  const { stats, limits } = plan;
  const isDemo = plan.id === "demo";
  const studentPct = capacityPct(stats.students, limits.maxStudents, stats.teacherCount);
  const trialPct = stats.teacherCount ? Math.round((stats.activeTrials / stats.teacherCount) * 100) : 0;

  const primaryAction =
    mode === "settings" ? (
      <Button variant="secondary" size="xs" className="flex-1" onClick={onEdit}>
        Limitni tahrirlash <ChevronRight className="size-3.5" />
      </Button>
    ) : (
      <Link href={`/tariflar/${plan.id}`} className={cn(buttonVariants({ variant: "secondary", size: "xs" }), "flex-1")}>
        {isDemo ? "Ko‘rish" : "Ro‘yxatni ko‘rish"} <ChevronRight className="size-3.5" />
      </Link>
    );

  return (
    <Panel
      aria-label={`${plan.name} tarifi`}
      className={cn(
        "flex flex-col px-4.5 pt-4.5 pb-4 transition-shadow hover:shadow-sm",
        dirty && "border-action ring-1 ring-action"
      )}
    >
      <header className="flex items-center gap-2">
        <span className={cn("size-2 rounded-full", PLAN_DOT[plan.id])} aria-hidden="true" />
        <h3 className="flex-1 text-title text-ink">{plan.name}</h3>
        <span className="text-caption text-ink">{priceLabel(plan)}</span>
      </header>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-numeric-lg text-ink">{stats.teacherCount}</span>
        <span className="flex-1 text-body text-ink-secondary">o‘qituvchi</span>
        <span className="text-label font-semibold text-ink">
          {isDemo ? `${stats.activeTrials} ta faol` : `${formatUsd(stats.revenueMonthly)} / oy`}
        </span>
      </div>

      <dl className="mt-[21px] grid grid-cols-3 pl-3">
        <Stat label="Guruh" value={stats.activeGroups} />
        <Stat label="Student" value={stats.students} />
        <Stat label="Soat" value={stats.hoursTaught} />
      </dl>

      {isDemo ? (
        <Meter
          label="Faol sinovdagilar"
          value={`${stats.activeTrials} / ${stats.teacherCount} faol`}
          pct={trialPct}
          colorClass="bg-plan-demo"
        />
      ) : studentPct != null ? (
        <Meter
          label="Student sig‘imi"
          value={`${stats.students} / ${(limits.maxStudents ?? 0) * stats.teacherCount} (${studentPct}%)`}
          pct={studentPct}
          colorClass={studentPct >= CAPACITY_WARN_PCT ? "bg-warning" : PLAN_DOT[plan.id]}
        />
      ) : (
        <p className="mt-[33px] mb-1.5 flex items-center gap-2 px-3 text-caption text-ink">
          <Sparkle className="size-3.5" aria-hidden="true" />
          Maxsus limit (cheklovsiz)
        </p>
      )}

      <div className="flex items-center gap-2 pt-3.5">
        {primaryAction}
        {isDemo ? (
          <Button className="gap-1 px-3.5" onClick={onNewDemo}>
            <Plus className="size-3.5" /> Demo
          </Button>
        ) : null}
      </div>
    </Panel>
  );
}
