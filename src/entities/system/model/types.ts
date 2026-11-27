/** Shapes follow Edu_Front's monitoring / client-health / storage types. */

export interface MonitoringSample {
  cpuPercent: number;
  memoryPercent: number;
  memoryUsedMb: number;
  memoryTotalMb: number;
  /** Local ISO date-time, e.g. "2026-11-23T16:06". */
  createdAt: string;
}

export interface MonitoringHistory {
  hours: number;
  /** Number of samples in the window. */
  points: number;
  avgCpuPercent: number;
  peak: Pick<MonitoringSample, "cpuPercent" | "createdAt"> | null;
}

export interface ServerStatus {
  current: MonitoringSample | null;
  /** How often the agent measures, minutes. */
  sampleIntervalMinutes: number;
}

export type ClientRole = "teacher" | "student" | "parent";

export interface ClientHealthUser {
  userId: string;
  username: string;
  fullName: string;
  role: ClientRole;
  reports: number;
  cpuLimitedReports: number;
  bandwidthLimitedReports: number;
  minFps: number | null;
  /** What the user was doing when FPS bottomed out. */
  minFpsContext: string | null;
  lastAt: string | null;
  cores: number | null;
  memoryGb: number | null;
  browser: string;
  os: string;
}

export interface ClientHealthSummary {
  hours: number;
  /** Seconds between device reports. */
  reportIntervalSeconds: number;
  total: number;
  cpuLimitedTotal: number;
  users: ClientHealthUser[];
}

export interface TeacherVideoStat {
  teacherId: string;
  teacherName: string;
  videoCount: number;
  sizeGb: number;
}

export interface TeacherVideoStats {
  totalVideos: number;
  teachers: TeacherVideoStat[];
}

export interface SystemHealth {
  server: ServerStatus;
  videos: TeacherVideoStats;
}

export const SERVER_RANGES = [6, 24, 72, 168] as const;
export const CLIENT_RANGES = [24, 72, 168, 336] as const;
export type ServerRange = (typeof SERVER_RANGES)[number];
export type ClientRange = (typeof CLIENT_RANGES)[number];
