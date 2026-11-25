"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { DemoScenario } from "@/shared/api/demo-scenario";
import type { PlanId } from "../model/types";
import { plansApi } from "./plans-api";

export const planKeys = {
  all: ["plans"] as const,
  overview: (scenario: DemoScenario) => [...planKeys.all, "overview", scenario] as const,
  teachers: (planId: PlanId, scenario: DemoScenario) => [...planKeys.all, "teachers", planId, scenario] as const,
};

export function usePlansOverview(scenario: DemoScenario) {
  return useQuery({
    queryKey: planKeys.overview(scenario),
    queryFn: ({ signal }) => plansApi.getOverview(scenario, signal),
  });
}

export function usePlanTeachers(planId: PlanId, scenario: DemoScenario) {
  return useQuery({
    queryKey: planKeys.teachers(planId, scenario),
    queryFn: ({ signal }) => plansApi.getTeachers(planId, scenario, signal),
  });
}

/** For features: refetch every plan read after a write. */
export function useInvalidatePlans() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: planKeys.all });
}
