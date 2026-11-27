import { isoInDays as day } from "@/shared/lib/format";
import type {
  ClientHealthUser,
  ClientRange,
  MonitoringHistory,
  MonitoringSample,
  ServerRange,
  TeacherVideoStats,
} from "../model/types";

const TOTAL_MB = 15_986;
const at = (dayOffset: number, time: string) => `${day(dayOffset)}T${time}`;

/** Successive agent readings; each request returns the next one (live feel). */
export const CURRENT_SAMPLES: Array<Omit<MonitoringSample, "createdAt">> = [
  { cpuPercent: 0.4, memoryPercent: 15.8, memoryUsedMb: 2_523, memoryTotalMb: TOTAL_MB },
  { cpuPercent: 2.4, memoryPercent: 22.1, memoryUsedMb: 3_533, memoryTotalMb: TOTAL_MB },
  { cpuPercent: 1.8, memoryPercent: 19.4, memoryUsedMb: 3_101, memoryTotalMb: TOTAL_MB },
  { cpuPercent: 0.2, memoryPercent: 14.9, memoryUsedMb: 2_382, memoryTotalMb: TOTAL_MB },
];
export const LAST_SAMPLE_AT = at(0, "16:06");
export const SAMPLE_INTERVAL_MINUTES = 30;

export const HISTORY: Record<ServerRange, Omit<MonitoringHistory, "hours">> = {
  6: { points: 12, avgCpuPercent: 0.6, peak: { cpuPercent: 3.1, createdAt: at(0, "13:20") } },
  24: { points: 48, avgCpuPercent: 0.4, peak: { cpuPercent: 9.0, createdAt: at(0, "09:50") } },
  72: { points: 144, avgCpuPercent: 0.5, peak: { cpuPercent: 9.0, createdAt: at(0, "09:50") } },
  168: { points: 336, avgCpuPercent: 0.7, peak: { cpuPercent: 12.4, createdAt: at(-4, "19:10") } },
};

const USERS: ClientHealthUser[] = [
  {
    userId: "u-teacher1", username: "teacher1", fullName: "Aziza Karimova", role: "teacher",
    reports: 141, cpuLimitedReports: 1, bandwidthLimitedReports: 0, minFps: 14, minFpsContext: "Ekran ulashish vaqtida",
    lastAt: at(-2, "11:51"), cores: 12, memoryGb: 16, browser: "Chrome 158", os: "Windows 11",
  },
  {
    userId: "u-jasur", username: "jasur_r", fullName: "Jasur Rahimov", role: "teacher",
    reports: 18, cpuLimitedReports: 0, bandwidthLimitedReports: 0, minFps: 30, minFpsContext: null,
    lastAt: at(-1, "18:40"), cores: 8, memoryGb: 16, browser: "Safari 18", os: "macOS",
  },
  {
    userId: "u-ali", username: "ali_student", fullName: "Ali Valiyev", role: "student",
    reports: 8, cpuLimitedReports: 0, bandwidthLimitedReports: 0, minFps: 28, minFpsContext: null,
    lastAt: at(-1, "18:35"), cores: 8, memoryGb: 8, browser: "Chrome 158", os: "Android",
  },
];

/** Longer windows see proportionally more reports from the same devices. */
export function clientUsers(hours: ClientRange): ClientHealthUser[] {
  const factor = hours / 24;
  return USERS.map((u) => ({
    ...u,
    reports: Math.round(u.reports * factor),
    cpuLimitedReports: Math.round(u.cpuLimitedReports * Math.max(1, factor / 2)),
  }));
}

export const VIDEOS: TeacherVideoStats = {
  totalVideos: 46,
  teachers: [
    { teacherId: "t-ak", teacherName: "Aziza Karimova", videoCount: 22, sizeGb: 6.8 },
    { teacherId: "t-jr", teacherName: "Jasur Rahimov", videoCount: 14, sizeGb: 4.2 },
    { teacherId: "t-ny", teacherName: "Nodira Yusupova", videoCount: 10, sizeGb: 3.1 },
  ],
};
