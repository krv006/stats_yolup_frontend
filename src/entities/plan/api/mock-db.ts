import { isoInDays as inDays } from "@/shared/lib/format";
import type { PlanId, PlanLimits, PlanTeacher } from "../model/types";

// Dates are relative to today (inDays) so the mock never goes stale.

/**
 * In-memory stand-in for the backend. Plan stats, attention items and
 * rankings are *derived* from these rows by the mock API, so edits and
 * plan moves stay consistent everywhere.
 */

export interface PlanRow {
  id: PlanId;
  name: string;
  priceMonthly: number;
  trialDays: number | null;
  limits: PlanLimits;
}

interface MockDb {
  plans: PlanRow[];
  teachers: PlanTeacher[];
  history: { teachersDelta: number; capacityUsage: number; hoursPerMonth: number; mrrDelta: number; demoConversionRate: number };
  nextId: number;
}

export const db: MockDb = {
  plans: [
    { id: "start", name: "Start", priceMonthly: 15, trialDays: null, limits: { maxStudents: 70, maxGroups: 3, groupSize: 30 } },
    { id: "pro", name: "Pro", priceMonthly: 30, trialDays: null, limits: { maxStudents: 150, maxGroups: 7, groupSize: 45 } },
    { id: "business", name: "Business", priceMonthly: 50, trialDays: null, limits: { maxStudents: null, maxGroups: null, groupSize: 45 } },
    { id: "demo", name: "Demo", priceMonthly: 0, trialDays: 7, limits: { maxStudents: 15, maxGroups: 1, groupSize: 15 } },
  ],

  teachers: [
    // Start — 7 groups, 128 students, 158 h
    { id: "t-dk", name: "Dilnoza Karimova", subject: "Matematika", phone: "+998901234567", planId: "start", groups: 3, students: 46, hoursTaught: 64, lessonsCount: 48, activeUntil: inDays(18), trialDaysLeft: null },
    { id: "t-ry", name: "Rustam Yo‘ldoshev", subject: "Fizika", phone: "+998935551020", planId: "start", groups: 2, students: 64, hoursTaught: 48, lessonsCount: 36, activeUntil: inDays(3), trialDaysLeft: null },
    { id: "t-mt", name: "Malika Tursunova", subject: "Ona tili", phone: "+998977003311", planId: "start", groups: 1, students: 10, hoursTaught: 26, lessonsCount: 20, activeUntil: inDays(22), trialDaysLeft: null },
    { id: "t-ji", name: "Javohir Ismoilov", subject: "Informatika", phone: "+998909871234", planId: "start", groups: 1, students: 8, hoursTaught: 20, lessonsCount: 15, activeUntil: inDays(26), trialDaysLeft: null },
    // Pro — 14 groups, 356 students, 436 h
    { id: "t-jr", name: "Jasur Rahimov", subject: "Ingliz tili (IELTS)", phone: "+998907774122", planId: "pro", groups: 5, students: 135, hoursTaught: 190, lessonsCount: 106, activeUntil: inDays(27), trialDaysLeft: null },
    { id: "t-be", name: "Bekzod Ergashev", subject: "Python dasturlash", phone: "+998998451076", planId: "pro", groups: 4, students: 93, hoursTaught: 128, lessonsCount: 64, activeUntil: inDays(5), trialDaysLeft: null },
    { id: "t-nt", name: "Nigora Tursunova", subject: "Rus tili", phone: "+998913026615", planId: "pro", groups: 3, students: 73, hoursTaught: 60, lessonsCount: 45, activeUntil: inDays(19), trialDaysLeft: null },
    { id: "t-sn", name: "Shahzoda Nematova", subject: "Kimyo", phone: "+998941189043", planId: "pro", groups: 2, students: 55, hoursTaught: 58, lessonsCount: 38, activeUntil: inDays(35), trialDaysLeft: null },
    // Business — 9 groups, 308 students, 384 h
    { id: "t-aq", name: "Aziz Qodirov", subject: "Matematika (DTM)", phone: "+998901112233", planId: "business", groups: 4, students: 142, hoursTaught: 210, lessonsCount: 120, activeUntil: inDays(40), trialDaysLeft: null },
    { id: "t-ku", name: "Kamola Usmonova", subject: "Ingliz tili", phone: "+998946662211", planId: "business", groups: 3, students: 98, hoursTaught: 112, lessonsCount: 70, activeUntil: inDays(1), trialDaysLeft: null },
    { id: "t-sa", name: "Sardor Aliyev", subject: "Biologiya", phone: "+998933334455", planId: "business", groups: 2, students: 68, hoursTaught: 62, lessonsCount: 41, activeUntil: inDays(31), trialDaysLeft: null },
    // Demo — 4 groups, 45 students, 14 h
    { id: "t-os", name: "Otabek Sobirov", subject: "Tarix (DTM)", phone: "+998909154430", planId: "demo", groups: 1, students: 14, hoursTaught: 4, lessonsCount: 3, activeUntil: null, trialDaysLeft: 2 },
    { id: "t-mx", name: "Madina Xolmatova", subject: "Ingliz tili", phone: "+998994761852", planId: "demo", groups: 1, students: 12, hoursTaught: 3, lessonsCount: 2, activeUntil: null, trialDaysLeft: 5 },
    { id: "t-sm", name: "Sevara Mirzayeva", subject: "Biologiya", phone: "+998953307126", planId: "demo", groups: 1, students: 8, hoursTaught: 1, lessonsCount: 1, activeUntil: null, trialDaysLeft: 6 },
    { id: "t-un", name: "Ulug‘bek Nazarov", subject: "Fizika", phone: "+998936672011", planId: "demo", groups: 1, students: 11, hoursTaught: 6, lessonsCount: 4, activeUntil: null, trialDaysLeft: -1 },
  ],

  /** Figures the backend tracks historically — not derivable from current rows. */
  history: {
    teachersDelta: 3,
    capacityUsage: 61,
    hoursPerMonth: 66,
    mrrDelta: 60,
    demoConversionRate: 75,
  },

  nextId: 1,
};
