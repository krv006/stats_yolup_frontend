"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { DemoScenario } from "@/shared/api/demo-scenario";
import { supportApi } from "./support-api";

export const supportKeys = {
  all: ["support"] as const,
  tickets: (scenario: DemoScenario) => [...supportKeys.all, "tickets", scenario] as const,
};

export function useSupportTickets(scenario: DemoScenario) {
  return useQuery({
    queryKey: supportKeys.tickets(scenario),
    queryFn: ({ signal }) => supportApi.getTickets(scenario, signal),
  });
}

/** For features: refresh every support read after a write. */
export function useInvalidateSupport() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: supportKeys.all });
}
