"use client";

import { useState } from "react";
import {
  useClientHealth,
  useServerHistory,
  useSystemHealth,
  type ClientHealthUser,
  type ClientRange,
  type ServerRange,
} from "@/entities/system";
import type { DemoScenario } from "@/shared/api/demo-scenario";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { Panel } from "@/shared/ui/panel";
import { Skeleton } from "@/shared/ui/skeleton";
import { StatePanel } from "@/shared/ui/state-panel";
import { ClientHealthPanel } from "./client-health-panel";
import { DeviceReportDialog } from "./device-report-dialog";
import { ServerPanel } from "./server-panel";
import { VideoPanel } from "./video-panel";

const CPU_ALERT = 80;
const MEMORY_ALERT = 85;

export function SystemHealthPage({ scenario }: { scenario: DemoScenario }) {
  const [serverRange, setServerRange] = useState<ServerRange>(24);
  const [clientRange, setClientRange] = useState<ClientRange>(24);
  const [device, setDevice] = useState<ClientHealthUser | null>(null);

  const health = useSystemHealth(scenario);
  const history = useServerHistory(serverRange, scenario);
  const clients = useClientHealth(clientRange, scenario);

  const current = health.data?.server.current;
  const stressed = current != null && (current.cpuPercent >= CPU_ALERT || current.memoryPercent >= MEMORY_ALERT);
  const empty = health.data != null && current == null && health.data.videos.totalVideos === 0;

  function body() {
    if (health.isError && !health.data) {
      return (
        <StatePanel
          tone="danger"
          badge="Ulanish xatosi"
          title="Konteyner telemetriyasini olib bo‘lmadi"
          description="Prometheus / Docker monitoring agentiga ulanishda xatolik."
          action={
            <Button disabled={health.isFetching} onClick={() => void health.refetch()}>
              {health.isFetching ? "Ulanmoqda..." : "Qayta ulanish"}
            </Button>
          }
        />
      );
    }
    if (!health.data) return <HealthSkeleton />;
    if (empty) {
      return (
        <StatePanel
          badge="Bo‘sh holat"
          title="Hozircha saqlangan video yozuvlar va server o‘lchovlari yo‘q"
          description="Birinchi jonli dars yozib olingach, hajm va konteyner ko‘rsatkichlari chiqadi."
        />
      );
    }
    return (
      <div className="flex flex-col gap-[18px]">
        {current ? (
          <ServerPanel status={health.data.server} history={history.data} range={serverRange} onRangeChange={setServerRange} />
        ) : null}
        <div className="grid items-start gap-x-[17px] gap-y-[18px] xl:grid-cols-[minmax(0,1fr)_370px]">
          {clients.data ? (
            <ClientHealthPanel data={clients.data} range={clientRange} onRangeChange={setClientRange} onOpenUser={setDevice} />
          ) : (
            <Panel className="h-82 p-5"><Skeleton className="h-4 w-60" /></Panel>
          )}
          <VideoPanel data={health.data.videos} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-[17px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-display text-ink-strong">Server, video ombor va mijoz salomatligi</h1>
        <span className="flex items-center gap-1.5 text-caption font-semibold text-ink">
          <span className={cn("size-1.5 rounded-full", stressed ? "bg-warning" : "bg-success")} aria-hidden="true" />
          {stressed ? "Yuklama yuqori" : "Barcha tizimlar barqaror"}
        </span>
      </div>
      {body()}
      <DeviceReportDialog user={device} summary={clients.data} onClose={() => setDevice(null)} />
    </div>
  );
}

function HealthSkeleton() {
  return (
    <Panel aria-busy="true" aria-label="Yuklanmoqda" className="flex min-h-140 flex-1 flex-col justify-center gap-11 px-12">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-65" />
          <Skeleton className="h-4 w-45" />
          <Skeleton className="h-4 w-55" />
        </div>
      ))}
    </Panel>
  );
}
