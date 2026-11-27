"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { NewDemoDialog } from "@/features/demo-create";
import { usePlansOverview, useTeacherRoster } from "@/entities/plan";
import type { DemoScenario } from "@/shared/api/demo-scenario";
import { Button } from "@/shared/ui/button";
import { LoadErrorPanel, LoadingPanel, StatePanel } from "@/shared/ui/state-panel";
import { TabSwitcher, type TabOption } from "@/shared/ui/tab-switcher";
import { ApplicantsPanel } from "./applicants-panel";
import { RosterTable } from "./roster-table";
import { TeacherStatsDialog } from "./teacher-stats-dialog";

type Tab = "all" | "pending";

export function TeachersPage({ scenario }: { scenario: DemoScenario }) {
  const [tab, setTab] = useState<Tab>("all");
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const roster = useTeacherRoster(scenario);
  const plans = usePlansOverview(scenario);

  const applicants = roster.data?.applicants ?? [];
  const teachers = roster.data?.teachers ?? [];
  const person =
    teachers.find((t) => t.id === analyzing) ?? applicants.find((a) => a.id === analyzing);

  const tabs: Array<TabOption<Tab>> = [
    { value: "all", label: "Barcha o‘qituvchilar", count: teachers.length },
    { value: "pending", label: "Tasdiqlanishi kerak", count: applicants.length },
  ];

  function body() {
    if (roster.isError && !roster.data) {
      return <LoadErrorPanel title="O‘qituvchilarni yuklab bo‘lmadi" retrying={roster.isFetching} onRetry={() => void roster.refetch()} />;
    }
    if (!roster.data) return <LoadingPanel />;
    if (!teachers.length && !applicants.length) {
      return (
        <StatePanel
          badge="Bo‘sh holat"
          title="Tizimda hali o‘qituvchilar yo‘q"
          description="Birinchi o‘qituvchini qo‘shish uchun bepul demo oching."
          action={
            <Button className="gap-1" onClick={() => setDemoOpen(true)}>
              <Plus className="size-3.5" /> Bepul demo ochish
            </Button>
          }
        />
      );
    }
    if (tab === "pending" && !applicants.length) {
      return (
        <StatePanel
          badge="Bo‘sh holat"
          title="Tasdiqlanishi kerak bo‘lgan o‘qituvchi yo‘q"
          description="Yangi o‘qituvchi ro‘yxatdan o‘tganda shu yerda ko‘rinadi."
        />
      );
    }
    return (
      <div className="flex flex-col gap-[18px]">
        {applicants.length ? <ApplicantsPanel applicants={applicants} onAnalyze={setAnalyzing} /> : null}
        {tab === "all" ? <RosterTable teachers={teachers} plans={plans.data?.plans ?? []} onAnalyze={setAnalyzing} /> : null}
      </div>
    );
  }

  return (
    <div className="-mt-px flex flex-1 flex-col gap-[18px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-display text-ink-strong">O‘qituvchilar</h1>
        <TabSwitcher tabs={tabs} value={tab} onChange={setTab} label="Ko‘rinish" />
      </div>

      {body()}

      <TeacherStatsDialog
        teacherId={analyzing}
        fallbackName={person?.name ?? ""}
        fallbackUsername={person?.username ?? ""}
        scenario={scenario}
        onClose={() => setAnalyzing(null)}
      />
      <NewDemoDialog open={demoOpen} onOpenChange={setDemoOpen} demoPlan={plans.data?.plans.find((p) => p.id === "demo")} />
    </div>
  );
}
