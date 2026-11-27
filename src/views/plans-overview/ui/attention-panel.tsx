"use client";

import { useState } from "react";
import { SendReminderButton } from "@/features/payment-reminder";
import type { MoveRequest } from "@/features/teacher-move-plan";
import {
  upgradeTarget,
  type AttentionItem,
  type AttentionKind,
  type AttentionTone,
  type Plan,
} from "@/entities/plan";
import { cn } from "@/shared/lib/cn";
import { InitialsAvatar } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Panel } from "@/shared/ui/panel";

const TABS: Array<{ kind: AttentionKind; label: string }> = [
  { kind: "demo", label: "Demo" },
  { kind: "limit", label: "Limit" },
  { kind: "payment", label: "To‘lov" },
];

const TONE_DOT: Record<AttentionTone, string> = {
  danger: "bg-danger",
  warning: "bg-warning",
  demo: "bg-plan-demo",
};

export function AttentionPanel({
  items,
  plans,
  onMove,
}: {
  items: AttentionItem[];
  plans: Plan[];
  onMove: (request: MoveRequest) => void;
}) {
  const [tab, setTab] = useState<AttentionKind>("demo");
  const visible = items.filter((item) => item.kind === tab);

  function action(item: AttentionItem) {
    if (item.kind === "payment") {
      return <SendReminderButton teacherId={item.teacherId} teacherName={item.teacherName} />;
    }
    const suggested = upgradeTarget(item.planId);
    if (!suggested) return null;
    const label =
      item.kind === "demo" ? "Tarifga o‘tkazish" : `${plans.find((p) => p.id === suggested)?.name ?? ""}ga oshirish`;
    return (
      <Button
        variant="secondary"
        size="xs"
        className="px-3"
        onClick={() => onMove({ teacherId: item.teacherId, teacherName: item.teacherName, suggested })}
      >
        {label}
      </Button>
    );
  }

  return (
    <Panel className="px-5 pt-4.5 pb-1">
      <header className="mb-[11px] flex flex-wrap items-center gap-3">
        <h2 className="text-title text-ink">Bugun e’tibor talab qiladi</h2>
        <span className="flex items-center gap-1.5 text-caption font-semibold text-ink">
          <span className="size-1.5 rounded-full bg-warning" aria-hidden="true" />
          {items.length} ta
        </span>
        <div role="tablist" aria-label="Turi" className="ml-auto flex gap-1">
          {TABS.map(({ kind, label }) => {
            const count = items.filter((item) => item.kind === kind).length;
            const active = kind === tab;
            return (
              <button
                key={kind}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(kind)}
                className={cn(
                  "h-[23px] rounded-md px-2.5 text-micro transition-colors",
                  active ? "bg-inverse text-ink-inverse" : "text-ink hover:bg-subtle"
                )}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      </header>

      <ul role="tabpanel" className="max-h-51 overflow-y-auto">
        {visible.map((item) => (
          <li key={item.id} className="flex items-center gap-3 border-t border-line-subtle pt-2.5 pb-[21px]">
            <InitialsAvatar name={item.teacherName} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-label text-ink">{item.teacherName}</p>
              <p className="mt-0.5 truncate text-caption text-ink-secondary">{item.detail}</p>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 text-caption font-medium text-ink">
              <span className={cn("size-1.5 rounded-full", TONE_DOT[item.status.tone])} aria-hidden="true" />
              {item.status.label}
            </span>
            <div className="-ml-0.5 shrink-0">{action(item)}</div>
          </li>
        ))}
        {visible.length === 0 ? (
          <li className="border-t border-line-subtle py-8 text-center text-body text-ink-secondary">
            Hozircha bu bo‘limda vazifa yo‘q.
          </li>
        ) : null}
      </ul>
    </Panel>
  );
}
