import type { DemoScenario } from "@/shared/api/demo-scenario";
import { mockRespond } from "@/shared/api/mock";
import type { DashboardPeriod, DashboardSummary, DashboardTrends } from "../model/types";
import { EMPTY_SUMMARY, EMPTY_TRENDS, MOCK_SUMMARY, MOCK_TRENDS } from "./mock-data";

export const analyticsApi = {
  getSummary(scenario: DemoScenario, signal?: AbortSignal): Promise<DashboardSummary> {
    return mockRespond(scenario, () => MOCK_SUMMARY, { empty: () => EMPTY_SUMMARY, signal });
  },
  getTrends(period: DashboardPeriod, scenario: DemoScenario, signal?: AbortSignal): Promise<DashboardTrends> {
    return mockRespond(scenario, () => MOCK_TRENDS[period], { empty: () => EMPTY_TRENDS(period), signal });
  },
};
