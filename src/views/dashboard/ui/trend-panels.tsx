import type { DashboardTrends } from "@/entities/analytics";
import { formatCount } from "@/shared/lib/format";
import { ChartLegend, GroupedBarChart } from "@/shared/ui/grouped-bar-chart";
import { Panel, PanelHeader } from "@/shared/ui/panel";

const last = <T,>(values: T[]): T | undefined => values[values.length - 1];

export function EnrollmentPanel({ trends }: { trends: DashboardTrends }) {
  const latestScore = last(trends.quizAvgScore);

  return (
    <Panel className="flex min-h-[246px] flex-col px-5 pt-5 pb-[25px]">
      <PanelHeader
        title="Yangi o‘quvchilar va test natijalari"
        aside={
          <ChartLegend
            items={[
              { label: "Yangi o‘quvchi", colorClass: "bg-chart-primary" },
              {
                label: latestScore != null ? `Test (${latestScore} ball)` : "Test",
                colorClass: "bg-chart-compare",
              },
            ]}
          />
        }
      />
      <GroupedBarChart
        description="Har davrdagi yangi o‘quvchilar soni va o‘rtacha test bali"
        headroom={1.065}
        labels={trends.labels}
        series={[
          { key: "enroll", label: "Yangi o‘quvchi", colorClass: "bg-chart-primary", values: trends.enrollments },
          { key: "quiz", label: "Test bali", colorClass: "bg-chart-compare", values: trends.quizAvgScore, domainMax: 100 },
        ]}
        tooltip={(i) => {
          const score = trends.quizAvgScore[i];
          return {
            title: trends.fullLabels[i] ?? trends.labels[i] ?? "",
            body: `${formatCount(trends.enrollments[i] ?? 0)} ta yangi o‘quvchi  |  Test: ${score ?? "—"} ball`,
          };
        }}
      />
    </Panel>
  );
}

export function LessonsPanel({ trends }: { trends: DashboardTrends }) {
  const completed = last(trends.lessonsCompleted) ?? 0;
  const cancelled = last(trends.lessonsCancelled) ?? 0;
  // Both series share one scale so cancelled stays honest relative to completed.
  const domainMax = Math.max(1, ...trends.lessonsCompleted);

  return (
    <Panel className="flex min-h-[246px] flex-col px-5 pt-5 pb-[25px]">
      <PanelHeader
        title="Darslar holati"
        aside={
          <ChartLegend
            items={[
              { label: `O‘tkazilgan (${formatCount(completed)})`, colorClass: "bg-chart-positive" },
              { label: `Bekor (${formatCount(cancelled)})`, colorClass: "bg-chart-negative" },
            ]}
          />
        }
      />
      <GroupedBarChart
        description="Har davrda o‘tkazilgan va bekor qilingan darslar soni"
        plotHeight={104}
        labels={trends.labels}
        series={[
          { key: "done", label: "O‘tkazilgan", colorClass: "bg-chart-positive", values: trends.lessonsCompleted, domainMax, width: 16 },
          { key: "cancel", label: "Bekor", colorClass: "bg-chart-negative", values: trends.lessonsCancelled, domainMax, width: 10, minHeight: 4, pill: true },
        ]}
        tooltip={(i) => ({
          title: trends.fullLabels[i] ?? trends.labels[i] ?? "",
          body: `${formatCount(trends.lessonsCompleted[i] ?? 0)} ta o‘tkazildi  |  ${formatCount(trends.lessonsCancelled[i] ?? 0)} ta bekor`,
        })}
      />
    </Panel>
  );
}
