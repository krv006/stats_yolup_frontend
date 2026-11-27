"use client";

import { useState, type ReactNode } from "react";
import { AnnouncementForm } from "@/features/announcement-send";
import { useAnnouncementHistory } from "@/entities/announcement";
import type { DemoScenario } from "@/shared/api/demo-scenario";
import { Panel } from "@/shared/ui/panel";
import { Skeleton } from "@/shared/ui/skeleton";
import { AnnouncementHistoryList } from "./history-list";
import { ReadersDialog } from "./readers-dialog";

/** Fallback until the first response tells us the real audience. */
const NO_AUDIENCE = { teachers: 0, students: 0 };

export function AnnouncementsPage({ scenario }: { scenario: DemoScenario }) {
  const history = useAnnouncementHistory(scenario);
  const [readersOf, setReadersOf] = useState<string | null>(null);
  const items = history.data?.items ?? [];

  return (
    <div className="-mt-0.5 flex flex-col gap-[19px]">
      <h1 className="text-display text-ink-strong">E’lon va xabarlar</h1>

      <div className="grid grid-cols-[440px_minmax(0,1fr)] items-start gap-4">
        <Panel aria-label="Yangi xabar yuborish" className="px-[23px] pt-[19px] pb-5">
          <h2 className="text-[17px] leading-6 font-semibold text-ink">Yangi xabar yuborish</h2>
          <div className="mt-4">
            <AnnouncementForm activeUsers={history.data?.activeUsers ?? NO_AUDIENCE} />
          </div>
        </Panel>

        <Panel aria-label="Yuborilgan xabarlar tarixi" className="flex h-[441px] flex-col px-[23px] pt-[18px] pb-4">
          <header className="flex items-center justify-between gap-4">
            <h2 className="text-[17px] leading-6 font-semibold text-ink">Yuborilgan xabarlar tarixi</h2>
            {history.data ? <span className="text-caption text-ink">Jami {items.length} ta e’lon</span> : null}
          </header>
          {history.isError && !history.data ? (
            <HistoryState
              title="Tarixni yuklab bo‘lmadi"
              action={
                <button type="button" className="text-body font-medium text-brand hover:underline" onClick={() => void history.refetch()}>
                  Qayta urinish
                </button>
              }
            />
          ) : !history.data ? (
            <HistorySkeleton />
          ) : items.length ? (
            <AnnouncementHistoryList items={items} onShowReaders={setReadersOf} />
          ) : (
            <HistoryState title="Hali xabar yuborilmagan" text="Yuborilgan e’lon va xabarlar shu yerda ko‘rinadi." />
          )}
        </Panel>
      </div>

      <ReadersDialog announcementId={readersOf} onClose={() => setReadersOf(null)} />
    </div>
  );
}

function HistoryState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
      <p className="text-title text-ink">{title}</p>
      {text ? <p className="text-body text-ink-secondary">{text}</p> : null}
      {action}
    </div>
  );
}

function HistorySkeleton() {
  return (
    <div aria-busy="true" aria-label="Yuklanmoqda" className="mt-[26px] flex flex-col gap-[49px] px-4">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton className="h-3 w-50" />
          <Skeleton className="h-3.5 w-110" />
          <Skeleton className="h-3 w-70" />
        </div>
      ))}
    </div>
  );
}
