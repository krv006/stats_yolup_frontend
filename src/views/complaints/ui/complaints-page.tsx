"use client";

import { useState } from "react";
import { useComplaints, type ComplaintStatus } from "@/entities/complaint";
import type { DemoScenario } from "@/shared/api/demo-scenario";
import { LoadErrorPanel, LoadingPanel, StatePanel } from "@/shared/ui/state-panel";
import { TabSwitcher } from "@/shared/ui/tab-switcher";
import { ComplaintDetail } from "./complaint-detail";
import { ComplaintList } from "./complaint-list";

const TABS: Record<ComplaintStatus, { label: string; listTitle: string; emptyTitle: string; emptyText: string }> = {
  new: {
    label: "Yangi",
    listTitle: "Kelib tushgan shikoyatlar",
    emptyTitle: "Yangi chat shikoyatlari yo‘q",
    emptyText: "Shaxsiy chatlardan spam yoki bezovta qilish bo‘yicha shikoyat tushganda shu yerda ko‘rinadi.",
  },
  approved: {
    label: "Tasdiqlangan",
    listTitle: "Tasdiqlangan shikoyatlar",
    emptyTitle: "Tasdiqlangan shikoyatlar yo‘q",
    emptyText: "Chora ko‘rilgan shikoyatlar shu yerda saqlanadi.",
  },
  rejected: {
    label: "Rad etilgan",
    listTitle: "Rad etilgan shikoyatlar",
    emptyTitle: "Rad etilgan shikoyatlar yo‘q",
    emptyText: "Asossiz deb topilgan shikoyatlar shu yerda saqlanadi.",
  },
};
const ORDER: ComplaintStatus[] = ["new", "approved", "rejected"];

export function ComplaintsPage({ scenario }: { scenario: DemoScenario }) {
  const [tab, setTab] = useState<ComplaintStatus>("new");
  // The reviewed case stays open after a decision moves it to another tab.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const complaints = useComplaints(scenario);
  const all = complaints.data ?? [];

  const visible = all.filter((c) => c.status === tab || c.id === selectedId);
  const selected = visible.find((c) => c.id === selectedId) ?? visible[0];
  if (selected && selectedId === null) setSelectedId(selected.id);
  const inTab = all.filter((c) => c.status === tab).length;

  function switchTab(next: ComplaintStatus) {
    setTab(next);
    setSelectedId(null);
  }

  function body() {
    if (complaints.isError && !complaints.data) {
      return (
        <LoadErrorPanel
          title="Shikoyatlarni yuklab bo‘lmadi"
          retrying={complaints.isFetching}
          onRetry={() => void complaints.refetch()}
        />
      );
    }
    if (!complaints.data) return <LoadingPanel />;
    if (!selected) return <StatePanel badge="Bo‘sh holat" title={TABS[tab].emptyTitle} description={TABS[tab].emptyText} />;
    return (
      <div className="grid h-[max(520px,calc(100dvh-190px))] grid-cols-[460px_minmax(0,1fr)] gap-4">
        <ComplaintList
          title={`${TABS[tab].listTitle} (${inTab})`}
          complaints={visible}
          selectedId={selected.id}
          onSelect={setSelectedId}
        />
        <ComplaintDetail key={selected.id} complaint={selected} />
      </div>
    );
  }

  return (
    <div className="-mt-px flex flex-1 flex-col gap-[18px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-display text-ink-strong">Shikoyatlar (Chat xavfsizligi)</h1>
        <TabSwitcher
          tabs={ORDER.map((value) => ({ value, label: TABS[value].label, count: all.filter((c) => c.status === value).length }))}
          value={tab}
          onChange={switchTab}
          label="Shikoyat holati"
        />
      </div>

      {body()}
    </div>
  );
}
