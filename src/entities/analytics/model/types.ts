/** Shapes mirror Edu_Front's `DashboardSummary` / `DashboardTrends` (shared/types/domain.ts). */

export type DashboardPeriod = "day" | "week" | "month" | "year";

export interface TopCourseStat {
  id: string;
  title: string;
  teacherName: string;
  studentCount: number;
  avgRating: number | null;
  attendanceRate: number | null;
}

export interface TopTeacherStat {
  id: string;
  name: string;
  courseCount: number;
  lessonsThisMonth: number;
  avgRating: number | null;
  reliability: number | null;
}

export interface DashboardSummary {
  activeStudents: number;
  newStudentsThisMonth: number;
  activeTeachers: number;
  activeCourses: number;
  avgRating: number | null;
  ratingCount: number;
  topCourses: TopCourseStat[];
  topTeachers: TopTeacherStat[];
}

export interface DashboardTrends {
  period: DashboardPeriod;
  /** Short axis labels, e.g. "Noy". */
  labels: string[];
  /** Full labels for tooltips, e.g. "Noyabr 2026". */
  fullLabels: string[];
  enrollments: number[];
  lessonsCompleted: number[];
  lessonsCancelled: number[];
  quizAvgScore: Array<number | null>;
  attendanceRate: Array<number | null>;
}
