import type { DashboardPeriod, DashboardSummary, DashboardTrends } from "../model/types";

export const MOCK_SUMMARY: DashboardSummary = {
  activeStudents: 128,
  newStudentsThisMonth: 12,
  activeTeachers: 13,
  activeCourses: 24,
  avgRating: 4.8,
  ratingCount: 312,
  topCourses: [
    { id: "c1", title: "Team YolUp — Intensive", teacherName: "Aziza Karimova", studentCount: 42, avgRating: 4.9, attendanceRate: 96 },
    { id: "c2", title: "Ingliz tili A1 (Boshlang‘ich)", teacherName: "Aziza Karimova", studentCount: 36, avgRating: 4.8, attendanceRate: 88 },
    { id: "c3", title: "Matematika — Olimpiada", teacherName: "Jasur Rahimov", studentCount: 28, avgRating: 4.6, attendanceRate: 74 },
    { id: "c4", title: "IELTS Speaking Club", teacherName: "Nodira Yusupova", studentCount: 22, avgRating: 4.5, attendanceRate: 64 },
  ],
  topTeachers: [
    { id: "t1", name: "Aziza Karimova", courseCount: 6, lessonsThisMonth: 26, avgRating: 4.8, reliability: 100 },
    { id: "t2", name: "Jasur Rahimov", courseCount: 5, lessonsThisMonth: 24, avgRating: 4.7, reliability: 94 },
    { id: "t3", name: "Nodira Yusupova", courseCount: 2, lessonsThisMonth: 16, avgRating: 4.5, reliability: 82 },
    { id: "t4", name: "Mukhammaddiyor Odiljonov", courseCount: 1, lessonsThisMonth: 9, avgRating: 4.4, reliability: 78 },
  ],
};

export const EMPTY_SUMMARY: DashboardSummary = {
  activeStudents: 0,
  newStudentsThisMonth: 0,
  activeTeachers: 0,
  activeCourses: 0,
  avgRating: null,
  ratingCount: 0,
  topCourses: [],
  topTeachers: [],
};

export const MOCK_TRENDS: Record<DashboardPeriod, DashboardTrends> = {
  day: {
    period: "day",
    labels: ["17", "18", "19", "20", "21", "22", "23"],
    fullLabels: ["17-noyabr", "18-noyabr", "19-noyabr", "20-noyabr", "21-noyabr", "22-noyabr", "23-noyabr"],
    enrollments: [1, 2, 0, 3, 1, 2, 2],
    lessonsCompleted: [6, 7, 5, 8, 7, 3, 8],
    lessonsCancelled: [0, 1, 0, 0, 1, 0, 0],
    quizAvgScore: [74, 76, 71, 79, 77, 75, 78],
    attendanceRate: [93.2, 95.1, 92.8, 96.0, 94.4, 95.7, 96.4],
  },
  week: {
    period: "week",
    labels: ["40-h", "41-h", "42-h", "43-h", "44-h", "45-h", "46-h"],
    fullLabels: ["40-hafta", "41-hafta", "42-hafta", "43-hafta", "44-hafta", "45-hafta", "46-hafta"],
    enrollments: [4, 5, 3, 7, 6, 8, 7],
    lessonsCompleted: [34, 38, 36, 40, 39, 44, 42],
    lessonsCancelled: [1, 2, 1, 0, 2, 1, 1],
    quizAvgScore: [70, 72, 74, 73, 75, 77, 78],
    attendanceRate: [91.0, 92.4, 92.1, 93.5, 93.0, 94.6, 94.1],
  },
  month: {
    period: "month",
    labels: ["Dek", "Fev", "Apr", "Iyun", "Avg", "Okt", "Noy"],
    fullLabels: ["Dekabr 2025", "Fevral 2026", "Aprel 2026", "Iyun 2026", "Avgust 2026", "Oktabr 2026", "Noyabr 2026"],
    enrollments: [9, 13, 11, 19, 23, 31, 28],
    lessonsCompleted: [106, 119, 129, 112, 139, 159, 172],
    lessonsCancelled: [3, 2, 5, 3, 2, 3, 4],
    quizAvgScore: [58, 62, 65, 64, 71, 75, 78],
    attendanceRate: [88.4, 89.0, 90.2, 89.7, 90.9, 91.6, 92.0],
  },
  year: {
    period: "year",
    labels: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
    fullLabels: ["2020-yil", "2021-yil", "2022-yil", "2023-yil", "2024-yil", "2025-yil", "2026-yil"],
    enrollments: [24, 38, 52, 71, 88, 110, 128],
    lessonsCompleted: [420, 610, 780, 940, 1120, 1310, 1480],
    lessonsCancelled: [22, 26, 19, 24, 18, 21, 17],
    quizAvgScore: [61, 64, 66, 69, 72, 75, 78],
    attendanceRate: [84.2, 86.0, 87.5, 88.9, 90.1, 90.8, 91.5],
  },
};

export const EMPTY_TRENDS = (period: DashboardPeriod): DashboardTrends => ({
  period,
  labels: [],
  fullLabels: [],
  enrollments: [],
  lessonsCompleted: [],
  lessonsCancelled: [],
  quizAvgScore: [],
  attendanceRate: [],
});
