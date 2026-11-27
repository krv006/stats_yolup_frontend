"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ExtendTrialButton } from "@/features/demo-extend";
import { MoveTeacherDialog, type MoveRequest } from "@/features/teacher-move-plan";
import {
  PLAN_TITLE,
  upgradeTarget,
  usePlansOverview,
  useTeacherDetail,
  type PlanId,
  type TeacherDetail,
} from "@/entities/plan";
import type { DemoScenario } from "@/shared/api/demo-scenario";
import { Breadcrumb } from "@/shared/ui/breadcrumb";
import { Button } from "@/shared/ui/button";
import { Panel } from "@/shared/ui/panel";
import { Skeleton } from "@/shared/ui/skeleton";
import { LoadErrorPanel } from "@/shared/ui/state-panel";
import { toast } from "@/shared/ui/toast";
import { DemoLessonsPanel } from "./demo-lessons-panel";
import { GroupCard } from "./group-card";
import { HoursDistribution, SubscriptionCard, TrialCard } from "./side-cards";
import { TeacherHeader } from "./teacher-header";

const PLAN_CRUMB: Record<PlanId, string> = {
  ...PLAN_TITLE,
  demo: "Demo (bepul)",
};

const notReady = () => toast.success("Bu amal tez orada qo‘shiladi");

export function TeacherDetailPage({
  planId,
  teacherId,
  scenario,
}: {
  planId: PlanId;
  teacherId: string;
  scenario: DemoScenario;
}) {
  const router = useRouter();
  const detail = useTeacherDetail(teacherId, scenario);
  const plans = usePlansOverview(scenario);
  const [moving, setMoving] = useState<MoveRequest | null>(null);

  // After a plan change the teacher lives under another plan: keep the URL honest.
  const actualPlan = detail.data?.plan.id;
  useEffect(() => {
    if (actualPlan && actualPlan !== planId) router.replace(`/tariflar/${actualPlan}/${teacherId}`);
  }, [actualPlan, planId, teacherId, router]);

  const crumbs = [
    { label: "Tariflar", href: "/tariflar" },
    { label: PLAN_CRUMB[actualPlan ?? planId], href: `/tariflar/${actualPlan ?? planId}` },
    { label: detail.data?.teacher.name ?? "…" },
  ];

  if (detail.isError) {
    return (
      <div className="flex flex-1 flex-col gap-5">
        <Breadcrumb items={crumbs} />
        <LoadErrorPanel title="O‘qituvchi ma’lumotlarini yuklab bo‘lmadi" retrying={detail.isFetching} onRetry={() => void detail.refetch()} />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-[19px]">
      <Breadcrumb items={crumbs} />
      {detail.data ? (
        <Content
          detail={detail.data}
          plans={plans.data?.plans ?? []}
          onConvert={() =>
            setMoving({
              teacherId,
              teacherName: detail.data.teacher.name,
              suggested: upgradeTarget(detail.data.plan.id) ?? "business",
            })
          }
        />
      ) : (
        <DetailSkeleton />
      )}
      <MoveTeacherDialog request={moving} plans={plans.data?.plans ?? []} onClose={() => setMoving(null)} />
    </div>
  );
}

function Content({
  detail,
  plans,
  onConvert,
}: {
  detail: TeacherDetail;
  plans: NonNullable<ReturnType<typeof usePlansOverview>["data"]>["plans"];
  onConvert: () => void;
}) {
  const isDemo = detail.plan.id === "demo";
  const actions = isDemo ? (
    <>
      <ExtendTrialButton teacherId={detail.teacher.id} />
      <Button className="px-3.5" onClick={onConvert}>Tarifga o‘tkazish</Button>
    </>
  ) : (
    <>
      <Button variant="outline" className="px-3.5" onClick={notReady}>Muddatni uzaytirish</Button>
      <Button className="px-3.5" onClick={notReady}>Tarifni o‘zgartirish</Button>
    </>
  );

  return (
    <>
      <TeacherHeader detail={detail} actions={actions} />
      <div className="mt-px grid items-start gap-x-[19px] gap-y-5 xl:grid-cols-[minmax(0,1fr)_370px] xl:pr-3">
        <section aria-labelledby="groups-title" className="flex min-w-0 flex-col gap-3">
          <h2 id="groups-title" className="text-base leading-5 font-semibold text-ink">
            {isDemo ? "Faol guruh" : "Guruhlar"} ({detail.groups.length})
          </h2>
          {detail.groups.length ? (
            <div className={isDemo ? "grid gap-3.5" : "grid gap-x-[15px] gap-y-[13px] md:grid-cols-2"}>
              {detail.groups.map((g) => (
                <GroupCard key={g.id} group={g} planId={detail.plan.id} />
              ))}
            </div>
          ) : (
            <Panel className="p-8 text-center text-body text-ink-secondary">Hali guruh ochilmagan.</Panel>
          )}
          {isDemo ? (
            <div className="mt-1">
              <DemoLessonsPanel lessons={detail.recentLessons} activity={detail.activity} />
            </div>
          ) : null}
        </section>

        <aside className="flex flex-col gap-[15px]">
          {isDemo ? (
            <TrialCard
              detail={detail}
              recommendedPlan={plans.find((p) => p.id === detail.recommendedPlanId)}
              action={<Button className="w-full" onClick={onConvert}>Pullik tarifga o‘tkazish</Button>}
            />
          ) : (
            <>
              <SubscriptionCard detail={detail} />
              {detail.groups.length ? <HoursDistribution groups={detail.groups} planId={detail.plan.id} /> : null}
            </>
          )}
        </aside>
      </div>
    </>
  );
}

function DetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Yuklanmoqda" className="flex flex-col gap-5">
      <Panel className="h-[158px] p-5"><Skeleton className="h-6 w-60" /></Panel>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_370px]">
        <Panel className="h-80 p-5"><Skeleton className="h-4 w-40" /></Panel>
        <Panel className="h-60 p-5"><Skeleton className="h-4 w-40" /></Panel>
      </div>
    </div>
  );
}
