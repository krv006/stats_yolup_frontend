import { isoInDays as day } from "@/shared/lib/format";
import type { LeadSource, PlanId, PlanLimits } from "../../model/types";

/**
 * In-memory stand-in for the backend. Everything the UI shows (plan
 * stats, attention items, notifications, teacher details) is *derived*
 * from these rows in ./derive.ts, so writes stay consistent everywhere.
 * Dates are relative to today so the mock never goes stale.
 */

export interface PlanRow {
  id: PlanId;
  name: string;
  priceMonthly: number;
  trialDays: number | null;
  limits: PlanLimits;
}

export interface GroupRow {
  name: string;
  schedule: string;
  students: number;
  hoursTaught: number;
  lessonsCount: number;
  lastLessonAt: string | null;
}

export interface LessonRow {
  title: string;
  startsAt: string;
  durationMinutes: number;
  attended: number;
  enrolled: number;
}

export interface TeacherRow {
  id: string;
  name: string;
  subject: string;
  phone: string;
  planId: PlanId;
  source: LeadSource;
  joinedAt: string;
  groups: GroupRow[];
  /** Demo: lessons taught during the trial, newest first. */
  lessons: LessonRow[];
  /** Paid: start of the current billing period and its end. */
  activatedAt: string | null;
  activeUntil: string | null;
  /** Paid: lifetime prepaid months. */
  monthsPaid: number;
  trialStartedAt: string | null;
  trialEndsAt: string | null;
}

/** Teacher-facing profile kept beside the subscription row. */
export interface ProfileRow {
  username: string;
  /** Rating counts for 5★ … 1★. */
  ratings: [number, number, number, number, number];
  comments: Array<{ author: string; rating: number; text: string }>;
  testCreation: boolean;
  scheduledLessons: number;
  cancelledLessons: number;
}

/** Teacher sign-ups waiting for an admin to approve them. */
export interface ApplicantRow {
  id: string;
  name: string;
  username: string;
  subject: string;
  phone: string;
  /** Local ISO date-time. */
  appliedAt: string;
}

const SCHEDULES = [
  "Du, Cho, Ju — 08:00",
  "Se, Pa, Sha — 14:00",
  "Ya — 11:00",
  "Du, Cho — 19:00",
  "Sha — 16:00",
  "Se, Pa — 17:00",
];

/** Splits `total` into `n` integer parts, larger parts first. */
function split(total: number, n: number): number[] {
  return Array.from({ length: n }, (_, i) => Math.floor(total / n) + (i < total % n ? 1 : 0));
}

/** Plausible groups that add up to the teacher's totals. */
function groupsFor(subject: string, count: number, students: number, hours: number, lessons: number): GroupRow[] {
  const s = split(students, count);
  const h = split(hours, count);
  const l = split(lessons, count);
  return Array.from({ length: count }, (_, i) => ({
    name: count === 1 ? subject : `${subject} — ${i + 1}-guruh`,
    schedule: SCHEDULES[i % SCHEDULES.length]!,
    students: s[i]!,
    hoursTaught: h[i]!,
    lessonsCount: l[i]!,
    lastLessonAt: day(-(i % 3) - 1),
  }));
}

/** `count` trial lessons, newest first, one every other day. */
function trialLessons(count: number, enrolled: number, startedDaysAgo: number): LessonRow[] {
  return Array.from({ length: count }, (_, i) => {
    const n = count - i;
    return {
      title: `${n}-dars`,
      startsAt: `${day(-startedDaysAgo + (n - 1) * 2)}T18:00`,
      durationMinutes: 80,
      attended: Math.max(0, enrolled - (i % 2)),
      enrolled,
    };
  });
}

function paid(
  base: Pick<TeacherRow, "id" | "name" | "subject" | "phone" | "planId" | "source">,
  groups: GroupRow[],
  dates: { joined: number; activated: number; until: number; months: number }
): TeacherRow {
  return {
    ...base,
    joinedAt: day(dates.joined),
    groups,
    lessons: [],
    activatedAt: day(dates.activated),
    activeUntil: day(dates.until),
    monthsPaid: dates.months,
    trialStartedAt: null,
    trialEndsAt: null,
  };
}

function demo(
  base: Pick<TeacherRow, "id" | "name" | "subject" | "phone" | "source">,
  groups: GroupRow[],
  lessons: LessonRow[],
  trial: { started: number; ends: number }
): TeacherRow {
  return {
    ...base,
    planId: "demo",
    joinedAt: day(trial.started),
    groups,
    lessons,
    activatedAt: null,
    activeUntil: null,
    monthsPaid: 0,
    trialStartedAt: day(trial.started),
    trialEndsAt: day(trial.ends),
  };
}

interface MockDb {
  plans: PlanRow[];
  teachers: TeacherRow[];
  /** By teacher id; teachers without one get a generated default. */
  profiles: Record<string, ProfileRow>;
  applicants: ApplicantRow[];
  /** Notification ids the admin has already seen. */
  readNotifications: Set<string>;
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
    // Featured on the teachers page (kept first so the roster reads like the design).
    paid({ id: "t-ak", name: "Aziza Karimova", subject: "Ingliz tili", phone: "+998901110022", planId: "pro", source: "telegram" },
      groupsFor("Ingliz tili", 6, 42, 60, 40), { joined: -130, activated: -10, until: 20, months: 4 }),
    paid({ id: "t-jr", name: "Jasur Rahimov", subject: "Ingliz tili (IELTS)", phone: "+998907774122", planId: "pro", source: "telegram" },
      [
        { name: "IELTS Intensive 7.0", schedule: "Du, Cho, Ju — 08:00", students: 38, hoursTaught: 64, lessonsCount: 32, lastLessonAt: day(-2) },
        { name: "IELTS Foundation", schedule: "Se, Pa, Sha — 14:00", students: 42, hoursTaught: 58, lessonsCount: 29, lastLessonAt: day(-1) },
        { name: "Speaking Practice", schedule: "Ya — 11:00", students: 25, hoursTaught: 30, lessonsCount: 20, lastLessonAt: day(-1) },
        { name: "CEFR B2 tayyorlov", schedule: "Du, Cho — 19:00", students: 19, hoursTaught: 26, lessonsCount: 17, lastLessonAt: day(-4) },
        { name: "Grammar Bootcamp", schedule: "Sha — 16:00", students: 11, hoursTaught: 12, lessonsCount: 8, lastLessonAt: day(-1) },
      ],
      { joined: -95, activated: -3, until: 27, months: 3 }),
    paid({ id: "t-hu", name: "Husanboy Urunov", subject: "Matematika", phone: "+998935550101", planId: "start", source: "instagram" },
      groupsFor("Matematika", 2, 30, 27, 18), { joined: -75, activated: -8, until: 22, months: 2 }),
    paid({ id: "t-sq", name: "Shohruhbek Qodirjonov", subject: "Dasturlash", phone: "+998977771212", planId: "business", source: "referral" },
      groupsFor("Dasturlash", 4, 96, 104, 52), { joined: -160, activated: -15, until: 15, months: 5 }),
    demo({ id: "t-mo", name: "Mukhammaddiyor Odiljonov", subject: "Fizika", phone: "+998901239876", source: "other" },
      groupsFor("Fizika", 1, 9, 4, 3), trialLessons(3, 9, 1), { started: -1, ends: 6 }),

    // Start
    paid({ id: "t-dk", name: "Dilnoza Karimova", subject: "Matematika", phone: "+998901234567", planId: "start", source: "instagram" },
      groupsFor("Matematika", 3, 46, 64, 48), { joined: -120, activated: -12, until: 18, months: 4 }),
    paid({ id: "t-ry", name: "Rustam Yo‘ldoshev", subject: "Fizika", phone: "+998935551020", planId: "start", source: "referral" },
      groupsFor("Fizika", 2, 64, 48, 36), { joined: -90, activated: -26, until: 4, months: 3 }),
    paid({ id: "t-my", name: "Malika Yusupova", subject: "Ona tili", phone: "+998977003311", planId: "start", source: "telegram" },
      groupsFor("Ona tili", 1, 10, 26, 20), { joined: -60, activated: -27, until: 3, months: 2 }),
    paid({ id: "t-ji", name: "Javohir Ismoilov", subject: "Informatika", phone: "+998909871234", planId: "start", source: "other" },
      groupsFor("Informatika", 1, 8, 20, 15), { joined: -40, activated: -4, until: 26, months: 1 }),

    // Pro
    paid({ id: "t-be", name: "Bekzod Ergashev", subject: "Python dasturlash", phone: "+998998451076", planId: "pro", source: "instagram" },
      groupsFor("Python", 4, 93, 128, 64), { joined: -150, activated: -25, until: 5, months: 5 }),
    paid({ id: "t-nt", name: "Nigora Tursunova", subject: "Rus tili", phone: "+998913026615", planId: "pro", source: "referral" },
      groupsFor("Rus tili", 3, 73, 60, 45), { joined: -70, activated: -11, until: 19, months: 2 }),
    paid({ id: "t-sn", name: "Shahzoda Nematova", subject: "Kimyo", phone: "+998941189043", planId: "pro", source: "instagram" },
      groupsFor("Kimyo", 2, 55, 58, 38), { joined: -100, activated: -25, until: 35, months: 4 }),

    // Business
    paid({ id: "t-aq", name: "Aziz Qodirov", subject: "Matematika (DTM)", phone: "+998901112233", planId: "business", source: "referral" },
      groupsFor("DTM Matematika", 4, 142, 210, 120), { joined: -200, activated: -20, until: 40, months: 7 }),
    paid({ id: "t-ku", name: "Kamola Usmonova", subject: "Ingliz tili", phone: "+998946662211", planId: "business", source: "telegram" },
      groupsFor("Ingliz tili", 3, 98, 112, 70), { joined: -80, activated: -24, until: 6, months: 3 }),
    paid({ id: "t-sa", name: "Sardor Aliyev", subject: "Biologiya", phone: "+998933334455", planId: "business", source: "instagram" },
      groupsFor("Biologiya", 2, 68, 62, 41), { joined: -60, activated: -29, until: 31, months: 2 }),

    // Demo
    demo({ id: "t-os", name: "Otabek Sobirov", subject: "Tarix (DTM)", phone: "+998909154430", source: "instagram" },
      [{ name: "Tarix (DTM tayyorlov)", schedule: "Du, Cho — 18:00", students: 14, hoursTaught: 4, lessonsCount: 3, lastLessonAt: day(-2) }],
      [
        { title: "3-dars: Amir Temur va Temuriylar davri", startsAt: `${day(-2)}T18:00`, durationMinutes: 80, attended: 14, enrolled: 15 },
        { title: "2-dars: Xorazmshohlar davlati tarixi", startsAt: `${day(-4)}T18:00`, durationMinutes: 80, attended: 14, enrolled: 15 },
        { title: "1-dars: Kirish va DTM test tahlili", startsAt: `${day(-5)}T18:00`, durationMinutes: 80, attended: 13, enrolled: 15 },
      ],
      { started: -5, ends: 2 }),
    demo({ id: "t-mx", name: "Madina Xolmatova", subject: "Ingliz tili", phone: "+998994761852", source: "telegram" },
      groupsFor("Ingliz tili", 1, 12, 3, 2), trialLessons(2, 12, 2), { started: -2, ends: 5 }),
    demo({ id: "t-sm", name: "Sevara Mirzayeva", subject: "Biologiya", phone: "+998953307126", source: "referral" },
      groupsFor("Biologiya", 1, 8, 1, 1), trialLessons(1, 8, 1), { started: -1, ends: 6 }),
    demo({ id: "t-un", name: "Ulug‘bek Nazarov", subject: "Fizika", phone: "+998936672011", source: "other" },
      groupsFor("Fizika", 1, 11, 6, 4), trialLessons(4, 11, 14), { started: -14, ends: -7 }),
  ],

  profiles: {
    "t-ak": {
      username: "teacher1",
      ratings: [5, 1, 0, 0, 0],
      comments: [
        { author: "Toshmat Boltayev", rating: 5, text: "Zo‘r! Darslar juda tushunarli va jonli o‘tilmoqda." },
        { author: "Malika Karimova", rating: 5, text: "Grammatika sodda misollar bilan tushuntiriladi." },
        { author: "Javohir Aliyev", rating: 4, text: "Uyga vazifa tahlili juda foydali bo‘ldi." },
      ],
      testCreation: true,
      scheduledLessons: 3,
      cancelledLessons: 0,
    },
    "t-jr": { username: "jasur_r", ratings: [18, 5, 1, 0, 0], comments: [], testCreation: true, scheduledLessons: 6, cancelledLessons: 2 },
    "t-hu": { username: "husanboy", ratings: [5, 4, 0, 0, 0], comments: [], testCreation: true, scheduledLessons: 2, cancelledLessons: 0 },
    "t-sq": { username: "shohruh", ratings: [28, 3, 0, 0, 0], comments: [], testCreation: true, scheduledLessons: 4, cancelledLessons: 1 },
    "t-mo": { username: "mukhammad", ratings: [0, 0, 0, 0, 0], comments: [], testCreation: false, scheduledLessons: 1, cancelledLessons: 0 },
  },

  applicants: [
    { id: "a-dj", name: "Dostonbek Jurayev", username: "DJ2007", subject: "Matematika va Geometriya", phone: "+998901002007", appliedAt: `${day(0)}T11:43` },
    { id: "a-sv", name: "Sardorbek Valiyev", username: "sardor_v", subject: "Fizika (DTM tayyorlov)", phone: "+998935002020", appliedAt: `${day(-1)}T18:20` },
  ],

  readNotifications: new Set(),

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
