import type { DemoScenario } from "@/shared/api/demo-scenario";
import { mockDelay, mockRespond } from "@/shared/api/mock";
import { daysUntil, formatDate, isoInDays } from "@/shared/lib/format";
import type {
  AttentionItem,
  NewDemoInput,
  PaidPlanId,
  Plan,
  PlanId,
  PlansOverview,
  PlanSettingsInput,
  PlanTeacher,
} from "../model/types";
import { db, type PlanRow } from "./mock-db";

const PAYMENT_WARNING_DAYS = 7;
const CAPACITY_WARNING = 0.9;

function planRow(id: PlanId): PlanRow {
  const row = db.plans.find((plan) => plan.id === id);
  if (!row) throw new Error(`Noma’lum tarif: ${id}`);
  return row;
}

function buildPlan(row: PlanRow): Plan {
  const teachers = db.teachers.filter((t) => t.planId === row.id);
  const sum = (pick: (t: PlanTeacher) => number) => teachers.reduce((acc, t) => acc + pick(t), 0);
  const isDemo = row.id === "demo";
  return {
    ...row,
    stats: {
      teacherCount: teachers.length,
      activeGroups: sum((t) => t.groups),
      students: sum((t) => t.students),
      hoursTaught: sum((t) => t.hoursTaught),
      revenueMonthly: teachers.length * row.priceMonthly,
      activeTrials: isDemo ? teachers.filter((t) => (t.trialDaysLeft ?? 0) > 0).length : 0,
      conversionRate: isDemo ? db.history.demoConversionRate : null,
    },
  };
}

function demoAttention(teacher: PlanTeacher, row: PlanRow): AttentionItem {
  const left = teacher.trialDaysLeft ?? 0;
  return {
    id: `demo-${teacher.id}`,
    kind: "demo",
    teacherId: teacher.id,
    teacherName: teacher.name,
    planId: "demo",
    detail: `Demo, ${teacher.subject} — ${teacher.students} / ${row.limits.maxStudents ?? "∞"} student`,
    status:
      left <= 0
        ? { label: "Muddati tugagan", tone: "danger" }
        : { label: `${left} kun qoldi`, tone: left <= 2 ? "danger" : "demo" },
  };
}

function limitAttention(teacher: PlanTeacher, row: PlanRow): AttentionItem | null {
  const { maxGroups, maxStudents } = row.limits;
  const base = { kind: "limit" as const, teacherId: teacher.id, teacherName: teacher.name, planId: row.id, id: `limit-${teacher.id}` };
  if (maxGroups != null && teacher.groups >= maxGroups) {
    return {
      ...base,
      detail: `${row.name}, ${teacher.subject} — ${teacher.groups} / ${maxGroups} guruh to‘lgan`,
      status: { label: "100% limit", tone: "danger" },
    };
  }
  if (maxStudents != null && teacher.students / maxStudents >= CAPACITY_WARNING) {
    const pct = Math.round((teacher.students / maxStudents) * 100);
    return {
      ...base,
      detail: `${row.name}, ${teacher.subject} — ${teacher.students} / ${maxStudents} student`,
      status: { label: `${pct}% limit`, tone: pct >= 100 ? "danger" : "warning" },
    };
  }
  return null;
}

function paymentAttention(teacher: PlanTeacher, row: PlanRow): AttentionItem | null {
  if (!teacher.activeUntil) return null;
  const left = daysUntil(teacher.activeUntil);
  if (left > PAYMENT_WARNING_DAYS) return null;
  return {
    id: `payment-${teacher.id}`,
    kind: "payment",
    teacherId: teacher.id,
    teacherName: teacher.name,
    planId: row.id,
    detail: `${row.name}, ${teacher.subject} — ${formatDate(teacher.activeUntil)} gacha`,
    status:
      left <= 0
        ? { label: "To‘lov kechikdi", tone: "danger" }
        : { label: `${left} kun qoldi`, tone: left <= 1 ? "danger" : "warning" },
  };
}

function buildAttention(): AttentionItem[] {
  const items: AttentionItem[] = [];
  for (const teacher of db.teachers) {
    const row = planRow(teacher.planId);
    if (teacher.planId === "demo") {
      items.push(demoAttention(teacher, row));
      continue;
    }
    const limit = limitAttention(teacher, row);
    if (limit) items.push(limit);
    const payment = paymentAttention(teacher, row);
    if (payment) items.push(payment);
  }
  return items;
}

function buildOverview(): PlansOverview {
  const plans = db.plans.map(buildPlan);
  const total = (pick: (p: Plan) => number) => plans.reduce((acc, p) => acc + pick(p), 0);
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
      .sort((a, b) => b.hoursTaught - a.hoursTaught)
      .slice(0, 3)
      .map(({ id, name, planId, groups, students, hoursTaught }) => ({ id, name, planId, groups, students, hoursTaught })),
  };
}

export const plansApi = {
  getOverview(scenario: DemoScenario, signal?: AbortSignal) {
    return mockRespond(scenario, buildOverview, { signal });
  },

  getTeachers(planId: PlanId, scenario: DemoScenario, signal?: AbortSignal) {
    return mockRespond(scenario, () => db.teachers.filter((t) => t.planId === planId), {
      empty: () => [],
      signal,
    });
  },

  async updatePlans(changes: Partial<Record<PlanId, PlanSettingsInput>>) {
    await mockDelay();
    for (const [id, input] of Object.entries(changes)) {
      Object.assign(planRow(id as PlanId), {
        priceMonthly: input.priceMonthly,
        trialDays: input.trialDays,
        limits: { ...input.limits },
      });
    }
  },

  async moveTeacher(teacherId: string, planId: PaidPlanId) {
    await mockDelay();
    const teacher = db.teachers.find((t) => t.id === teacherId);
    if (!teacher) throw new Error("O‘qituvchi topilmadi.");
    if (teacher.planId === "demo") {
      teacher.trialDaysLeft = null;
      teacher.activeUntil = isoInDays(30);
    }
    teacher.planId = planId;
    return structuredClone(teacher);
  },

  async createDemo(input: NewDemoInput) {
    await mockDelay();
    const teacher: PlanTeacher = {
      id: `t-new-${db.nextId++}`,
      ...input,
      planId: "demo",
      groups: 0,
      students: 0,
      hoursTaught: 0,
      lessonsCount: 0,
      activeUntil: null,
      trialDaysLeft: planRow("demo").trialDays,
    };
    db.teachers.push(teacher);
    return structuredClone(teacher);
  },

  async sendPaymentReminder(teacherId: string) {
    await mockDelay();
    if (!db.teachers.some((t) => t.id === teacherId)) throw new Error("O‘qituvchi topilmadi.");
  },
};
