import { Video } from "lucide-react";
import type { TeacherActivity, TeacherLesson } from "@/entities/plan";
import { formatDate } from "@/shared/lib/format";
import { Panel } from "@/shared/ui/panel";

const ACTIVITY_LABEL: Record<TeacherActivity, string> = {
  high: "Yuqori faollik",
  medium: "O‘rtacha faollik",
  low: "Past faollik",
};

function when(startsAt: string) {
  const [date = "", time = ""] = startsAt.split("T");
  return `${formatDate(date)}, ${time}`;
}

export function DemoLessonsPanel({ lessons, activity }: { lessons: TeacherLesson[]; activity: TeacherActivity | null }) {
  return (
    <Panel className="px-5 pt-4 pb-[9px]">
      <header className="mb-1 flex items-center justify-between gap-3">
        <h2 className="text-title text-ink">Demo davomida o‘tilgan darslar ({lessons.length})</h2>
        {activity ? <span className="text-caption font-medium text-ink">{ACTIVITY_LABEL[activity]}</span> : null}
      </header>
      {lessons.length ? (
        <ol>
          {lessons.map((lesson) => (
            <li key={lesson.id} className="flex items-center gap-4 border-t border-line-subtle pt-[14px] pb-[13px] pl-2">
              <Video className="size-3.5 shrink-0 text-plan-demo" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-body font-medium text-ink">{lesson.title}</p>
                <p className="text-caption text-ink-secondary">
                  {when(lesson.startsAt)}
                  <span className="px-1.5" aria-hidden="true">|</span>
                  {lesson.durationMinutes} daqiqa
                </p>
              </div>
              <span className="shrink-0 text-caption text-ink">
                {lesson.attended} / {lesson.enrolled} qatnashdi
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="border-t border-line-subtle py-8 text-center text-body text-ink-secondary">Hali dars o‘tilmagan.</p>
      )}
    </Panel>
  );
}
