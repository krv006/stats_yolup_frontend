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
  /** Demo: ISO date the trial ends. */
  trialEndsAt: string | null;
  /** Demo: days left in the trial; ≤ 0 means expired. */
  trialDaysLeft: number | null;
}

export type LeadSource = "instagram" | "telegram" | "referral" | "other";

export interface TeacherGroup {
  id: string;
  name: string;
  /** Human schedule, e.g. "Du, Cho — 18:00". */
  schedule: string;
  students: number;
  /** Seats per group; null when the plan does not cap group size. */
  capacity: number | null;
  hoursTaught: number;
  lessonsCount: number;
  lastLessonAt: string | null;
}

export interface TeacherLesson {
  id: string;
  title: string;
  /** Local ISO date-time, e.g. "2026-11-21T18:00". */
  startsAt: string;
  durationMinutes: number;
  attended: number;
  enrolled: number;
}

export interface TeacherTrial {
  startedAt: string;
  endsAt: string;
  totalDays: number;
  usedDays: number;
  daysLeft: number;
}

export interface TeacherSubscription {
  activatedAt: string;
  paidUntil: string;
  daysLeft: number;
  /** Lifetime paid months and amount (USD). */
  monthsPaid: number;
  totalPaid: number;
}

export type TeacherActivity = "high" | "medium" | "low";

export interface TeacherDetail {
  teacher: PlanTeacher;
  plan: Plan;
  joinedAt: string;
  source: LeadSource;
  groups: TeacherGroup[];
  /** Demo only: lessons taught during the trial, newest first. */
  recentLessons: TeacherLesson[];
  trial: TeacherTrial | null;
  subscription: TeacherSubscription | null;
  /** Demo only: cheapest paid plan that fits the teacher's current load. */
  recommendedPlanId: PaidPlanId | null;
  /** Demo only: from average lesson attendance. */
  activity: TeacherActivity | null;
}

export type NotificationKind = "payment" | "demo" | "limit";
export type NotificationAction = "extend" | "convert" | "upgrade";

export interface PlanNotification {
  /** Stable per event: a new reminder for the same teacher gets a new id. */
  id: string;
  kind: NotificationKind;
  /** Demo trial already over (shown muted). */
  expired: boolean;
  teacherId: string;
  teacherName: string;
  planId: PlanId;
  title: string;
  body: string;
  status: { label: string; tone: AttentionTone | null };
  createdAt: string;
  action: NotificationAction;
  /** For "upgrade" / "convert": the suggested target plan. */
  targetPlanId: PaidPlanId | null;
  read: boolean;
}

export interface NotificationFeed {
  items: PlanNotification[];
  unreadCount: number;
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
  trialDays: number;
  source: LeadSource;
  /** Send login credentials to the teacher by SMS. */
  sendSms: boolean;
}

export interface MoveTeacherInput {
  teacherId: string;
  planId: PaidPlanId;
  /** Prepaid subscription length. */
  months: number;
}
