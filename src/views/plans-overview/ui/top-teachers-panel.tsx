import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PLAN_DOT, type Plan, type TopTeacher } from "@/entities/plan";
import { cn } from "@/shared/lib/cn";
import { InitialsAvatar } from "@/shared/ui/avatar";
import { Panel } from "@/shared/ui/panel";
import { ProgressBar } from "@/shared/ui/progress-bar";

export function TopTeachersPanel({ teachers, plans }: { teachers: TopTeacher[]; plans: Plan[] }) {
  const max = Math.max(1, ...teachers.map((t) => t.hoursTaught));
  const planName = (id: TopTeacher["planId"]) => plans.find((p) => p.id === id)?.name ?? id;

  return (
    <Panel className="px-5 pt-4.5 pb-0.5">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-title text-ink">Eng ko‘p dars o‘tganlar</h2>
        <Link href="/oqituvchilar" className="flex items-center gap-1 text-caption font-semibold text-ink hover:text-brand">
          Barchasi <ArrowRight className="size-3" />
        </Link>
      </header>
      <ol>
        {teachers.map((t) => (
          <li key={t.id} className="flex items-center gap-3 border-t border-line-subtle pt-2.5 pb-[21px]">
            <InitialsAvatar name={t.name} size="md" />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-label text-ink">
                <span className="truncate">{t.name}</span>
                <span className="flex shrink-0 items-center gap-1 text-caption font-semibold">
                  <span className={cn("size-1.5 rounded-full", PLAN_DOT[t.planId])} aria-hidden="true" />
                  {planName(t.planId)}
                </span>
              </p>
              <p className="mt-0.5 text-caption text-ink-secondary">
                {t.groups} guruh, {t.students} student
              </p>
            </div>
            <div className="w-32.5 shrink-0">
              <p className="text-right text-label font-semibold text-ink">{t.hoursTaught} soat</p>
              <ProgressBar
                value={(t.hoursTaught / max) * 100}
                label={`${t.name}: ${t.hoursTaught} soat`}
                colorClass={PLAN_DOT[t.planId]}
                className="mt-1 h-[5px]"
              />
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
