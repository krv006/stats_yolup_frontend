"use client";

import { useMemo, useState } from "react";
import { useSupportTickets, type SupportTicket, type TicketStatus } from "@/entities/support";
import type { DemoScenario } from "@/shared/api/demo-scenario";
import { cn } from "@/shared/lib/cn";
import { LoadErrorPanel, LoadingPanel, StatePanel } from "@/shared/ui/state-panel";
import { Conversation } from "./conversation";
import { TicketList } from "./ticket-list";

type Tab = TicketStatus | "all";

const TABS: Array<{ value: Tab; label: string }> = [
  { value: "open", label: "Ochiq" },
  { value: "answered", label: "Javob berilgan" },
  { value: "closed", label: "Yopilgan" },
  { value: "all", label: "Hammasi" },
];

export function SupportPage({ scenario }: { scenario: DemoScenario }) {
  const [tab, setTab] = useState<Tab>("open");
  const [query, setQuery] = useState("");
  // The open conversation stays put after a reply/close moves it to another tab.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const tickets = useSupportTickets(scenario);
  const all = useMemo(() => tickets.data ?? [], [tickets.data]);

  const inTab = (t: SupportTicket) => tab === "all" || t.status === tab;
  const needle = query.trim().toLowerCase();
  const visible = all.filter(
    (t) =>
      (inTab(t) || t.id === selectedId) &&
      (!needle ||
        [t.subject, t.requester.name, t.requester.username, `#${t.number}`].some((v) => v.toLowerCase().includes(needle)))
  );
  const tabHasTickets = all.some((t) => inTab(t) || t.id === selectedId);
  const selected = visible.find((t) => t.id === selectedId) ?? visible[0];
  // Pin the default pick so a reply or close can't swap the open conversation.
  if (selected && selectedId === null) setSelectedId(selected.id);

  function switchTab(next: Tab) {
    setTab(next);
    setSelectedId(null);
  }

  function body() {
    if (tickets.isError && !tickets.data) {
      return <LoadErrorPanel title="Murojaatlarni yuklab bo‘lmadi" retrying={tickets.isFetching} onRetry={() => void tickets.refetch()} />;
    }
    if (!tickets.data) return <LoadingPanel />;
    if (!tabHasTickets) {
      return (
        <StatePanel
          badge="Bo‘sh holat"
          title="Bu holatda murojaat yo‘q"
          description="Foydalanuvchilardan yangi savol yoki muammo kelib tushganda shu yerda ko‘rinadi."
        />
      );
    }
    return (
      <div className="grid h-[max(520px,calc(100dvh-190px))] grid-cols-[410px_minmax(0,1fr)] gap-4">
        <TicketList
          tickets={visible}
          selectedId={selected?.id}
          query={query}
          onQueryChange={setQuery}
          onSelect={setSelectedId}
        />
        {selected ? (
          <Conversation key={selected.id} ticket={selected} />
        ) : (
          <StatePanel badge="Qidiruv" title="Murojaat topilmadi" description="Boshqa so‘z bilan qidirib ko‘ring." className="min-h-0" />
        )}
      </div>
    );
  }

  return (
    <div className="-mt-px flex flex-1 flex-col gap-[18px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-display text-ink-strong">Murojaatlar (Qo‘llab-quvvatlash)</h1>
        <div role="tablist" aria-label="Murojaat holati" className="flex gap-[3px] rounded-lg bg-track p-1">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={t.value === tab}
              onClick={() => switchTab(t.value)}
              className={cn(
                "flex h-[29px] items-center gap-2 rounded-md px-3 text-body transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                t.value === tab ? "bg-surface font-semibold text-ink shadow-xs" : "text-ink hover:text-ink-strong"
              )}
            >
              {t.label}
              <span className="text-caption font-normal">
                {t.value === "all" ? all.length : all.filter((x) => x.status === t.value).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {body()}
    </div>
  );
}
