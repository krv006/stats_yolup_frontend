"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { NewDemoDialog } from "@/features/demo-create";
import { EditLimitsDialog, useSavePlanSettings, type PlanSettingsDrafts } from "@/features/plan-limits-edit";
import { MoveTeacherDialog, type MoveRequest } from "@/features/teacher-move-plan";
import { usePlansOverview, type Plan, type PlanSettingsInput } from "@/entities/plan";
import type { DemoScenario } from "@/shared/api/demo-scenario";
import { Button } from "@/shared/ui/button";
import { Panel } from "@/shared/ui/panel";
import { Skeleton } from "@/shared/ui/skeleton";
import { LoadErrorPanel } from "@/shared/ui/state-panel";
import { toast } from "@/shared/ui/toast";
import { AttentionPanel } from "./attention-panel";
import { PlanCard, type PlanCardMode } from "./plan-card";
import { SummaryPanel } from "./summary-panel";
import { TopTeachersPanel } from "./top-teachers-panel";

/**
 * Apply an unsaved draft so cards preview the new price/limits.
 * Revenue stays at the saved figure until the server recomputes it.
 */
function withDraft(plan: Plan, draft: PlanSettingsInput | undefined): Plan {
  return draft ? { ...plan, priceMonthly: draft.priceMonthly, trialDays: draft.trialDays, limits: draft.limits } : plan;
}

export function PlansOverviewPage({ mode, scenario }: { mode: PlanCardMode; scenario: DemoScenario }) {
  const overview = usePlansOverview(scenario);
  const save = useSavePlanSettings();
  const [drafts, setDrafts] = useState<PlanSettingsDrafts>({});
  const [editing, setEditing] = useState<Plan | null>(null);
  const [moving, setMoving] = useState<MoveRequest | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);

  const isSettings = mode === "settings";
  const dirtyCount = Object.keys(drafts).length;
  const plans = overview.data?.plans.map((p) => withDraft(p, drafts[p.id])) ?? [];

  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="-mb-px flex min-h-[34px] flex-wrap items-center justify-between gap-4">
        <h1 className="text-display text-ink-strong">
          {isSettings ? "Tarif sozlamalari (Narx va limitlar)" : "Tariflar va obunalar"}
        </h1>
        {isSettings ? (
          <Button
            className="gap-2"
            disabled={save.isPending}
            onClick={() => {
              if (dirtyCount === 0) {
                toast.success("Saqlanadigan o‘zgarish yo‘q");
                return;
              }
              save.mutate(drafts, { onSuccess: () => setDrafts({}) });
            }}
          >
            <Plus className="size-3.5" />
            {save.isPending ? "Saqlanmoqda..." : "O‘zgarishlarni saqlash"}
            {dirtyCount > 0 && !save.isPending ? ` (${dirtyCount})` : null}
          </Button>
        ) : (
          <Button className="gap-2" onClick={() => setDemoOpen(true)}>
            <Plus className="size-3.5" /> Bepul demo ochish
          </Button>
        )}
      </div>

      {overview.data ? (
        <>
          <SummaryPanel overview={{ ...overview.data, plans }} />
          <div className="grid items-start gap-4.5 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                mode={mode}
                dirty={isSettings && drafts[plan.id] != null}
                onEdit={() => setEditing(plan)}
                onNewDemo={() => setDemoOpen(true)}
              />
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <AttentionPanel items={overview.data.attention} plans={plans} onMove={setMoving} />
            <TopTeachersPanel teachers={overview.data.topTeachers} plans={plans} />
          </div>
        </>
      ) : overview.isError ? (
        <LoadErrorPanel
          title="Tariflarni yuklab bo‘lmadi"
          retrying={overview.isFetching}
          onRetry={() => void overview.refetch()}
        />
      ) : (
        <OverviewSkeleton />
      )}

      <EditLimitsDialog
        plan={editing}
        onClose={() => setEditing(null)}
        onApply={(input) => {
          if (editing) setDrafts((prev) => ({ ...prev, [editing.id]: input }));
          setEditing(null);
        }}
      />
      <MoveTeacherDialog request={moving} plans={plans} onClose={() => setMoving(null)} />
      <NewDemoDialog open={demoOpen} onOpenChange={setDemoOpen} demoPlan={plans.find((p) => p.id === "demo")} />
    </div>
  );
}

export function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-5" aria-busy="true" aria-label="Yuklanmoqda">
      <Panel className="h-35 p-5.5"><Skeleton className="h-4 w-40" /></Panel>
      <div className="grid gap-4.5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Panel key={i} className="h-63 p-4.5"><Skeleton className="h-4 w-24" /></Panel>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="h-65 p-5"><Skeleton className="h-4 w-48" /></Panel>
        <Panel className="h-65 p-5"><Skeleton className="h-4 w-40" /></Panel>
      </div>
    </div>
  );
}
