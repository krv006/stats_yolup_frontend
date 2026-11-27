import type { DemoScenario } from "@/shared/api/demo-scenario";
import { mockDelay, mockRespond } from "@/shared/api/mock";
import { isoAddDays, isoAddMonths, todayIso } from "@/shared/lib/format";
import type { MoveTeacherInput, NewDemoInput, PlanId, PlanSettingsInput } from "../model/types";
import { db } from "./mock/db";
import {
  buildNotificationFeed,
  buildOverview,
  buildPlan,
  buildTeacherDetail,
  planRow,
  teacherRow,
  toPlanTeacher,
} from "./mock/derive";

/**
 * Plan & subscription endpoints. Backed by the in-memory mock in ./mock;
 * swap each body for an HTTP call when the backend is ready.
 */
export const plansApi = {
  getOverview(scenario: DemoScenario, signal?: AbortSignal) {
    return mockRespond(scenario, buildOverview, { signal });
  },

  getTeachers(planId: PlanId, scenario: DemoScenario, signal?: AbortSignal) {
    return mockRespond(scenario, () => db.teachers.filter((t) => t.planId === planId).map(toPlanTeacher), {
      empty: () => [],
      signal,
    });
  },

  getTeacher(teacherId: string, scenario: DemoScenario, signal?: AbortSignal) {
    return mockRespond(scenario, () => buildTeacherDetail(teacherId), { signal });
  },

  getNotifications(signal?: AbortSignal) {
    return mockRespond("default", buildNotificationFeed, { signal });
  },

  async markNotificationsRead(ids: string[]) {
    await mockDelay();
    for (const id of ids) db.readNotifications.add(id);
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

  /** Starts a prepaid subscription today on the chosen plan. */
  async moveTeacher({ teacherId, planId, months }: MoveTeacherInput) {
    await mockDelay();
    const row = teacherRow(teacherId);
    const today = todayIso();
    Object.assign(row, {
      planId,
      activatedAt: today,
      activeUntil: isoAddMonths(today, months),
      monthsPaid: row.monthsPaid + months,
      trialStartedAt: null,
      trialEndsAt: null,
    });
    return { teacher: toPlanTeacher(row), plan: buildPlan(planRow(planId)) };
  },

  async extendTrial(teacherId: string, days: number) {
    await mockDelay();
    const row = teacherRow(teacherId);
    if (row.planId !== "demo" || !row.trialEndsAt) throw new Error("Faqat demo muddatini uzaytirish mumkin.");
    // An expired trial restarts from today rather than from the past end date.
    const from = row.trialEndsAt < todayIso() ? todayIso() : row.trialEndsAt;
    row.trialEndsAt = isoAddDays(from, days);
    return toPlanTeacher(row);
  },

  async createDemo({ name, phone, subject, trialDays, source }: NewDemoInput) {
    await mockDelay();
    const today = todayIso();
    const row = {
      id: `t-new-${db.nextId++}`,
      name,
      phone,
      subject,
      planId: "demo" as const,
      source,
      joinedAt: today,
      groups: [],
      lessons: [],
      activatedAt: null,
      activeUntil: null,
      monthsPaid: 0,
      trialStartedAt: today,
      trialEndsAt: isoAddDays(today, trialDays),
    };
    db.teachers.push(row);
    return toPlanTeacher(row);
  },

  async sendPaymentReminder(teacherId: string) {
    await mockDelay();
    teacherRow(teacherId);
  },
};
