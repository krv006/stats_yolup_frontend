"use client";

import { Popover } from "@base-ui/react/popover";
import { Bell, CreditCard, Gauge, X } from "lucide-react";
import Link from "next/link";
import { useState, type RefObject } from "react";
import { useMarkNotificationsRead } from "@/features/notifications-read";
import { MoveTeacherDialog, type MoveRequest } from "@/features/teacher-move-plan";
import {
  LIMIT_WARNING_SHARE,
  PAYMENT_REMINDER_DAYS,
  useNotifications,
  usePlansOverview,
  type NotificationKind,
  type PlanNotification,
} from "@/entities/plan";
import { cn } from "@/shared/lib/cn";
import { formatDaysAgo } from "@/shared/lib/format";
import { Button } from "@/shared/ui/button";
import { toast } from "@/shared/ui/toast";

type Tab = "all" | NotificationKind;

const TABS: Array<{ value: Tab; label: string }> = [
  { value: "all", label: "Hammasi" },
  { value: "limit", label: "Limit" },
  { value: "demo", label: "Yangi" },
  { value: "payment", label: "To‘lov" },
];

const TONE_DOT = { danger: "bg-danger", warning: "bg-warning", demo: "bg-plan-demo" } as const;

const ACTION_LABEL: Record<PlanNotification["action"], (n: PlanNotification) => string> = {
  extend: () => "Uzaytirish",
  convert: () => "Tarifga o‘tkazish",
  upgrade: (n) => (n.targetPlanId === "business" ? "Businessga oshirish" : "Proga oshirish"),
};

const notReady = () => toast.success("Bu amal tez orada qo‘shiladi");

function KindIcon({ notification }: { notification: PlanNotification }) {
  const limit = notification.kind === "limit";
  const Icon = limit ? Gauge : CreditCard;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-[30px] shrink-0 place-items-center rounded-md",
        notification.expired ? "bg-subtle text-ink-tertiary" : limit ? "bg-warning-bg text-warning" : "bg-danger-bg text-danger"
      )}
    >
      <Icon className="size-3.5" strokeWidth={2} />
    </span>
  );
}

function Item({
  notification,
  onAction,
  onOpen,
}: {
  notification: PlanNotification;
  onAction: (n: PlanNotification) => void;
  onOpen: (n: PlanNotification) => void;
}) {
  const { status } = notification;
  return (
    <li className="relative flex gap-3 border-t border-line-subtle px-5 pt-[13px] pb-3 first:border-t-0">
      <KindIcon notification={notification} />
      <div className="min-w-0 flex-1">
        <Link
          href={`/tariflar/${notification.planId}/${notification.teacherId}`}
          onClick={() => onOpen(notification)}
          className="block pr-5 text-body font-semibold text-ink hover:text-brand"
        >
          {notification.title}
        </Link>
        <p className="mt-[5px] text-caption leading-4 text-ink-secondary">{notification.body}</p>
        <div className="mt-[5px] flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-caption font-semibold text-ink">
            {status.tone ? <span className={cn("size-1.5 rounded-full", TONE_DOT[status.tone])} aria-hidden="true" /> : null}
            {status.label}
          </span>
          <span className="text-caption text-ink-secondary">{formatDaysAgo(notification.createdAt)}</span>
          <Button variant="secondary" size="xs" className="ml-auto px-2.5" onClick={() => onAction(notification)}>
            {ACTION_LABEL[notification.action](notification)}
          </Button>
        </div>
      </div>
      {!notification.read ? (
        <span className="absolute top-[19px] right-5 size-1.5 rounded-full bg-action" aria-label="O‘qilmagan" />
      ) : null}
    </li>
  );
}

/** Bell button with the unread count; opens the reminders panel. */
export function NotificationsPopover({ anchorRef }: { anchorRef: RefObject<HTMLElement | null> }) {
  const [tab, setTab] = useState<Tab>("all");
  const [moving, setMoving] = useState<MoveRequest | null>(null);
  const feed = useNotifications();
  const plans = usePlansOverview("default");
  const markRead = useMarkNotificationsRead();

  const unread = (feed.data?.items ?? []).filter((n) => !n.read);
  const count = (t: Tab) => (t === "all" ? unread.length : unread.filter((n) => n.kind === t).length);
  const visible = tab === "all" ? unread : unread.filter((n) => n.kind === tab);
  const unreadCount = feed.data?.unreadCount ?? 0;

  function act(n: PlanNotification) {
    if (n.action === "extend") return notReady();
    setMoving({ teacherId: n.teacherId, teacherName: n.teacherName, suggested: n.targetPlanId ?? "pro" });
  }

  return (
    <>
      <Popover.Root>
        <Popover.Trigger
          className="flex items-center gap-2 rounded-xs text-ink-secondary outline-none hover:text-ink focus-visible:ring-3 focus-visible:ring-ring/40"
          aria-label={`Bildirishnomalar: ${unreadCount} ta o‘qilmagan`}
        >
          <Bell className="size-3.5" strokeWidth={1.75} />
          <span className="text-caption font-semibold text-ink">{unreadCount}</span>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Backdrop className="fixed inset-0 z-40 bg-scrim-light transition-opacity duration-150 data-starting-style:opacity-0 data-ending-style:opacity-0" />
          <Popover.Positioner anchor={anchorRef} side="bottom" align="end" sideOffset={8} alignOffset={24} className="z-50">
            <Popover.Popup
              className={cn(
                "flex max-h-[min(677px,calc(100dvh-80px))] w-110 flex-col rounded-xl border border-line bg-surface shadow-lg outline-none",
                "transition-[opacity,scale] duration-150 data-starting-style:scale-95 data-starting-style:opacity-0",
                "data-ending-style:scale-95 data-ending-style:opacity-0"
              )}
            >
              <header className="border-b border-line px-5 pt-5 pb-3.5">
                <div className="flex items-center gap-2">
                  <Popover.Title className="text-title text-ink">Bildirishnomalar</Popover.Title>
                  <span className="text-caption text-ink-secondary">{unreadCount} yangi</span>
                  {unreadCount > 0 ? (
                    <button
                      type="button"
                      onClick={() => markRead.mutate(unread.map((n) => n.id))}
                      className="ml-auto rounded-xs text-caption font-semibold text-ink outline-none hover:text-brand focus-visible:ring-3 focus-visible:ring-ring/40"
                    >
                      Hammasi o‘qildi
                    </button>
                  ) : null}
                  <Popover.Close
                    aria-label="Yopish"
                    className={cn(
                      "-mr-1 grid size-[30px] place-items-center rounded-md bg-subtle text-ink-secondary hover:bg-track hover:text-ink",
                      unreadCount === 0 && "ml-auto"
                    )}
                  >
                    <X className="size-3.5" strokeWidth={2} />
                  </Popover.Close>
                </div>
                <div role="tablist" aria-label="Turi" className="mt-3 flex gap-1.5">
                  {TABS.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      role="tab"
                      aria-selected={t.value === tab}
                      onClick={() => setTab(t.value)}
                      className={cn(
                        "h-[26px] rounded-md px-2.5 text-caption transition-colors",
                        t.value === tab ? "bg-inverse text-ink-inverse" : "bg-subtle text-ink hover:bg-track"
                      )}
                    >
                      {t.label} ({count(t.value)})
                    </button>
                  ))}
                </div>
              </header>

              {visible.length ? (
                <ul role="tabpanel" className="min-h-0 flex-1 overflow-y-auto">
                  {visible.map((n) => (
                    <Item key={n.id} notification={n} onAction={act} onOpen={(item) => markRead.mutate([item.id])} />
                  ))}
                </ul>
              ) : (
                <div role="tabpanel" className="flex h-47 flex-col items-center justify-center px-5 text-center">
                  <p className="text-title text-ink">O‘qilmagan bildirishnomalar yo‘q</p>
                  <p className="mt-2.5 text-caption text-ink-secondary">
                    Barcha to‘lov va limit eslatmalari ko‘rib chiqilgan.
                  </p>
                </div>
              )}

              {visible.length ? (
                <footer className="flex items-center justify-between border-t border-line px-5 py-3.5 text-caption">
                  <span className="text-ink-secondary">
                    Eslatma: to‘lovdan {PAYMENT_REMINDER_DAYS.join(" va ")} kun oldin, limit{" "}
                    {Math.round(LIMIT_WARNING_SHARE * 100)}% da
                  </span>
                  <button type="button" onClick={notReady} className="font-semibold text-ink hover:text-brand">
                    Sozlash
                  </button>
                </footer>
              ) : null}
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>

      <MoveTeacherDialog request={moving} plans={plans.data?.plans ?? []} onClose={() => setMoving(null)} />
    </>
  );
}
