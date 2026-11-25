"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/cn";

export interface BarSeries {
  key: string;
  label: string;
  /** Tailwind background class, e.g. "bg-chart-primary". */
  colorClass: string;
  values: Array<number | null>;
  /** Value mapped to full plot height. Defaults to the series max. */
  domainMax?: number;
  /** Bar width in px. */
  width?: number;
  /** Smallest drawn height so tiny non-zero values stay visible. */
  minHeight?: number;
  /** Fully rounded marker instead of a bar (for small companion values). */
  pill?: boolean;
}

export interface GroupedBarChartProps {
  labels: string[];
  series: BarSeries[];
  /** Accessible summary of what the chart shows. */
  description: string;
  /** Tooltip content for column `index`. */
  tooltip: (index: number) => { title: string; body: string };
  plotHeight?: number;
  /** Space above the tallest bar, as a multiple of the series max. */
  headroom?: number;
}

/**
 * Lightweight grouped bar chart — matches the dashboard design without
 * axis chrome. Each series is scaled to its own domain; exact values are
 * always available via the hover/focus tooltip and the hidden data table.
 */
export function GroupedBarChart({
  labels,
  series,
  description,
  tooltip,
  plotHeight = 100,
  headroom = 1.08,
}: GroupedBarChartProps) {
  const [active, setActive] = useState<number | null>(null);

  const domains = series.map(
    (s) => s.domainMax ?? Math.max(1, ...s.values.map((v) => v ?? 0)) * headroom
  );

  return (
    <figure className="relative -mx-[11px] mt-auto">
      <figcaption className="sr-only">{description}</figcaption>

      <div className="flex" onMouseLeave={() => setActive(null)}>
        {labels.map((label, index) => {
          const tip = tooltip(index);
          const isActive = active === index;
          return (
            <div
              key={`${label}-${index}`}
              tabIndex={0}
              aria-label={`${tip.title}: ${tip.body}`}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
              className="group relative flex flex-1 cursor-default flex-col items-center rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              <div
                className={cn(
                  "flex items-end gap-1 rounded-md px-1.5 transition-colors",
                  isActive && "bg-subtle"
                )}
                style={{ height: plotHeight }}
                aria-hidden="true"
              >
                {series.map((s, si) => {
                  const value = s.values[index] ?? 0;
                  const raw = (value / domains[si]!) * plotHeight;
                  const height = value > 0 ? Math.max(s.minHeight ?? 0, raw) : 0;
                  return (
                    <span
                      key={s.key}
                      className={cn("block transition-[height] duration-300", s.pill ? "rounded-full" : "rounded-xs", s.colorClass)}
                      style={{ width: s.width ?? 14, height }}
                    />
                  );
                })}
              </div>
              <span className="mt-[7px] text-caption text-ink" aria-hidden="true">
                {label}
              </span>

              {isActive ? (
                <div
                  role="tooltip"
                  className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-lg bg-inverse px-3 py-2 whitespace-nowrap shadow-lg"
                >
                  <p className="text-micro text-ink-muted">{tip.title}</p>
                  <p className="mt-0.5 text-caption font-semibold text-ink-inverse">{tip.body}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <table className="sr-only">
        <thead>
          <tr>
            <th scope="col">Davr</th>
            {series.map((s) => (
              <th key={s.key} scope="col">{s.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {labels.map((label, index) => (
            <tr key={`${label}-${index}`}>
              <th scope="row">{label}</th>
              {series.map((s) => (
                <td key={s.key}>{s.values[index] ?? "—"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export function ChartLegend({ items }: { items: Array<{ label: string; colorClass: string }> }) {
  return (
    <ul className="flex items-center gap-4">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5 text-caption text-ink-secondary">
          <span className={cn("size-1.5 rounded-full", item.colorClass)} aria-hidden="true" />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
