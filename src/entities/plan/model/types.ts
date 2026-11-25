export type PlanId = "start" | "pro" | "business" | "demo";
export type PaidPlanId = Exclude<PlanId, "demo">;

export const PLAN_ORDER: PlanId[] = ["start", "pro", "business", "demo"];
export const PAID_PLANS: PaidPlanId[] = ["start", "pro", "business"];

/** `null` means unlimited. Student/group limits are per teacher. */
export interface PlanLimits {
  maxStudents: number | null;
  maxGroups: number | null;
  groupSize: number | null;
}

export interface PlanStats {
  teacherCount: number;
  activeGroups: number;
  students: number;
  hoursTaught: number;
  revenueMonthly: number;
  /** Demo only: teachers whose trial has not expired. */
  activeTrials: number;
  /** Demo only: share of past trials that converted to a paid plan, %. */
  conversionRate: number | null;
}

export interface Plan {
  id: PlanId;
  name: string;
  /** USD per teacher per month; 0 for demo. */
  priceMonthly: number;
  /** Demo only. */
  trialDays: number | null;
  limits: PlanLimits;
  stats: PlanStats;
}

export interface PlanTeacher {
  id: string;
  name: string;
  subject: string;
  /** E.164, e.g. +998907774122 */
  phone: string;
  planId: PlanId;
  groups: number;
  students: number;
  hoursTaught: number;
  lessonsCount: number;
  /** Paid plans: ISO date the subscription is paid until. */
  activeUntil: string | null;
  /** Demo: days left in the trial; ≤ 0 means expired. */
  trialDaysLeft: number | null;
}

export type AttentionKind = "demo" | "limit" | "payment";
export type AttentionTone = "danger" | "warning" | "demo";

export interface AttentionItem {
  id: string;
  kind: AttentionKind;
  teacherId: string;
  teacherName: string;
  planId: PlanId;
  detail: string;
  status: { label: string; tone: AttentionTone };
}

export interface TopTeacher {
  id: string;
  name: string;
  planId: PlanId;
  groups: number;
  students: number;
  hoursTaught: number;
}

export interface PlansOverview {
  plans: Plan[];
  summary: {
    teachersTotal: number;
    teachersDelta: number;
    activeStudents: number;
    capacityUsage: number;
    hoursTotal: number;
    hoursPerMonth: number;
    mrr: number;
    mrrDelta: number;
  };
  attention: AttentionItem[];
  topTeachers: TopTeacher[];
}

export interface PlanSettingsInput {
  priceMonthly: number;
  trialDays: number | null;
  limits: PlanLimits;
}

export interface NewDemoInput {
  name: string;
  phone: string;
  subject: string;
}
