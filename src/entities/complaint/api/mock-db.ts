import { isoInDays } from "@/shared/lib/format";
import type { ChatUser, Complaint, ComplaintReason, ComplaintStatus } from "../model/types";

const at = (dayOffset: number, time: string) => `${isoInDays(dayOffset)}T${time}`;

const aziza: ChatUser = { name: "Aziza Karimova", username: "teacher1", role: "teacher" };
const jasur: ChatUser = { name: "Jasur Rahimov", username: "jasur_r", role: "teacher" };

/** Already handled cases so every tab has history. */
function handled(n: number, status: ComplaintStatus, reason: ComplaintReason, accused: ChatUser, reporter: ChatUser): Complaint {
  const sentAt = at(-10 - n, "17:20");
  return {
    id: `c-${n}`,
    status,
    reason,
    accused,
    reporter,
    sentAt,
    resolvedAt: isoInDays(-9 - n),
    messages: [
      { id: `c-${n}-1`, author: "accused", text: reason === "spam" ? "Kanalimga obuna bo‘ling, chegirma bor!" : "Nega javob bermayapsiz?", time: "17:12" },
      { id: `c-${n}-2`, author: "reporter", text: "Iltimos, bunday yozmang.", time: "17:15" },
    ],
  };
}

const students: ChatUser[] = [
  { name: "Sardor Aliyev", username: "sardor_a", role: "student" },
  { name: "Kamola Yusupova", username: "kamola_y", role: "student" },
  { name: "Bobur Xasanov", username: "bobur_x", role: "student" },
  { name: "Ziyoda Ergasheva", username: "ziyoda_e", role: "parent" },
];

export const complaintDb: { complaints: Complaint[] } = {
  complaints: [
    {
      id: "c-101",
      status: "new",
      reason: "harassment",
      accused: { name: "Teacher teacher", username: "teacher1_student", role: "student" },
      reporter: aziza,
      sentAt: at(-8, "19:53"),
      resolvedAt: null,
      messages: [
        { id: "c-101-1", author: "accused", text: "Nega javob bermaysiz??? Hoziroq vazifamni tekshirib bering!", time: "19:51" },
        { id: "c-101-2", author: "reporter", text: "Iltimos, dars vaqtidan tashqari bunday ohangda ketma-ket yozmang.", time: "19:52" },
        { id: "c-101-3", author: "accused", text: "Baribir qayta-qayta yozaveraman!", time: "19:53" },
      ],
    },
    {
      id: "c-102",
      status: "new",
      reason: "spam",
      accused: { name: "Dilshod Rahmatov", username: "dilshod_99", role: "student" },
      reporter: jasur,
      sentAt: at(-3, "16:10"),
      resolvedAt: null,
      messages: [
        { id: "c-102-1", author: "accused", text: "Arzon kurslar! Telegram kanalimga o‘ting: t.me/...", time: "16:02" },
        { id: "c-102-2", author: "accused", text: "Faqat bugun 70% chegirma!!!", time: "16:04" },
        { id: "c-102-3", author: "reporter", text: "Bu guruh faqat dars uchun. Reklama yubormang.", time: "16:08" },
      ],
    },
    ...students.map((s, i) => handled(i + 1, "approved", i % 2 ? "spam" : "harassment", s, i % 2 ? jasur : aziza)),
    ...Array.from({ length: 9 }, (_, i) =>
      handled(10 + i, "rejected", (["harassment", "spam", "insult"] as const)[i % 3]!, students[i % 4]!, i % 2 ? aziza : jasur)
    ),
  ],
};
