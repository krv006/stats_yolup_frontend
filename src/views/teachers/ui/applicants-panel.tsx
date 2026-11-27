"use client";

import { BarChart3, Clock } from "lucide-react";
import { ApproveButton } from "@/features/teacher-approve";
import type { TeacherApplicant } from "@/entities/plan";
import { formatDaysAgo } from "@/shared/lib/format";
import { InitialsAvatar } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Panel } from "@/shared/ui/panel";

/** "Bugun, 11:43" / "Kecha, 18:20" / "3 kun oldin, 09:10" */
function appliedLabel(appliedAt: string) {
  const [date = "", time = ""] = appliedAt.split("T");
  return `${formatDaysAgo(date)}, ${time.slice(0, 5)}`;
}

export function ApplicantsPanel({
  applicants,
  onAnalyze,
}: {
  applicants: TeacherApplicant[];
  onAnalyze: (id: string) => void;
}) {
  return (
    <Panel className="px-5 pt-4 pb-2">
      <header className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <Clock className="size-3.5 text-plan-demo" aria-hidden="true" />
        <h2 className="text-title text-ink">Tasdiqlanishi kerak bo‘lgan yangi o‘qituvchilar</h2>
        <span className="flex items-center gap-1.5 text-caption font-semibold text-ink">
          <span className="size-1.5 rounded-full bg-plan-demo" aria-hidden="true" />
          {applicants.length} ta yangi so‘rov
        </span>
      </header>
      <ul className="mt-1.5">
        {applicants.map((a) => (
          <li key={a.id} className="flex flex-wrap items-center gap-3 px-3.5 py-4">
            <InitialsAvatar name={a.name} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] leading-5 text-ink">
                <span className="font-semibold">{a.name}</span>
                <span className="ml-2 text-body">@{a.username}</span>
              </p>
              <p className="truncate text-caption text-ink">
                {a.subject}
                <span className="px-1.5" aria-hidden="true">|</span>
                Ariza yuborilgan: {appliedLabel(a.appliedAt)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="mr-0.5 flex items-center gap-1.5 text-caption font-semibold text-ink">
                <span className="size-1.5 rounded-full bg-plan-demo" aria-hidden="true" />
                Tekshiruvda
              </span>
              <Button variant="secondary" size="xs" className="gap-1.5 px-3" onClick={() => onAnalyze(a.id)}>
                <BarChart3 className="size-3" /> Tahlil
              </Button>
              <ApproveButton applicantId={a.id} />
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
