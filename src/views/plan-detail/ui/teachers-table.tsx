"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { CAPACITY_WARN_PCT, PLAN_DOT, capacityPct, type Plan, type PlanTeacher } from "@/entities/plan";
import { cn } from "@/shared/lib/cn";
import { daysUntil, formatDate, formatPhone } from "@/shared/lib/format";
import { InitialsAvatar } from "@/shared/ui/avatar";
import { Button, buttonVariants } from "@/shared/ui/button";
import { ProgressBar } from "@/shared/ui/progress-bar";

const TH = "h-[38px] px-3 text-left text-body font-normal whitespace-nowrap text-ink-secondary first:pl-5 last:pr-5";
const TD = "h-[63px] px-3 align-middle first:pl-5 last:pr-5";

/** Name or phone digits, case-insensitive. */
export function matchesQuery(teacher: PlanTeacher, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const digits = q.replace(/\D/g, "");
  return teacher.name.toLowerCase().includes(q) || (digits.length > 0 && teacher.phone.includes(digits));
}

const teacherHref = (t: PlanTeacher) => `/tariflar/${t.planId}/${encodeURIComponent(t.id)}`;

function TeacherCell({ teacher }: { teacher: PlanTeacher }) {
  return (
    <div className="flex items-center gap-3">
      <InitialsAvatar name={teacher.name} size="lg" />
      <div className="min-w-0">
        <Link
          href={teacherHref(teacher)}
          className="block truncate text-[14px] leading-5 font-medium text-ink hover:text-brand"
        >
          {teacher.name}
        </Link>
        <p className="truncate text-caption text-ink">{teacher.subject}</p>
      </div>
    </div>
  );
}

function CapacityCell({
  used,
  limit,
  aside,
  colorClass,
  size = "wide",
}: {
  used: number;
  limit: number | null;
  aside?: string;
  colorClass: (pct: number) => string;
  size?: "wide" | "compact";
}) {
  const lineWidth = size === "wide" ? "w-50" : "w-46";
  const barWidth = size === "wide" ? "w-45" : "w-[165px]";
  const pct = capacityPct(used, limit);
  if (pct == null) {
    return (
      <div className="w-45">
        <p className="text-caption font-semibold text-ink">{used} student</p>
        <p className="text-caption text-ink-secondary">Cheklanmagan</p>
      </div>
    );
  }
  return (
    <div className={lineWidth}>
      <div className="flex items-center justify-between text-caption text-ink">
        <span className="font-semibold">
          {used} / {limit}
        </span>
        <span>{aside ?? `${pct}%`}</span>
      </div>
      <ProgressBar value={pct} label={`Student sig‘imi: ${used} / ${limit}`} colorClass={colorClass(pct)} className={cn("mt-1.5", barWidth)} />
    </div>
  );
}

/** Fixed column widths (px) measured from the design; the last column takes the rest. */
function ColumnWidths({ widths }: { widths: number[] }) {
  return (
    <colgroup>
      {widths.map((width, i) => (
        <col key={i} style={{ width }} />
      ))}
      <col />
    </colgroup>
  );
}

function TwoLine({ top, bottom }: { top: string; bottom: string }) {
  return (
    <div>
      <p className="text-body font-semibold whitespace-nowrap text-ink">{top}</p>
      <p className="text-caption whitespace-nowrap text-ink">{bottom}</p>
    </div>
  );
}

function StatusDot({ tone, children }: { tone: string | null; children: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 text-caption font-medium whitespace-nowrap text-ink">
      {tone ? <span className={cn("size-1.5 rounded-full", tone)} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

function GroupsLink({ teacher }: { teacher: PlanTeacher }) {
  return (
    <Link
      href={teacherHref(teacher)}
      className={cn(buttonVariants({ variant: "secondary", size: "xs" }), "gap-1.5")}
    >
      Guruhlar <ChevronRight className="size-3" />
    </Link>
  );
}

function EmptyRow({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-10 text-center text-body text-ink-secondary">
        Qidiruv bo‘yicha hech kim topilmadi.
      </td>
    </tr>
  );
}

function paymentTone(activeUntil: string) {
  const left = daysUntil(activeUntil);
  if (left < 0) return "bg-danger";
  return left <= 7 ? "bg-warning" : "bg-success";
}

export function PaidTeachersTable({ plan, teachers }: { plan: Plan; teachers: PlanTeacher[] }) {
  const { maxGroups, maxStudents } = plan.limits;
  return (
    <table className="w-full min-w-275 table-fixed border-collapse">
      <caption className="sr-only">{plan.name} tarifidagi o‘qituvchilar</caption>
      <ColumnWidths widths={[210, 161, 111, 217, 136, 176]} />
      <thead className="border-y border-line">
        <tr>
          <th scope="col" className={TH}>O‘qituvchi</th>
          <th scope="col" className={TH}>Telefon</th>
          <th scope="col" className={TH}>Guruhlar</th>
          <th scope="col" className={TH}>Student sig‘imi</th>
          <th scope="col" className={TH}>Dars soati</th>
          <th scope="col" className={TH}>Faol muddat</th>
          <th scope="col" className={TH}><span className="sr-only">Amallar</span></th>
        </tr>
      </thead>
      <tbody>
        {teachers.map((t) => (
          <tr key={t.id} className="border-b border-line-subtle last:border-0">
            <td className={TD}><TeacherCell teacher={t} /></td>
            <td className={cn(TD, "text-caption whitespace-nowrap text-ink")}>{formatPhone(t.phone)}</td>
            <td className={cn(TD, "text-body font-semibold text-ink")}>
              {maxGroups != null ? `${t.groups} / ${maxGroups}` : t.groups}
            </td>
            <td className={TD}>
              <CapacityCell
                used={t.students}
                limit={maxStudents}
                colorClass={(pct) => (pct >= CAPACITY_WARN_PCT ? "bg-warning" : PLAN_DOT[plan.id])}
              />
            </td>
            <td className={TD}><TwoLine top={`${t.hoursTaught} soat`} bottom={`${t.lessonsCount} ta dars`} /></td>
            <td className={TD}>
              {t.activeUntil ? (
                <StatusDot tone={paymentTone(t.activeUntil)}>{formatDate(t.activeUntil)} gacha</StatusDot>
              ) : (
                "—"
              )}
            </td>
            <td className={cn(TD, "text-right")}><GroupsLink teacher={t} /></td>
          </tr>
        ))}
        {teachers.length === 0 ? <EmptyRow colSpan={7} /> : null}
      </tbody>
    </table>
  );
}

function trialStatus(daysLeft: number | null) {
  const left = daysLeft ?? 0;
  if (left <= 0) return { tone: null, label: "Muddati tugagan" };
  return { tone: left <= 2 ? "bg-danger" : "bg-plan-demo", label: `${left} kun qoldi` };
}

export function DemoTeachersTable({
  plan,
  teachers,
  onConvert,
}: {
  plan: Plan;
  teachers: PlanTeacher[];
  onConvert: (teacher: PlanTeacher) => void;
}) {
  return (
    <table className="w-full min-w-275 table-fixed border-collapse">
      <caption className="sr-only">Demo o‘qituvchilar</caption>
      <ColumnWidths widths={[241, 156, 201, 122, 160]} />
      <thead className="border-y border-line">
        <tr>
          <th scope="col" className={TH}>O‘qituvchi</th>
          <th scope="col" className={TH}>Telefon</th>
          <th scope="col" className={TH}>Student sig‘imi</th>
          <th scope="col" className={TH}>O‘tilgan</th>
          <th scope="col" className={TH}>Demo muddati</th>
          <th scope="col" className={TH}>Amallar</th>
        </tr>
      </thead>
      <tbody>
        {teachers.map((t) => {
          const status = trialStatus(t.trialDaysLeft);
          const expired = status.tone == null;
          return (
            <tr key={t.id} className="border-b border-line-subtle last:border-0">
              <td className={TD}><TeacherCell teacher={t} /></td>
              <td className={cn(TD, "text-caption whitespace-nowrap text-ink")}>{formatPhone(t.phone)}</td>
              <td className={TD}>
                <CapacityCell
                  used={t.students}
                  limit={plan.limits.maxStudents}
                  aside={`${t.groups} guruh`}
                  size="compact"
                  colorClass={(pct) =>
                    expired ? "bg-ink-tertiary" : pct >= CAPACITY_WARN_PCT ? "bg-warning" : "bg-plan-demo"
                  }
                />
              </td>
              <td className={TD}><TwoLine top={`${t.hoursTaught} soat`} bottom={`${t.lessonsCount} ta dars`} /></td>
              <td className={TD}><StatusDot tone={status.tone}>{status.label}</StatusDot></td>
              <td className={TD}>
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" size="xs" className="px-3" onClick={() => onConvert(t)}>
                    Tarifga o‘tkazish
                  </Button>
                  <GroupsLink teacher={t} />
                </div>
              </td>
            </tr>
          );
        })}
        {teachers.length === 0 ? <EmptyRow colSpan={6} /> : null}
      </tbody>
    </table>
  );
}
