import type { PaidPlanId } from "@/entities/plan";

/** Opens the move dialog for a teacher with a pre-selected target plan. */
export interface MoveRequest {
  teacherId: string;
  teacherName: string;
  suggested: PaidPlanId;
}

/** Prepaid subscription lengths offered in the dialog. */
export const SUBSCRIPTION_MONTHS = [1, 3, 6] as const;
