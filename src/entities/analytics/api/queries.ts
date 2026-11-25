"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { DemoScenario } from "@/shared/api/demo-scenario";
import type { DashboardPeriod } from "../model/types";
import { analyticsApi } from "./analytics-api";

export const analyticsKeys = {
  all: ["analytics"] as const,
  summary: (scenario: DemoScenario) => [...analyticsKeys.all, "summary", scenario] as const,
  trends: (period: DashboardPeriod, scenario: DemoScenario) =>
    [...analyticsKeys.all, "trends", period, scenario] as const,
};

export function useDashboardSummary(scenario: DemoScenario) {
  return useQuery({
    queryKey: analyticsKeys.summary(scenario),
    queryFn: ({ signal }) => analyticsApi.getSummary(scenario, signal),
  });
}

export function useDashboardTrends(period: DashboardPeriod, scenario: DemoScenario) {
  return useQuery({
    queryKey: analyticsKeys.trends(period, scenario),
    queryFn: ({ signal }) => analyticsApi.getTrends(period, scenario, signal),
    // Keep the previous period on screen while the next one loads — no flash.
    placeholderData: keepPreviousData,
  });
}
