import { Video } from "lucide-react";
import type { TeacherVideoStats } from "@/entities/system";
import { Panel } from "@/shared/ui/panel";
import { ProgressBar } from "@/shared/ui/progress-bar";

export function VideoPanel({ data }: { data: TeacherVideoStats }) {
  const max = Math.max(1, ...data.teachers.map((t) => t.videoCount));
  return (
    <Panel className="px-5 pt-[17px] pb-2">
      <header className="mb-1.5 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-ink">Video yozuvlar</h2>
        <span className="text-caption text-ink">Jami {data.totalVideos} ta</span>
      </header>
      <ul>
        {data.teachers.map((t) => (
          <li key={t.teacherId} className="border-line-subtle pt-[13px] pb-4 not-first:border-t">
            <div className="flex items-center justify-between gap-3 text-body">
              <span className="flex min-w-0 items-center gap-2 font-medium text-ink">
                <Video className="size-3.5 shrink-0 text-action" aria-hidden="true" />
                <span className="truncate">{t.teacherName}</span>
              </span>
              <span className="shrink-0 text-caption font-semibold text-ink">
                {t.videoCount} ta video ({t.sizeGb.toFixed(1)} GB)
              </span>
            </div>
            <ProgressBar
              value={(t.videoCount / max) * 100}
              label={`${t.teacherName}: ${t.videoCount} ta video`}
              colorClass="bg-action"
              className="mt-1.5 h-[5px]"
            />
          </li>
        ))}
      </ul>
    </Panel>
  );
}
