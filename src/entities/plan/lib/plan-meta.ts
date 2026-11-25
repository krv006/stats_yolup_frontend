import { formatUsd } from "@/shared/lib/format";
import type { Plan, PlanId, PlanLimits } from "../model/types";

/** Fixed identity per plan — never re-assigned by rank or filter. */
export const PLAN_DOT: Record<PlanId, string> = {
  start: "bg-plan-start",
  pro: "bg-plan-pro",
  business: "bg-plan-business",
  demo: "bg-plan-demo",
};

export const PLAN_TITLE: Record<PlanId, string> = {
  start: "Start tarif",
  pro: "Pro tarif",
  business: "Business tarif",
  demo: "Demo (bepul sinov)",
};

/** "$30 / oy" or "7 kun bepul" */
export function priceLabel(plan: Pick<Plan, "priceMonthly" | "trialDays">): string {
  return plan.trialDays != null ? `${plan.trialDays} kun bepul` : `${formatUsd(plan.priceMonthly)} / oy`;
}

/** Header chips: "Maks. 150 student", "Cheklanmagan guruh", … */
export function limitLabels(planId: PlanId, limits: PlanLimits): string[] {
  if (planId === "demo") {
    return [
      `${limits.maxGroups ?? "∞"} ta guruh`,
      `${limits.maxStudents ?? "∞"} tagacha student`,
    ];
  }
  return [
    limits.maxStudents != null ? `Maks. ${limits.maxStudents} student` : "Cheklanmagan student",
    limits.maxGroups != null ? `Maks. ${limits.maxGroups} guruh` : "Cheklanmagan guruh",
    limits.groupSize != null ? `Guruhda ${limits.groupSize} tagacha` : "Guruh hajmi cheklanmagan",
  ];
}

/** Capacity share, 0–100, or null when unlimited. */
export function capacityPct(used: number, perTeacher: number | null, teachers = 1): number | null {
  if (perTeacher == null) return null;
  const cap = perTeacher * teachers;
  return cap === 0 ? 0 : Math.round((used / cap) * 100);
}

/** ≥85% of a limit is shown in the warning colour. */
export const CAPACITY_WARN_PCT = 85;
