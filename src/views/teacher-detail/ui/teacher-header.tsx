import type { ReactNode } from "react";
import { priceLabel, type TeacherDetail } from "@/entities/plan";
import { cn } from "@/shared/lib/cn";
import { formatCount, formatDate, formatPhone } from "@/shared/lib/format";
import { InitialsAvatar } from "@/shared/ui/avatar";
import { Panel } from "@/shared/ui/panel";

function Dot({ className }: { className: string }) {
  return <span className={cn("size-1.5 rounded-full", className)} aria-hidden="true" />;
}

function Badges({ detail }: { detail: TeacherDetail }) {
  const { plan, trial, subscription } = detail;
  if (trial) {
    const left = trial.daysLeft;
    return (
      <>
        <span className="flex items-center gap-1.5"><Dot className="bg-plan-demo" />Demo sinov</span>
        <span className="flex items-center gap-1.5">
          <Dot className={left <= 0 || left <= 2 ? "bg-danger" : "bg-plan-demo"} />
          {left <= 0 ? "Muddati tugagan" : `${left} kun qoldi`}
        </span>
      </>
    );
  }
  return (
    <>
      <span className="font-normal">{plan.name} ({priceLabel(plan)})</span>
      {subscription ? (
        <span className="flex items-center gap-1.5">
          <Dot className={subscription.daysLeft <= 0 ? "bg-danger" : subscription.daysLeft <= 7 ? "bg-warning" : "bg-success"} />
          {subscription.daysLeft <= 0 ? "To‘lov kechikdi" : `Faol, ${formatDate(subscription.paidUntil)} gacha`}
        </span>
      ) : null}
    </>
  );
}

function capacity(used: number, perTeacher: number | null) {
  return perTeacher == null ? formatCount(used) : `${formatCount(used)} / ${formatCount(perTeacher)}`;
}

export function TeacherHeader({ detail, actions }: { detail: TeacherDetail; actions: ReactNode }) {
  const { teacher, plan } = detail;
  const isDemo = plan.id === "demo";
  const kpis = [
    { label: isDemo ? "Guruh sig‘imi" : "Guruhlar sig‘imi", value: capacity(teacher.groups, plan.limits.maxGroups) },
    { label: "Studentlar sig‘imi", value: capacity(teacher.students, plan.limits.maxStudents) },
    { label: "Dars soatlari", value: `${formatCount(teacher.hoursTaught)} soat` },
    { label: "O‘tilgan darslar", value: `${formatCount(teacher.lessonsCount)} ta` },
  ];

  return (
    <Panel>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-[22px] py-[17px]">
        <InitialsAvatar name={teacher.name} className="size-12 text-body" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <h1 className="text-xl font-semibold text-ink">{teacher.name}</h1>
            <div className="flex items-center gap-2.5 text-caption font-medium text-ink">
              <Badges detail={detail} />
            </div>
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-2.5 text-body text-ink-secondary">
            <span>{teacher.subject}</span>
            <span aria-hidden="true">|</span>
            <span>{formatPhone(teacher.phone)}</span>
            <span aria-hidden="true">|</span>
            <span>Qo‘shilgan: {formatDate(detail.joinedAt)}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
      <dl className="grid grid-cols-2 border-t border-line xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="flex flex-col gap-px border-line px-[22px] pt-[15px] pb-[13px] not-first:border-l">
            <dt className="text-caption text-ink">{kpi.label}</dt>
            <dd className="text-numeric-sm text-ink">{kpi.value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
