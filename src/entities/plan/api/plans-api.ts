import type { DemoScenario } from "@/shared/api/demo-scenario";
import { mockDelay, mockRespond } from "@/shared/api/mock";
import { isoAddDays, isoAddMonths, todayIso } from "@/shared/lib/format";
import type { MoveTeacherInput, NewDemoInput, PlanId, PlanSettingsInput } from "../model/types";
import { db } from "./mock/db";
import {
  buildNotificationFeed,
  buildOverview,
  buildPlan,
  buildRoster,
  buildTeacherDetail,
  buildTeacherStats,
  planRow,
  profileOf,
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
    db.profiles[row.id] = {
      username: name.split(" ")[0]!.toLowerCase(),
      ratings: [0, 0, 0, 0, 0],
      comments: [],
      testCreation: false,
      scheduledLessons: 0,
      cancelledLessons: 0,
    };
    return toPlanTeacher(row);
  },

  getRoster(scenario: DemoScenario, signal?: AbortSignal) {
    return mockRespond(scenario, buildRoster, { empty: () => ({ applicants: [], teachers: [] }), signal });
  },

  getTeacherStats(id: string, scenario: DemoScenario, signal?: AbortSignal) {
    return mockRespond(scenario, () => buildTeacherStats(id), { signal });
  },

  /** Approves a sign-up: the teacher starts on the standard free demo. */
  async approveApplicant(applicantId: string) {
    await mockDelay();
    const index = db.applicants.findIndex((a) => a.id === applicantId);
    if (index < 0) throw new Error("Ariza topilmadi.");
    const [applicant] = db.applicants.splice(index, 1);
    const today = todayIso();
    const id = `t-new-${db.nextId++}`;
    db.teachers.push({
      id,
      name: applicant!.name,
      phone: applicant!.phone,
      subject: applicant!.subject,
      planId: "demo",
      source: "other",
      joinedAt: today,
      groups: [],
      lessons: [],
      activatedAt: null,
      activeUntil: null,
      monthsPaid: 0,
      trialStartedAt: today,
      trialEndsAt: isoAddDays(today, planRow("demo").trialDays ?? 7),
    });
    db.profiles[id] = {
      username: applicant!.username,
      ratings: [0, 0, 0, 0, 0],
      comments: [],
      testCreation: false,
      scheduledLessons: 0,
      cancelledLessons: 0,
    };
    return { name: applicant!.name, username: applicant!.username };
  },

  async setTestCreation(teacherId: string, enabled: boolean) {
    await mockDelay();
    const row = teacherRow(teacherId);
    db.profiles[row.id] = { ...profileOf(row), testCreation: enabled };
    return { name: row.name, enabled };
  },

  async sendPaymentReminder(teacherId: string) {
    await mockDelay();
    teacherRow(teacherId);
  },
};
