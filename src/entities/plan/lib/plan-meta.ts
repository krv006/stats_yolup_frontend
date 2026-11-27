import { formatUsd } from "@/shared/lib/format";
import type { LeadSource, PaidPlanId, Plan, PlanId, PlanLimits } from "../model/types";

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

/** Upgrade path: Demo → Pro, Start → Pro, Pro → Business; Business is the top. */
export function upgradeTarget(from: PlanId): PaidPlanId | null {
  if (from === "demo" || from === "start") return "pro";
  if (from === "pro") return "business";
  return null;
}

/** Short labels for pickers. */
export const LEAD_SOURCE_LABEL: Record<LeadSource, string> = {
  instagram: "Instagram",
  telegram: "Telegram",
  referral: "Tavsiya orqali",
  other: "Boshqa",
};

/** Longer labels for detail views. */
export const LEAD_SOURCE_DETAIL: Record<LeadSource, string> = {
  instagram: "Instagram reklama",
  telegram: "Telegram",
  referral: "Tavsiya orqali",
  other: "Boshqa",
};

/** Payment reminders go out this many days before the paid period ends. */
export const PAYMENT_REMINDER_DAYS = [7, 3] as const;
/** Trial reminders go out this many days before the demo ends. */
export const TRIAL_REMINDER_DAYS = [5, 2] as const;
/** Share of a limit that triggers a warning. */
export const LIMIT_WARNING_SHARE = 0.9;
