import { Clock } from "lucide-react";
import type { ReactNode } from "react";
import {
  LEAD_SOURCE_DETAIL,
  PLAN_DOT,
  priceLabel,
  type Plan,
  type TeacherDetail,
  type TeacherGroup,
} from "@/entities/plan";
import { formatDate, formatUsd } from "@/shared/lib/format";
import { Panel } from "@/shared/ui/panel";
import { ProgressBar } from "@/shared/ui/progress-bar";

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-caption">
      <dt className="text-ink-secondary">{label}</dt>
      <dd className="text-right font-semibold text-ink">{value}</dd>
    </div>
  );
}

export function TrialCard({
  detail,
  recommendedPlan,
  action,
}: {
  detail: TeacherDetail;
  recommendedPlan: Plan | undefined;
  action: ReactNode;
}) {
  const trial = detail.trial!;
  const { maxGroups, maxStudents } = detail.plan.limits;
  const pct = trial.totalDays ? (Math.min(trial.usedDays, trial.totalDays) / trial.totalDays) * 100 : 0;

  return (
    <Panel className="px-[18px] pt-[17px] pb-[18px]">
      <header className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-title text-ink">
          <Clock className="size-3.5 text-plan-demo" aria-hidden="true" />
          Demo sinov muddati
        </h2>
        <span className="text-caption font-medium text-ink">
          {Math.min(trial.usedDays, trial.totalDays)} / {trial.totalDays} kun
        </span>
      </header>
      <ProgressBar value={pct} label="Sinov muddati" colorClass="bg-plan-demo" className="mt-[14px] h-[7px]" />
      <div className="mt-1.5 flex items-center justify-between text-caption">
        <span className="text-ink-secondary">Boshlandi: {formatDate(trial.startedAt)}</span>
        <span className="font-semibold text-ink">Tugaydi: {formatDate(trial.endsAt)}</span>
      </div>

      <dl className="mt-[23px] flex flex-col gap-2 px-3">
        <Row label="Kelish manbasi" value={LEAD_SOURCE_DETAIL[detail.source]} />
        {recommendedPlan ? (
          <Row label="Tavsiya etiladigan tarif" value={`${recommendedPlan.name} (${priceLabel(recommendedPlan)})`} />
        ) : null}
        <Row
          label="Demo cheklovi"
          value={`${maxGroups ?? "∞"} guruh, ${maxStudents ?? "∞"} student`}
        />
      </dl>

      <p className="mt-[23px] text-caption leading-[17px] text-ink-secondary">
        Muddat tugagach yangi dars ochilmaydi, lekin o‘qituvchining guruhi va {detail.teacher.students} ta studenti
        saqlanib qoladi.
      </p>
      <div className="mt-[15px]">{action}</div>
    </Panel>
  );
}

export function SubscriptionCard({ detail }: { detail: TeacherDetail }) {
  const sub = detail.subscription!;
  return (
    <Panel className="px-[18px] pt-[17px] pb-[15px]">
      <h2 className="text-title text-ink">Obuna va to‘lov ma’lumotlari</h2>
      <dl className="mt-[10px] flex flex-col gap-3">
        <Row label="Joriy tarif" value={`${detail.plan.name} (${priceLabel(detail.plan)})`} />
        <Row label="Faollashgan sana" value={formatDate(sub.activatedAt)} />
        <Row
          label="Keyingi to‘lov"
          value={sub.daysLeft > 0 ? `${formatDate(sub.paidUntil)} (${sub.daysLeft} kun)` : `${formatDate(sub.paidUntil)} (kechikdi)`}
        />
        <Row label="Kelish manbasi" value={LEAD_SOURCE_DETAIL[detail.source]} />
        <Row label="Umumiy to‘lovlar" value={`${formatUsd(sub.totalPaid)} (${sub.monthsPaid} oy)`} />
      </dl>
    </Panel>
  );
}

export function HoursDistribution({ groups, planId }: { groups: TeacherGroup[]; planId: Plan["id"] }) {
  const max = Math.max(1, ...groups.map((g) => g.hoursTaught));
  return (
    <Panel className="px-[18px] pt-[15px] pb-[17px]">
      <h2 className="text-title text-ink">Dars soatlari taqsimoti</h2>
      <ul className="mt-[11px] flex flex-col gap-[11px]">
        {groups.map((g) => (
          <li key={g.id}>
            <div className="flex items-center justify-between gap-3 text-caption">
              <span className="truncate text-ink">{g.name}</span>
              <span className="shrink-0 font-semibold text-ink">{g.hoursTaught} soat</span>
            </div>
            <ProgressBar
              value={(g.hoursTaught / max) * 100}
              label={`${g.name}: ${g.hoursTaught} soat`}
              colorClass={PLAN_DOT[planId]}
              className="mt-1.5 h-[5px]"
            />
          </li>
        ))}
      </ul>
    </Panel>
  );
}
