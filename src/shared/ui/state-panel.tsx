"use client";

import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { Panel } from "@/shared/ui/panel";

export function LoadErrorPanel({
  title,
  onRetry,
  retrying,
  className,
}: {
  title: string;
  onRetry: () => void;
  retrying: boolean;
  className?: string;
}) {
  return (
    <StatePanel
      tone="danger"
      badge="Ulanish xatosi"
      title={title}
      description="Server bilan aloqa uzildi. Iltimos, sahifani qayta yuklang."
      className={className}
      action={
        <Button onClick={onRetry} disabled={retrying}>
          {retrying ? "Yuklanmoqda..." : "Qayta urinish"}
        </Button>
      }
    />
  );
}

/** Centered empty / error message inside a card. */
export function StatePanel({
  badge,
  tone = "neutral",
  title,
  description,
  action,
  className,
}: {
  badge: string;
  tone?: "neutral" | "danger";
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <Panel
      aria-label={badge}
      className={cn("flex min-h-140 flex-1 flex-col items-center justify-center px-6 text-center", className)}
    >
      {tone === "danger" ? (
        <span className="flex items-center gap-1.5 text-caption font-medium text-ink">
          <span className="size-1.5 -translate-y-1 rounded-full bg-danger" aria-hidden="true" />
          {badge}
        </span>
      ) : (
        <span className="rounded-full border border-line bg-surface px-3 py-[5px] text-caption text-ink">{badge}</span>
      )}
      <h2 role={tone === "danger" ? "alert" : undefined} className="mt-3 text-title-lg text-ink">
        {title}
      </h2>
      <p className="mt-3 text-body text-ink-secondary">{description}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </Panel>
  );
}
