import { isoInDays } from "@/shared/lib/format";
import type { Recipient, RecipientRole } from "../model/types";

const NAMED: Array<Omit<Recipient, "id">> = [
  { name: "Aziza Karimova", username: "teacher1", role: "teacher" },
  { name: "Jasur Rahimov", username: "jasur_r", role: "teacher" },
  { name: "Ali Sobirov", username: "ali_student", role: "student" },
  { name: "Nodira Yusupova", username: "nodira_y", role: "teacher" },
  { name: "Toshmat Boltayev", username: "toshmat_b", role: "student" },
  { name: "Jasur Qodirov", username: "jasur_student", role: "student" },
];
const FIRST = ["Sardor", "Kamola", "Bobur", "Malika", "Otabek", "Dilnoza", "Javohir", "Sevinch", "Rustam", "Madina", "Aziz", "Laylo"];
const LAST = ["Aliyev", "Yusupova", "Xasanov", "Karimova", "Sobirov", "Rahimova", "Toirov", "Nazarova", "Qodirov", "Ergasheva", "Umarov", "Saidova"];

/** 15 teachers + 128 students: the active audience of a broadcast. */
function buildDirectory(): Recipient[] {
  const users: Recipient[] = NAMED.map((u, i) => ({ ...u, id: `u-${i + 1}` }));
  const quota: Record<RecipientRole, number> = { teacher: 15, student: 128 };
  for (const u of users) quota[u.role]--;
  let n = 0;
  for (const role of ["teacher", "student"] as const) {
    for (let k = 0; k < quota[role]; k++, n++) {
      const first = FIRST[n % FIRST.length]!;
      const last = LAST[Math.floor(n / FIRST.length) % LAST.length]!;
      users.push({ id: `u-${users.length + 1}`, name: `${first} ${last}`, username: `${first.toLowerCase()}_${n + 1}`, role });
    }
  }
  return users;
}

export interface AnnouncementRow {
  id: string;
  target: "all" | string;
  text: string;
  sentAt: string;
  /** userId → read time (ISO date-time). */
  reads: Map<string, string>;
}

const directory = buildDirectory();

/** Deterministic reads: the first `count` users, a few minutes apart. */
function reads(dayOffset: number, from: string, count: number, userIds = directory.map((u) => u.id)) {
  const [h = 0, m = 0] = from.split(":").map(Number);
  const steps = [2, 3, 6, 8, 15];
  const map = new Map<string, string>();
  let minutes = h * 60 + m;
  userIds.slice(0, count).forEach((id, i) => {
    minutes += steps[i % steps.length]!;
    const t = Math.min(minutes, 23 * 60 + 59);
    map.set(id, `${isoInDays(dayOffset)}T${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`);
  });
  return map;
}

const at = (dayOffset: number, time: string) => `${isoInDays(dayOffset)}T${time}`;

const OLDER = [
  "Yangi dars jadvali muharriri ishga tushirildi.",
  "Mobil ilovaning yangi versiyasi chiqdi — yangilab oling.",
  "Bayram kunlari darslar jadvali o‘zgaradi.",
  "To‘lov tizimiga Click qo‘shildi.",
  "Profil sozlamalarida ikki bosqichli himoya yoqildi.",
  "Uyga vazifa bo‘limida fayl yuklash limiti 20 MB ga oshirildi.",
  "Haftalik reyting e’lon qilindi.",
  "Platformada texnik ishlar yakunlandi.",
  "Yangi o‘qituvchilar uchun qo‘llanma joylandi.",
];

export const announcementDb: { directory: Recipient[]; rows: AnnouncementRow[]; nextId: number } = {
  directory,
  nextId: 1,
  rows: [
    {
      id: "a-12",
      target: "all",
      text: "Shanba kuni soat 02:00 dan 03:00 gacha serverda profilaktika ishlari olib boriladi.",
      sentAt: at(-1, "18:00"),
      reads: reads(-1, "18:00", 124),
    },
    {
      id: "a-11",
      target: "all",
      text: "Yangi AI test tekshiruv moduli barcha Pro va Business tarifidagi o‘qituvchilar uchun yoqildi!",
      sentAt: at(-4, "10:30"),
      reads: reads(-4, "10:30", 139),
    },
    {
      id: "a-10",
      target: "u-2",
      text: "Sizning Pro tarifingiz 20.12.2026 gacha muvaffaqiyatli uzaytirildi.",
      sentAt: at(-5, "15:12"),
      reads: reads(-5, "15:12", 1, ["u-2"]),
    },
    ...OLDER.map((text, i) => ({
      id: `a-${9 - i}`,
      target: "all",
      text,
      sentAt: at(-7 - i * 3, "11:00"),
      reads: reads(-7 - i * 3, "11:00", 143 - (i % 4) * 3),
    })),
  ],
};
