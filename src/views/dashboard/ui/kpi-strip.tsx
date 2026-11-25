import { Panel } from "@/shared/ui/panel";

export interface Kpi {
  label: string;
  value: string;
  hint?: string;
}

export function KpiStrip({ items }: { items: Kpi[] }) {
  return (
    <Panel className="grid grid-cols-2 pb-5 sm:grid-cols-3 xl:grid-cols-6">
      {items.map((kpi) => (
        <dl
          key={kpi.label}
          className="flex h-[83px] flex-col border-line px-4.5 pt-[17px] not-first:border-l"
        >
          <dt className="text-caption text-ink">{kpi.label}</dt>
          <dd className="mt-1 text-numeric font-semibold text-ink">{kpi.value}</dd>
          {kpi.hint ? <dd className="mt-[5px] text-caption text-ink-secondary">{kpi.hint}</dd> : null}
        </dl>
      ))}
    </Panel>
  );
}
