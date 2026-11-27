"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { DemoScenario } from "@/shared/api/demo-scenario";
import type { ClientRange, ServerRange } from "../model/types";
import { systemApi } from "./system-api";

/** The agent reports every 30 min; polling more often just keeps the tab fresh. */
const LIVE_REFRESH_MS = 30_000;

export const systemKeys = {
  all: ["system"] as const,
  health: (scenario: DemoScenario) => [...systemKeys.all, "health", scenario] as const,
  history: (hours: ServerRange, scenario: DemoScenario) => [...systemKeys.all, "history", hours, scenario] as const,
  clients: (hours: ClientRange, scenario: DemoScenario) => [...systemKeys.all, "clients", hours, scenario] as const,
};

export function useSystemHealth(scenario: DemoScenario) {
  return useQuery({
    queryKey: systemKeys.health(scenario),
    queryFn: ({ signal }) => systemApi.getHealth(scenario, signal),
    refetchInterval: LIVE_REFRESH_MS,
  });
}

export function useServerHistory(hours: ServerRange, scenario: DemoScenario) {
  return useQuery({
    queryKey: systemKeys.history(hours, scenario),
    queryFn: ({ signal }) => systemApi.getHistory(hours, scenario, signal),
    placeholderData: keepPreviousData,
  });
}

export function useClientHealth(hours: ClientRange, scenario: DemoScenario) {
  return useQuery({
    queryKey: systemKeys.clients(hours, scenario),
    queryFn: ({ signal }) => systemApi.getClientHealth(hours, scenario, signal),
    placeholderData: keepPreviousData,
  });
}
