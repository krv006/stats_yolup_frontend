import type { LeadSource } from "@/entities/plan";

export const TRIAL_OPTIONS = [
  { days: 3, hint: "qisqa sinov" },
  { days: 7, hint: "standart" },
  { days: 14, hint: "kengaytirilgan" },
] as const;

export const SOURCE_OPTIONS: LeadSource[] = ["instagram", "telegram", "referral", "other"];

/** What every demo includes; shown so the admin can explain it to the teacher. */
export const DEMO_FEATURES = [
  "1 ta faol guruh ochish",
  "15 tagacha student qo‘shish",
  "Jonli video dars va ekran ulashish",
  "Dars yozuvlarini saqlash",
] as const;
