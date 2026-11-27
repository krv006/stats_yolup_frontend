"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { DemoScenario } from "@/shared/api/demo-scenario";
import { complaintsApi } from "./complaints-api";

export const complaintKeys = {
  all: ["complaints"] as const,
  list: (scenario: DemoScenario) => [...complaintKeys.all, "list", scenario] as const,
};

export function useComplaints(scenario: DemoScenario) {
  return useQuery({
    queryKey: complaintKeys.list(scenario),
    queryFn: ({ signal }) => complaintsApi.getComplaints(scenario, signal),
  });
}

export function useInvalidateComplaints() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: complaintKeys.all });
}
