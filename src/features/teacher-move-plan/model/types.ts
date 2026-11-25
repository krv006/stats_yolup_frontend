import type { PaidPlanId, PlanId } from "@/entities/plan";

export interface MoveRequest {
  teacherId: string;
  teacherName: string;
  from: PlanId;
  suggested: PaidPlanId;
}

/** Upgrade path: Demo → Pro, Start → Pro, Pro → Business. */
export function nextPlan(from: PlanId): PaidPlanId | null {
  if (from === "demo" || from === "start") return "pro";
  if (from === "pro") return "business";
  return null;
}
