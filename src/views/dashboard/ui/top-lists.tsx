import { Star } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import type { TopCourseStat, TopTeacherStat } from "@/entities/analytics";
import { cn } from "@/shared/lib/cn";
import { formatRating } from "@/shared/lib/format";
import { InitialsAvatar } from "@/shared/ui/avatar";
import { Panel, PanelHeader } from "@/shared/ui/panel";

/** ≥90 good, ≥70 neutral, otherwise needs attention. */
function attendanceTone(value: number | null) {
  if (value == null) return "text-ink-secondary";
  if (value >= 90) return "font-semibold text-success-fg";
  if (value >= 70) return "font-semibold text-ink";
  return "font-semibold text-warning-fg";
}

/** Reliability only highlights the excellent (≥90); the rest stay quiet. */
function reliabilityTone(value: number | null) {
  return value != null && value >= 90 ? "font-medium text-success-fg" : "text-ink-secondary";
}

function Rating({ value }: { value: number | null }) {
  return (
    <span className="flex items-center gap-1 text-label text-ink">
      <Star className="size-[11px] fill-star text-star" aria-hidden="true" />
      <span className="sr-only">Reyting:</span>
      {formatRating(value)}
    </span>
  );
}

function Meta({ parts }: { parts: ReactNode[] }) {
  return (
    <p className="mt-0.5 truncate text-caption text-ink-secondary">
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 ? <span className="px-1.5 text-ink-secondary" aria-hidden="true">|</span> : null}
          {part}
        </Fragment>
      ))}
    </p>
  );
}

function Row({ lead, title, meta, trailing }: { lead: ReactNode; title: string; meta: ReactNode; trailing: ReactNode }) {
  return (
    <li className="flex items-center gap-2.5 border-t border-line-subtle pt-[9px] pb-[22px]">
      {lead}
      <div className="min-w-0 flex-1">
        <p className="truncate text-label text-ink">{title}</p>
        {meta}
      </div>
      <div className="flex shrink-0 items-center gap-2.5">{trailing}</div>
    </li>
  );
}

export function TopCoursesPanel({ courses }: { courses: TopCourseStat[] }) {
  return (
    <Panel className="px-5 pt-5 pb-1">
      <PanelHeader title="Top kurslar" className="mb-3.5" />
      <ol>
        {courses.map((course, index) => (
          <Row
            key={course.id}
            lead={<span className="w-6.5 shrink-0 pl-2.5 text-caption text-ink-tertiary">{index + 1}</span>}
            title={course.title}
            meta={<Meta parts={[course.teacherName, `${course.studentCount} o‘quvchi`]} />}
            trailing={
              <>
                <Rating value={course.avgRating} />
                <span className={cn("text-caption", attendanceTone(course.attendanceRate))}>
                  <span className="sr-only">Davomat: </span>
                  {course.attendanceRate != null ? `${course.attendanceRate}%` : "—"}
                </span>
              </>
            }
          />
        ))}
      </ol>
    </Panel>
  );
}

export function TopTeachersPanel({ teachers }: { teachers: TopTeacherStat[] }) {
  return (
    <Panel className="px-5 pt-5 pb-1">
      <PanelHeader title="Top o‘qituvchilar" className="mb-3.5" />
      <ol>
        {teachers.map((teacher) => (
          <Row
            key={teacher.id}
            lead={<InitialsAvatar name={teacher.name} />}
            title={teacher.name}
            meta={<Meta parts={[`${teacher.courseCount} kurs`, `${teacher.lessonsThisMonth} ta dars (bu oy)`]} />}
            trailing={
              <>
                <Rating value={teacher.avgRating} />
                <span className={cn("text-caption", reliabilityTone(teacher.reliability))}>
                  {teacher.reliability != null ? `${teacher.reliability}% faol` : "—"}
                </span>
              </>
            }
          />
        ))}
      </ol>
    </Panel>
  );
}
