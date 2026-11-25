import { PLAN_TITLE, limitLabels, priceLabel, type Plan } from "@/entities/plan";
import { formatCount, formatUsd } from "@/shared/lib/format";
import { Panel } from "@/shared/ui/panel";

function ofCapacity(used: number, perTeacher: number | null, teachers: number) {
  return perTeacher == null ? formatCount(used) : `${formatCount(used)} / ${formatCount(perTeacher * teachers)}`;
}

function kpis(plan: Plan): Array<{ label: string; value: string }> {
  const { stats, limits } = plan;
  const isDemo = plan.id === "demo";
  return [
    { label: isDemo ? "Demo o‘qituvchilar" : "O‘qituvchilar", value: `${stats.teacherCount} ta` },
    { label: isDemo ? "Ochilgan guruhlar" : "Faol guruhlar", value: ofCapacity(stats.activeGroups, limits.maxGroups, stats.teacherCount) },
    { label: "Jami studentlar", value: ofCapacity(stats.students, limits.maxStudents, stats.teacherCount) },
    { label: "O‘tilgan soatlar", value: `${formatCount(stats.hoursTaught)} soat` },
    isDemo
      ? { label: "To‘lovga o‘tish", value: stats.conversionRate != null ? `${stats.conversionRate}%` : "—" }
      : { label: "Oylik tushum", value: `${formatUsd(stats.revenueMonthly)} / oy` },
  ];
}

export function PlanHeader({ plan }: { plan: Plan }) {
  return (
    <Panel>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5.5 py-4.5">
        <span
          aria-hidden="true"
          className="grid size-[42px] place-items-center rounded-lg border border-line bg-surface text-base font-semibold text-ink-strong shadow-xs"
        >
          {plan.name[0]}
        </span>
        <div className="flex items-baseline gap-2">
          <h1 className="text-xl font-medium text-ink">{PLAN_TITLE[plan.id]}</h1>
          <span className="text-caption text-ink">{priceLabel(plan)}</span>
        </div>
        <ul className="ml-auto flex flex-wrap gap-2.5 text-caption text-ink" aria-label="Limitlar">
          {limitLabels(plan.id, plan.limits).map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      </div>
      <dl className="grid grid-cols-2 border-t border-line sm:grid-cols-3 xl:grid-cols-5">
        {kpis(plan).map((kpi) => (
          <div key={kpi.label} className="flex flex-col gap-px border-line px-5.5 pt-[15px] pb-[13px] not-first:border-l">
            <dt className="text-caption text-ink">{kpi.label}</dt>
            <dd className="text-numeric-sm text-ink">{kpi.value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
