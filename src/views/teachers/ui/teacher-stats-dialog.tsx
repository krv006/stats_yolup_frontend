"use client";

import { Star } from "lucide-react";
import { useTeacherStats, type TeacherStats } from "@/entities/plan";
import type { DemoScenario } from "@/shared/api/demo-scenario";
import { formatRating } from "@/shared/lib/format";
import { InitialsAvatar } from "@/shared/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui/dialog";
import { ProgressBar } from "@/shared/ui/progress-bar";
import { Skeleton } from "@/shared/ui/skeleton";

function Kpi({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-caption text-ink">{label}</dt>
      <dd className="flex items-center gap-1.5 text-numeric-sm text-ink">{value}</dd>
    </div>
  );
}

function Body({ stats }: { stats: TeacherStats }) {
  const max = Math.max(1, ...stats.distribution);
  return (
    <>
      <dl className="mt-[31px] grid grid-cols-2 gap-y-[30px] pl-3.5 sm:-mr-[22px] sm:grid-cols-4">
        <Kpi
          label="O‘rtacha baho"
          value={
            stats.ratingAvg != null ? (
              <>
                {formatRating(stats.ratingAvg)}
                <Star className="size-4 fill-ink text-ink" aria-hidden="true" />
              </>
            ) : (
              "—"
            )
          }
        />
        <Kpi label="Baholar soni" value={`${stats.ratingCount} ta`} />
        <Kpi label="Faol kurslar" value={`${stats.activeCourses} ta`} />
        <Kpi label="O‘quvchilar" value={`${stats.students} nafar`} />
        <Kpi label="O‘tilgan darslar" value={`${stats.lessonsDone} ta`} />
        <Kpi label="Rejalashtirilgan" value={`${stats.lessonsScheduled} ta`} />
        <Kpi label="Bekor qilingan" value={`${stats.lessonsCancelled} ta`} />
        <Kpi label="Ishonchlilik" value={stats.reliability != null ? `${stats.reliability.toFixed(1)}%` : "—"} />
      </dl>

      <div className="mt-[27px] grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <section aria-label="Baholar taqsimoti" className="px-4 pt-3.5">
          <h3 className="text-body font-medium text-ink">Baholar taqsimoti</h3>
          <ul className="mt-2 flex flex-col gap-[9px]">
            {stats.distribution.map((count, i) => {
              const stars = 5 - i;
              return (
                <li key={stars} className="flex items-center gap-4 text-caption text-ink">
                  <span className="w-6 shrink-0">{stars} ★</span>
                  <ProgressBar
                    value={count ? (count / max) * 100 : 2}
                    label={`${stars} yulduz: ${count} ta`}
                    colorClass="bg-warning"
                    className="h-[5px] flex-1"
                  />
                  <span className="w-4 shrink-0 text-right">{count}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-label="So‘nggi izohlar">
          <h3 className="text-body font-medium text-ink">So‘nggi izohlar ({stats.comments.length})</h3>
          {stats.comments.length ? (
            <ul className="mt-4 flex flex-col gap-[25px] px-3">
              {stats.comments.map((c, i) => (
                <li key={`${c.author}-${i}`}>
                  <p className="flex items-center justify-between gap-3 text-caption font-semibold text-ink">
                    {c.author}
                    <span className="font-normal">{c.rating.toFixed(1)} ★</span>
                  </p>
                  <p className="mt-1 text-caption text-ink">{c.text}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-[22px] px-3 text-caption text-ink-secondary">
              Hozircha o‘quvchilar tomonidan baho va izoh qoldirilmagan.
            </p>
          )}
        </section>
      </div>
    </>
  );
}

/** Ratings, courses and lessons overview for one teacher or applicant. */
export function TeacherStatsDialog({
  teacherId,
  fallbackName,
  fallbackUsername,
  scenario,
  onClose,
}: {
  teacherId: string | null;
  fallbackName: string;
  fallbackUsername: string;
  scenario: DemoScenario;
  onClose: () => void;
}) {
  const stats = useTeacherStats(teacherId, scenario);
  const name = stats.data?.name ?? fallbackName;
  const username = stats.data?.username ?? fallbackUsername;

  return (
    <Dialog open={teacherId != null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-160 pb-[30px]">
        <div className="flex items-center gap-3.5">
          <InitialsAvatar name={name} size="md" className="size-10" />
          <div className="min-w-0">
            <DialogTitle className="flex flex-wrap items-baseline gap-x-2 pr-10">
              {name} — statistika
              <span className="text-caption font-normal text-ink">@{username}</span>
            </DialogTitle>
            <DialogDescription className="mt-0 text-caption text-ink">
              Baholar, kurslar va darslar bo‘yicha umumiy ko‘rsatkichlar
            </DialogDescription>
          </div>
        </div>

        {stats.isError ? (
          <div role="alert" className="mt-[21px] flex h-[127px] flex-col items-center justify-center rounded-lg bg-danger-bg text-center">
            <p className="text-title text-ink">O‘qituvchi statistikasini yuklab bo‘lmadi</p>
            <p className="mt-2.5 text-caption text-ink">Server javob bermadi. Qaytadan urinib ko‘ring.</p>
          </div>
        ) : stats.data ? (
          <Body stats={stats.data} />
        ) : (
          <div aria-busy="true" aria-label="Yuklanmoqda" className="mt-6 flex flex-col gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
