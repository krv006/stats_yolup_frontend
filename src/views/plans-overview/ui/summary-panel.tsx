import { PLAN_DOT, type Plan, type PlansOverview } from "@/entities/plan";
import { cn } from "@/shared/lib/cn";
import { formatCount, formatUsd } from "@/shared/lib/format";
import { Panel } from "@/shared/ui/panel";

function SummaryCell({ label, value, note, positive }: { label: string; value: string; note: string; positive?: boolean }) {
  return (
    <div className="flex flex-col gap-2 border-line px-5.5 pt-[18px] pb-[18px] not-first:border-l">
      <div className="flex items-start justify-between gap-3">
        <span className="text-body text-ink">{label}</span>
        <span className={cn("text-caption", positive ? "font-semibold text-success-fg" : "font-medium text-ink")}>{note}</span>
      </div>
      <span className="text-numeric-lg text-ink">{value}</span>
    </div>
  );
}

function ShareBar({ plans, total }: { plans: Plan[]; total: number }) {
  const pct = (count: number) => (total ? Math.round((count / total) * 100) : 0);
  const description = plans.map((p) => `${p.name} ${p.stats.teacherCount} (${pct(p.stats.teacherCount)}%)`).join(", ");

  return (
    <div className="flex flex-wrap items-center gap-y-2 border-t border-line px-5.5 py-[13px]">
      <span className="text-caption font-semibold text-ink">Tariflar ulushi</span>
      <div role="img" aria-label={`Tariflar ulushi: ${description}`} className="ml-3.5 flex h-1 w-115 max-w-full gap-0.75">
        {plans.map((p) =>
          p.stats.teacherCount > 0 ? (
            <span key={p.id} className={cn("rounded-full", PLAN_DOT[p.id])} style={{ flexGrow: p.stats.teacherCount }} />
          ) : null
        )}
      </div>
      <ul className="ml-auto flex flex-wrap items-center gap-x-4 gap-y-1">
        {plans.map((p) => (
          <li key={p.id} className="flex items-center gap-1.5 text-caption">
            <span className={cn("size-1.5 rounded-full", PLAN_DOT[p.id])} aria-hidden="true" />
            <span className="font-semibold text-ink">{p.name}</span>
            <span className="text-ink-secondary">
              {p.stats.teacherCount} ({pct(p.stats.teacherCount)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SummaryPanel({ overview }: { overview: PlansOverview }) {
  const { summary, plans } = overview;
  return (
    <Panel>
      <div className="grid grid-cols-2 xl:grid-cols-4">
        <SummaryCell
          label="Jami o‘qituvchilar"
          value={formatCount(summary.teachersTotal)}
          note={`+${summary.teachersDelta} bu oy`}
          positive={summary.teachersDelta > 0}
        />
        <SummaryCell label="Faol studentlar" value={formatCount(summary.activeStudents)} note={`${summary.capacityUsage}% sig‘im`} />
        <SummaryCell
          label="O‘tilgan dars soatlari"
          value={`${formatCount(summary.hoursTotal)} soat`}
          note={`~${summary.hoursPerMonth} soat / oy`}
        />
        <SummaryCell
          label="Oylik daromad (MRR)"
          value={formatUsd(summary.mrr)}
          note={`+${formatUsd(summary.mrrDelta)} o‘sish`}
          positive={summary.mrrDelta > 0}
        />
      </div>
      <ShareBar plans={plans} total={summary.teachersTotal} />
    </Panel>
  );
}
