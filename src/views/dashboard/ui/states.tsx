import { Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import { buttonVariants } from "@/shared/ui/button";
import { Panel } from "@/shared/ui/panel";
import { Skeleton } from "@/shared/ui/skeleton";
import { LoadErrorPanel, StatePanel } from "@/shared/ui/state-panel";

export function EmptyState() {
  return (
    <StatePanel
      badge="Bo‘sh holat"
      title="Hozircha analitika ma’lumotlari yo‘q"
      description="Birinchi o‘qituvchi va guruhlar dars boshlagach, bu yerda grafiklar paydo bo‘ladi."
      action={
        <Link href="/tariflar/demo" className={cn(buttonVariants({ variant: "primary" }), "gap-1")}>
          <Plus className="size-3.5" strokeWidth={2.25} />
          Bepul demo ochish
        </Link>
      }
    />
  );
}

export function ErrorState({ onRetry, retrying }: { onRetry: () => void; retrying: boolean }) {
  return <LoadErrorPanel title="Statistikani yuklab bo‘lmadi" onRetry={onRetry} retrying={retrying} />;
}

export function OfflineBanner() {
  return (
    <div
      role="status"
      className="flex h-[39px] items-center justify-between gap-4 rounded-lg border border-danger-border bg-danger-bg px-4"
    >
      <p className="text-body font-semibold text-danger-fg">
        Internet aloqasi uzildi (Offline). Ma’lumotlar keshdan ko‘rsatilmoqda.
      </p>
      <span className="shrink-0 text-caption text-danger-fg">Qayta ulanmoqda...</span>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-5" aria-busy="true" aria-label="Yuklanmoqda">
      <Panel className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex min-h-[103px] flex-col gap-2.5 border-line-subtle px-5 pt-[18px] not-first:border-l">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-14" />
          </div>
        ))}
      </Panel>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="h-61 p-5"><Skeleton className="h-4 w-56" /></Panel>
        <Panel className="h-61 p-5"><Skeleton className="h-4 w-32" /></Panel>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="h-81 p-5"><Skeleton className="h-4 w-28" /></Panel>
        <Panel className="h-81 p-5"><Skeleton className="h-4 w-36" /></Panel>
      </div>
    </div>
  );
}
