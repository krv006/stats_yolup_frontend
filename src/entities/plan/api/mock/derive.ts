import { daysUntil, formatDate, isoAddDays, todayIso } from "@/shared/lib/format";
import {
  LIMIT_WARNING_SHARE,
  PAYMENT_REMINDER_DAYS,
  TRIAL_REMINDER_DAYS,
  priceLabel,
  upgradeTarget,
} from "../../lib/plan-meta";
import {
  PAID_PLANS,
  type AttentionItem,
  type NotificationFeed,
  type NotificationKind,
  type PaidPlanId,
  type Plan,
  type PlanId,
  type PlanNotification,
  type PlansOverview,
  type PlanTeacher,
  type TeacherActivity,
  type TeacherDetail,
} from "../../model/types";
import { db, type PlanRow, type TeacherRow } from "./db";

/** Payments due within this many days show up in "needs attention today". */
const PAYMENT_ATTENTION_DAYS = 5;

export function planRow(id: PlanId): PlanRow {
  const row = db.plans.find((plan) => plan.id === id);
  if (!row) throw new Error(`Noma’lum tarif: ${id}`);
  return row;
}

export function teacherRow(id: string): TeacherRow {
  const row = db.teachers.find((t) => t.id === id);
  if (!row) throw new Error("O‘qituvchi topilmadi.");
  return row;
}

const sum = <T,>(items: T[], pick: (item: T) => number) => items.reduce((acc, item) => acc + pick(item), 0);

export function toPlanTeacher(row: TeacherRow): PlanTeacher {
  return {
    id: row.id,
    name: row.name,
    subject: row.subject,
    phone: row.phone,
    planId: row.planId,
    groups: row.groups.length,
    students: sum(row.groups, (g) => g.students),
    hoursTaught: sum(row.groups, (g) => g.hoursTaught),
    lessonsCount: sum(row.groups, (g) => g.lessonsCount),
    activeUntil: row.activeUntil,
    trialEndsAt: row.trialEndsAt,
    trialDaysLeft: row.trialEndsAt ? daysUntil(row.trialEndsAt) : null,
  };
}

export function buildPlan(row: PlanRow): Plan {
  const teachers = db.teachers.filter((t) => t.planId === row.id).map(toPlanTeacher);
  const isDemo = row.id === "demo";
  return {
    ...row,
    stats: {
      teacherCount: teachers.length,
      activeGroups: sum(teachers, (t) => t.groups),
      students: sum(teachers, (t) => t.students),
      hoursTaught: sum(teachers, (t) => t.hoursTaught),
      revenueMonthly: teachers.length * row.priceMonthly,
      activeTrials: isDemo ? teachers.filter((t) => (t.trialDaysLeft ?? 0) > 0).length : 0,
      conversionRate: isDemo ? db.history.demoConversionRate : null,
    },
  };
}

/* ── Limits ─────────────────────────────────────────────────── */

type LimitHit =
  | { type: "groups"; used: number; max: number }
  | { type: "students"; used: number; max: number; pct: number };

function limitHit(teacher: PlanTeacher, row: PlanRow): LimitHit | null {
  const { maxGroups, maxStudents } = row.limits;
  if (maxGroups != null && teacher.groups >= maxGroups) return { type: "groups", used: teacher.groups, max: maxGroups };
  if (maxStudents != null && teacher.students / maxStudents >= LIMIT_WARNING_SHARE) {
    return { type: "students", used: teacher.students, max: maxStudents, pct: Math.round((teacher.students / maxStudents) * 100) };
  }
  return null;
}

/* ── Attention ("today") ────────────────────────────────────── */

function buildAttention(): AttentionItem[] {
  const items: AttentionItem[] = [];
  for (const row of db.teachers) {
    const teacher = toPlanTeacher(row);
    const plan = planRow(row.planId);
    const base = { teacherId: teacher.id, teacherName: teacher.name, planId: plan.id };

    if (plan.id === "demo") {
      const left = teacher.trialDaysLeft ?? 0;
      items.push({
        ...base,
        id: `demo-${teacher.id}`,
        kind: "demo",
        detail: `Demo, ${teacher.subject} — ${teacher.students} / ${plan.limits.maxStudents ?? "∞"} student`,
        status:
          left <= 0
            ? { label: "Muddati tugagan", tone: "danger" }
            : { label: `${left} kun qoldi`, tone: left <= 2 ? "danger" : "demo" },
      });
      continue;
    }

    const hit = limitHit(teacher, plan);
    if (hit) {
      items.push({
        ...base,
        id: `limit-${teacher.id}`,
        kind: "limit",
        detail:
          hit.type === "groups"
            ? `${plan.name}, ${teacher.subject} — ${hit.used} / ${hit.max} guruh to‘lgan`
            : `${plan.name}, ${teacher.subject} — ${hit.used} / ${hit.max} student`,
        status:
          hit.type === "groups"
            ? { label: "100% limit", tone: "danger" }
            : { label: `${hit.pct}% limit`, tone: hit.pct >= 100 ? "danger" : "warning" },
      });
    }

    if (teacher.activeUntil) {
      const left = daysUntil(teacher.activeUntil);
      if (left <= PAYMENT_ATTENTION_DAYS) {
        items.push({
          ...base,
          id: `payment-${teacher.id}`,
          kind: "payment",
          detail: `${plan.name}, ${teacher.subject} — ${formatDate(teacher.activeUntil)} gacha`,
          status:
            left <= 0
              ? { label: "To‘lov kechikdi", tone: "danger" }
              : { label: `${left} kun qoldi`, tone: left <= 1 ? "danger" : "warning" },
        });
      }
    }
  }
  return items;
}

/* ── Notifications ──────────────────────────────────────────── */

/** The latest reminder threshold already reached, e.g. 7 or 3 days before. */
function reachedThreshold(left: number, thresholds: readonly number[]): number | null {
  const reached = thresholds.filter((t) => left <= t);
  return reached.length ? Math.min(...reached) : null;
}

const KIND_ORDER: NotificationKind[] = ["payment", "demo", "limit"];

function buildNotifications(): PlanNotification[] {
  const items: Array<Omit<PlanNotification, "read">> = [];

  for (const row of db.teachers) {
    const teacher = toPlanTeacher(row);
    const plan = planRow(row.planId);
    const base = { teacherId: teacher.id, teacherName: teacher.name, planId: plan.id };

    if (plan.id === "demo" && row.trialEndsAt) {
      const left = daysUntil(row.trialEndsAt);
      const target = recommendedPlan(teacher);
      if (left <= 0) {
        items.push({
          ...base,
          id: `demo-${teacher.id}-${row.trialEndsAt}-ended`,
          kind: "demo",
          expired: true,
          title: `Demo tugadi — ${teacher.name}`,
          body: `Muddat ${formatDate(row.trialEndsAt)} da tugagan. O‘qituvchi yangi dars ocha olmaydi.`,
          status: { label: "Tugagan", tone: null },
          createdAt: row.trialEndsAt,
          action: "convert",
          targetPlanId: target,
        });
        continue;
      }
      const threshold = reachedThreshold(left, TRIAL_REMINDER_DAYS);
      if (threshold == null) continue;
      items.push({
        ...base,
        id: `demo-${teacher.id}-${row.trialEndsAt}-${threshold}`,
        kind: "demo",
        expired: false,
        title: `Demo tugayapti — ${teacher.name}`,
        body: `Bepul demo ${formatDate(row.trialEndsAt)} da tugaydi. Pullik tarifga o‘tkazish vaqti.`,
        status: { label: `${left} kun qoldi`, tone: left <= 2 ? "danger" : "demo" },
        createdAt: isoAddDays(row.trialEndsAt, -threshold),
        action: "convert",
        targetPlanId: target,
      });
      continue;
    }

    if (row.activeUntil) {
      const left = daysUntil(row.activeUntil);
      const threshold = reachedThreshold(left, PAYMENT_REMINDER_DAYS);
      if (threshold != null) {
        items.push({
          ...base,
          id: `payment-${teacher.id}-${row.activeUntil}-${threshold}`,
          kind: "payment",
          expired: false,
          title: `To‘lov muddati tugayapti — ${teacher.name}`,
          body: `${plan.name} tarif (${priceLabel(plan)}) ${formatDate(row.activeUntil)} da tugaydi.`,
          status:
            left <= 0
              ? { label: "To‘lov kechikdi", tone: "danger" }
              : { label: `${left} kun qoldi`, tone: left <= 3 ? "danger" : "warning" },
          createdAt: isoAddDays(row.activeUntil, -threshold),
          action: "extend",
          targetPlanId: null,
        });
      }
    }

    const hit = limitHit(teacher, plan);
    if (hit) {
      const target = upgradeTarget(plan.id);
      items.push({
        ...base,
        id: `limit-${teacher.id}-${hit.type}-${hit.used}`,
        kind: "limit",
        expired: false,
        title: hit.type === "groups" ? `Guruh limiti to‘ldi — ${teacher.name}` : `Student limiti — ${teacher.name}`,
        body:
          hit.type === "groups"
            ? `${plan.name}: ${hit.used} / ${hit.max} guruh band. Yangi guruh ochib bo‘lmaydi.`
            : `${plan.name}: ${hit.used} / ${hit.max} student (${hit.pct}%). To‘lsa yangi student qo‘shib bo‘lmaydi.`,
        status:
          hit.type === "groups"
            ? { label: "100% limit", tone: "danger" }
            : { label: `${hit.pct}% band`, tone: hit.pct >= 100 ? "danger" : "warning" },
        createdAt: todayIso(),
        action: "upgrade",
        targetPlanId: target,
      });
    }
  }

  return items
    .sort(
      (a, b) =>
        b.createdAt.localeCompare(a.createdAt) || KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind)
    )
    .map((item) => ({ ...item, read: db.readNotifications.has(item.id) }));
}

export function buildNotificationFeed(): NotificationFeed {
  const items = buildNotifications();
  return { items, unreadCount: items.filter((n) => !n.read).length };
}

/* ── Teacher detail ─────────────────────────────────────────── */

/** Cheapest paid plan whose limits fit the teacher's current load. */
function recommendedPlan(teacher: PlanTeacher): PaidPlanId {
  const fits = PAID_PLANS.find((id) => {
    const { maxStudents, maxGroups } = planRow(id).limits;
    return (maxStudents == null || teacher.students <= maxStudents) && (maxGroups == null || teacher.groups <= maxGroups);
  });
  return fits ?? "business";
}

function activityOf(row: TeacherRow): TeacherActivity | null {
  const enrolled = sum(row.lessons, (l) => l.enrolled);
  if (!enrolled) return null;
  const share = sum(row.lessons, (l) => l.attended) / enrolled;
  if (share >= 0.85) return "high";
  return share >= 0.6 ? "medium" : "low";
}

export function buildTeacherDetail(id: string): TeacherDetail {
  const row = teacherRow(id);
  const teacher = toPlanTeacher(row);
  const plan = buildPlan(planRow(row.planId));
  const isDemo = plan.id === "demo";

  return {
    teacher,
    plan,
    joinedAt: row.joinedAt,
    source: row.source,
    groups: row.groups.map((g, i) => ({
      id: `${row.id}-g${i + 1}`,
      name: g.name,
      schedule: g.schedule,
      students: g.students,
      capacity: plan.limits.groupSize,
      hoursTaught: g.hoursTaught,
      lessonsCount: g.lessonsCount,
      lastLessonAt: g.lastLessonAt,
    })),
    recentLessons: row.lessons.map((l, i) => ({ id: `${row.id}-l${i + 1}`, ...l })),
    trial:
      isDemo && row.trialStartedAt && row.trialEndsAt
        ? {
            startedAt: row.trialStartedAt,
            endsAt: row.trialEndsAt,
            totalDays: daysUntil(row.trialEndsAt) - daysUntil(row.trialStartedAt),
            usedDays: Math.max(0, -daysUntil(row.trialStartedAt)),
            daysLeft: daysUntil(row.trialEndsAt),
          }
        : null,
    subscription:
      !isDemo && row.activatedAt && row.activeUntil
        ? {
            activatedAt: row.activatedAt,
            paidUntil: row.activeUntil,
            daysLeft: daysUntil(row.activeUntil),
            monthsPaid: row.monthsPaid,
            totalPaid: row.monthsPaid * plan.priceMonthly,
          }
        : null,
    recommendedPlanId: isDemo ? recommendedPlan(teacher) : null,
    activity: isDemo ? activityOf(row) : null,
  };
}

/* ── Overview ───────────────────────────────────────────────── */

export function buildOverview(): PlansOverview {
  const plans = db.plans.map(buildPlan);
  const total = (pick: (p: Plan) => number) => sum(plans, pick);
  return {
    plans,
    summary: {
      teachersTotal: total((p) => p.stats.teacherCount),
      teachersDelta: db.history.teachersDelta,
      activeStudents: total((p) => p.stats.students),
      capacityUsage: db.history.capacityUsage,
      hoursTotal: total((p) => p.stats.hoursTaught),
      hoursPerMonth: db.history.hoursPerMonth,
      mrr: total((p) => p.stats.revenueMonthly),
      mrrDelta: db.history.mrrDelta,
    },
    attention: buildAttention(),
    topTeachers: db.teachers
      .filter((t) => t.planId !== "demo")
      .map(toPlanTeacher)
      .sort((a, b) => b.hoursTaught - a.hoursTaught)
      .slice(0, 3)
      .map(({ id, name, planId, groups, students, hoursTaught }) => ({ id, name, planId, groups, students, hoursTaught })),
  };
}
