"use client";

import { useState } from "react";
import {
  useDashboardSummary,
  useDashboardTrends,
  type DashboardPeriod,
  type DashboardSummary,
  type DashboardTrends,
  PeriodSwitch,
} from "@/entities/analytics";
import type { DemoScenario } from "@/shared/api/demo-scenario";
import { formatCount, formatPercent, formatRating } from "@/shared/lib/format";
import { useOnlineStatus } from "@/shared/lib/use-online-status";
import { KpiStrip, type Kpi } from "./kpi-strip";
import { DashboardSkeleton, EmptyState, ErrorState, OfflineBanner } from "./states";
import { TopCoursesPanel, TopTeachersPanel } from "./top-lists";
import { EnrollmentPanel, LessonsPanel } from "./trend-panels";

function buildKpis(summary: DashboardSummary, trends: DashboardTrends): Kpi[] {
  const lastIndex = trends.labels.length - 1;
  return [
    {
      label: "Faol o‘quvchilar",
      value: formatCount(summary.activeStudents),
      hint: summary.newStudentsThisMonth ? `+${summary.newStudentsThisMonth} bu oyda` : undefined,
    },
    { label: "Faol o‘qituvchilar", value: formatCount(summary.activeTeachers) },
    { label: "Faol kurslar", value: formatCount(summary.activeCourses) },
    { label: "O‘tkazilgan darslar", value: formatCount(trends.lessonsCompleted[lastIndex] ?? 0) },
    { label: "O‘rtacha davomat", value: formatPercent(trends.attendanceRate[lastIndex]) },
    { label: "Dars reytingi", value: formatRating(summary.avgRating) },
  ];
}

function isEmpty(summary: DashboardSummary, trends: DashboardTrends) {
  return (
    summary.activeStudents === 0 &&
    summary.topCourses.length === 0 &&
    summary.topTeachers.length === 0 &&
    trends.labels.length === 0
  );
}

export function DashboardPage({ userName, scenario }: { userName: string; scenario: DemoScenario }) {
  const [period, setPeriod] = useState<DashboardPeriod>("month");
  const online = useOnlineStatus();
  const summary = useDashboardSummary(scenario);
  const trends = useDashboardTrends(period, scenario);

  function renderBody() {
    // Cached data wins over errors: offline users keep seeing the last snapshot.
    if (summary.data && trends.data) {
      if (isEmpty(summary.data, trends.data)) return <EmptyState />;
      return (
        <div className="flex flex-col gap-4.5">
          <KpiStrip items={buildKpis(summary.data, trends.data)} />
          <div className="grid gap-x-4 gap-y-4.5 lg:grid-cols-2">
            <EnrollmentPanel trends={trends.data} />
            <LessonsPanel trends={trends.data} />
          </div>
          <div className="grid gap-x-4 gap-y-4.5 lg:grid-cols-2">
            <TopCoursesPanel courses={summary.data.topCourses} />
            <TopTeachersPanel teachers={summary.data.topTeachers} />
          </div>
        </div>
      );
    }
    if (summary.isError || trends.isError) {
      return (
        <ErrorState
          retrying={summary.isFetching || trends.isFetching}
          onRetry={() => {
            void summary.refetch();
            void trends.refetch();
          }}
        />
      );
    }
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-1 flex-col gap-4.5">
      {!online ? <OfflineBanner /> : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-display text-ink-strong">Xush kelibsiz, {userName}</h1>
        <PeriodSwitch value={period} onChange={setPeriod} />
      </div>

      {renderBody()}
    </div>
  );
}
