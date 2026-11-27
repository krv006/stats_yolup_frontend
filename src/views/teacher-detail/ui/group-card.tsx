import { CalendarDays } from "lucide-react";
import { CAPACITY_WARN_PCT, PLAN_DOT, type PlanId, type TeacherGroup } from "@/entities/plan";
import { cn } from "@/shared/lib/cn";
import { formatDayMonth } from "@/shared/lib/format";
import { Panel } from "@/shared/ui/panel";
import { ProgressBar } from "@/shared/ui/progress-bar";

/** Few seats left gets a warning dot. */
const LOW_SEATS = 3;

function Seats({ group }: { group: TeacherGroup }) {
  if (group.capacity == null) return <span className="text-caption text-ink">Cheklanmagan</span>;
  const free = Math.max(0, group.capacity - group.students);
  const tone = free === 0 ? "bg-danger" : free <= LOW_SEATS ? "bg-warning" : null;
  return (
    <span className="flex items-center gap-1.5 text-caption font-medium text-ink">
      {tone ? <span className={cn("size-1.5 rounded-full", tone)} aria-hidden="true" /> : null}
      {free === 0 ? "Joy yo‘q" : `${free} joy bo‘sh`}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-caption text-ink-secondary">{label}</dt>
      <dd className="text-body leading-4 font-semibold text-ink">{value}</dd>
    </div>
  );
}

export function GroupCard({ group, planId }: { group: TeacherGroup; planId: PlanId }) {
  const pct = group.capacity ? Math.round((group.students / group.capacity) * 100) : null;
  return (
    <Panel className="px-4 pt-[15px] pb-[21px]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="truncate text-title font-semibold text-ink">{group.name}</h3>
        <Seats group={group} />
      </div>
      <p className="mt-[3px] flex items-center gap-1.5 text-caption text-ink-secondary">
        <CalendarDays className="size-3" aria-hidden="true" />
        {group.schedule}
      </p>
      <div className="mt-[10px] flex items-center justify-between text-caption">
        <span className="text-ink-secondary">Studentlar bandligi</span>
        <span className="font-semibold text-ink">
          {group.students}
          {group.capacity != null ? ` / ${group.capacity}` : null}
        </span>
      </div>
      {pct != null ? (
        <ProgressBar
          value={pct}
          label={`${group.name}: ${group.students} / ${group.capacity}`}
          colorClass={pct >= CAPACITY_WARN_PCT ? "bg-warning" : PLAN_DOT[planId]}
          className="mt-1.5 h-1.5"
        />
      ) : null}
      <dl className="mt-5 grid grid-cols-3 pl-2.5">
        <Stat label="O‘tilgan" value={`${group.hoursTaught} soat`} />
        <Stat label="Darslar" value={`${group.lessonsCount} ta`} />
        <Stat label="Oxirgi dars" value={group.lastLessonAt ? formatDayMonth(group.lastLessonAt) : "—"} />
      </dl>
    </Panel>
  );
}
