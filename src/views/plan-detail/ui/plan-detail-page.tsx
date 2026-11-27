"use client";

import { Plus, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NewDemoDialog } from "@/features/demo-create";
import { MoveTeacherDialog, type MoveRequest } from "@/features/teacher-move-plan";
import {
  upgradeTarget,
  usePlanTeachers,
  usePlansOverview,
  type Plan,
  type PlanId,
  type PlanTeacher,
} from "@/entities/plan";
import type { DemoScenario } from "@/shared/api/demo-scenario";
import { cn } from "@/shared/lib/cn";
import { Button, buttonVariants } from "@/shared/ui/button";
import { SearchInput } from "@/shared/ui/input";
import { Panel } from "@/shared/ui/panel";
import { Skeleton } from "@/shared/ui/skeleton";
import { LoadErrorPanel, StatePanel } from "@/shared/ui/state-panel";
import { PlanHeader } from "./plan-header";
import { PlanTabs } from "./plan-tabs";
import { DemoTeachersTable, PaidTeachersTable, matchesQuery } from "./teachers-table";

type DemoFilter = "all" | "active" | "expired";

const DEMO_FILTERS: Array<{ value: DemoFilter; label: string; test: (t: PlanTeacher) => boolean }> = [
  { value: "all", label: "Barchasi", test: () => true },
  { value: "active", label: "Faol", test: (t) => (t.trialDaysLeft ?? 0) > 0 },
  { value: "expired", label: "Muddati tugagan", test: (t) => (t.trialDaysLeft ?? 0) <= 0 },
];

export function PlanDetailPage({ planId, scenario }: { planId: PlanId; scenario: DemoScenario }) {
  const overview = usePlansOverview(scenario);
  const teachers = usePlanTeachers(planId, scenario);
  const [moving, setMoving] = useState<MoveRequest | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);

  const plans = overview.data?.plans ?? [];
  const plan = plans.find((p) => p.id === planId);
  const isDemo = planId === "demo";

  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {plans.length ? <PlanTabs plans={plans} active={planId} /> : <Skeleton className="h-9 w-128 rounded-lg" />}
        {isDemo ? (
          <Button className="gap-2" onClick={() => setDemoOpen(true)}>
            <Plus className="size-3.5" /> Bepul demo ochish
          </Button>
        ) : (
          <Link href="/tariflar/sozlamalar" className={cn(buttonVariants({ variant: "outline" }), "gap-2")}>
            <SlidersHorizontal className="size-3.5" /> Tarif sozlamalari
          </Link>
        )}
      </div>

      {overview.isError && !plan ? (
        <LoadErrorPanel title="Tarifni yuklab bo‘lmadi" retrying={overview.isFetching} onRetry={() => void overview.refetch()} />
      ) : (
        <>
          {plan ? <PlanHeader plan={plan} /> : <Panel className="h-36" aria-busy="true" />}
          {teachers.isError ? (
            <LoadErrorPanel
              title="O‘qituvchilar ro‘yxatini yuklab bo‘lmadi"
              retrying={teachers.isFetching}
              onRetry={() => void teachers.refetch()}
            />
          ) : !plan || !teachers.data ? (
            <TableSkeleton />
          ) : teachers.data.length === 0 ? (
            <EmptyTeachers plan={plan} onNewDemo={() => setDemoOpen(true)} />
          ) : (
            <TeachersSection
              // Reset search/filter when switching plans.
              key={plan.id}
              plan={plan}
              teachers={teachers.data}
              onConvert={(t) =>
                setMoving({ teacherId: t.id, teacherName: t.name, suggested: upgradeTarget(t.planId) ?? "business" })
              }
            />
          )}
        </>
      )}

      <MoveTeacherDialog request={moving} plans={plans} onClose={() => setMoving(null)} />
      <NewDemoDialog open={demoOpen} onOpenChange={setDemoOpen} demoPlan={plans.find((p) => p.id === "demo")} />
    </div>
  );
}

function TeachersSection({
  plan,
  teachers,
  onConvert,
}: {
  plan: Plan;
  teachers: PlanTeacher[];
  onConvert: (teacher: PlanTeacher) => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<DemoFilter>("all");
  const isDemo = plan.id === "demo";
  const activeFilter = DEMO_FILTERS.find((f) => f.value === filter)!;
  const visible = teachers.filter((t) => matchesQuery(t, query) && (!isDemo || activeFilter.test(t)));

  return (
    <Panel className="overflow-hidden">
      <div className={cn("flex flex-wrap items-center gap-3 px-5", isDemo ? "py-[13px]" : "py-3.5")}>
        {isDemo ? (
          <div role="group" aria-label="Holat bo‘yicha filtr" className="flex gap-1.5">
            {DEMO_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                aria-pressed={f.value === filter}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "h-7 rounded-md px-3 text-caption transition-colors",
                  f.value === filter ? "bg-inverse text-ink-inverse" : "bg-subtle text-ink hover:bg-track"
                )}
              >
                {f.label} ({teachers.filter(f.test).length})
              </button>
            ))}
          </div>
        ) : (
          <h2 className="flex items-center gap-2 text-title text-ink">
            {plan.name} tarifdagi o‘qituvchilar
            <span className="text-caption font-normal">{teachers.length}</span>
          </h2>
        )}
        <SearchInput
          label="O‘qituvchini qidirish"
          placeholder={isDemo ? "Ism bo‘yicha qidirish..." : "Ism yoki telefon bo‘yicha..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="ml-auto w-62.5"
        />
      </div>
      <div className="overflow-x-auto">
        {isDemo ? (
          <DemoTeachersTable plan={plan} teachers={visible} onConvert={onConvert} />
        ) : (
          <PaidTeachersTable plan={plan} teachers={visible} />
        )}
      </div>
    </Panel>
  );
}

function EmptyTeachers({ plan, onNewDemo }: { plan: Plan; onNewDemo: () => void }) {
  return plan.id === "demo" ? (
    <StatePanel
      badge="Ma’lumot yo‘q"
      title="Faol demo o‘qituvchilar yo‘q"
      description="Yangi o‘qituvchi qo‘shish uchun “Bepul demo ochish” tugmasini bosing."
      action={
        <Button className="gap-1" onClick={onNewDemo}>
          <Plus className="size-3.5" /> Bepul demo ochish
        </Button>
      }
    />
  ) : (
    <StatePanel
      badge="Ma’lumot yo‘q"
      title={`${plan.name} tarifida hali o‘qituvchi yo‘q`}
      description="O‘qituvchilar demo yoki boshqa tarifdan o‘tkazilgach shu yerda ko‘rinadi."
    />
  );
}

function TableSkeleton() {
  return (
    <Panel aria-busy="true" aria-label="Yuklanmoqda" className="flex min-h-140 flex-1 flex-col justify-center gap-6 px-12">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="size-8.5 rounded-full" />
          <Skeleton className="h-3.5 w-55" />
          <Skeleton className="h-3.5 w-35" />
          <Skeleton className="h-3.5 w-45" />
        </div>
      ))}
    </Panel>
  );
}
