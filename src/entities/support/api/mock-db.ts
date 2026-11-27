import { isoInDays as day } from "@/shared/lib/format";
import type { RequesterRole, SupportTicket, TicketStatus } from "../model/types";

const at = (dayOffset: number, time: string) => `${day(dayOffset)}T${time}`;
const SUPPORT_REPLY = "Rahmat, murojaatingiz ko‘rib chiqildi. Muammo hal qilindi.";

/** Older, already handled tickets so tab counts look like real traffic. */
function archived(
  n: number,
  status: TicketStatus,
  subject: string,
  name: string,
  username: string,
  role: RequesterRole,
  daysAgo: number
): SupportTicket {
  return {
    id: `s-${1030 - n}`,
    number: 1030 - n,
    subject,
    preview: status === "answered" ? "Rahmat, tushunarli bo‘ldi!" : SUPPORT_REPLY,
    status,
    requester: { name, username, role },
    createdAt: at(-daysAgo, "10:15"),
    closedAt: status === "closed" ? day(-daysAgo + 1) : null,
    messages: [
      { id: `s-${1030 - n}-1`, from: "user", text: `${subject}. Yordam bera olasizmi?`, sentAt: at(-daysAgo, "10:15") },
      { id: `s-${1030 - n}-2`, from: "support", text: SUPPORT_REPLY, sentAt: at(-daysAgo, "11:02") },
    ],
  };
}

export const supportDb: { tickets: SupportTicket[]; nextMessageId: number } = {
  nextMessageId: 1,
  tickets: [
    {
      id: "s-1042",
      number: 1042,
      subject: "Darsga kira olmayapman",
      preview: "Parolni tiklasam ham jonli dars xonasi ochilmayapti...",
      status: "open",
      requester: { name: "Ali Sobirov", username: "ali_student", role: "student" },
      createdAt: at(0, "14:20"),
      closedAt: null,
      messages: [
        {
          id: "m-1042-1",
          from: "user",
          text: "Assalomu alaykum! Ingliz tili A1 guruhida jonli darsga kirmoqchi edim, lekin 'Ulanish xatosi' deb chiqyapti. Parolni tiklasam ham ochilmayapti.",
          sentAt: at(0, "14:20"),
        },
        {
          id: "m-1042-2",
          from: "support",
          text: "Va alaykum assalom, Ali! Akkauntingiz sessiyasini yangilab berdik. Iltimos, sahifani yangilab (Ctrl+R) qaytadan 'Darsga kirish' tugmasini bosing.",
          sentAt: at(0, "14:24"),
        },
      ],
    },
    {
      id: "s-1041",
      number: 1041,
      subject: "Sertifikat yuklanmayapti",
      preview: "Fayl 5 MB dan kichik, lekin PDF xato beradi...",
      status: "open",
      requester: { name: "Nodira Yusupova", username: "nodira_y", role: "teacher" },
      createdAt: at(0, "11:02"),
      closedAt: null,
      messages: [
        { id: "m-1041-1", from: "user", text: "Sertifikatimni yuklamoqchiman. Fayl 5 MB dan kichik, lekin PDF xato beradi.", sentAt: at(0, "11:02") },
      ],
    },
    {
      id: "s-1040",
      number: 1040,
      subject: "Test natijasi saqlanmadi",
      preview: "20 ta savoldan keyin internet uzildi...",
      status: "open",
      requester: { name: "Bekzod Toirov", username: "bekzod_t", role: "student" },
      createdAt: at(-1, "19:40"),
      closedAt: null,
      messages: [
        { id: "m-1040-1", from: "user", text: "Testni ishlayotganimda 20 ta savoldan keyin internet uzildi. Natijam saqlanmadi, qayta topshirsam bo‘ladimi?", sentAt: at(-1, "19:40") },
      ],
    },
    {
      id: "s-1039",
      number: 1039,
      subject: "Guruh vaqtini o‘zgartirish",
      preview: "Rahmat, tushunarli bo‘ldi!",
      status: "answered",
      requester: { name: "Malika Karimova", username: "malika_k", role: "teacher" },
      createdAt: at(-2, "16:05"),
      closedAt: null,
      messages: [
        { id: "m-1039-1", from: "user", text: "Guruhimning dars vaqtini 18:00 dan 19:00 ga o‘zgartirsam bo‘ladimi?", sentAt: at(-2, "16:05") },
        { id: "m-1039-2", from: "support", text: "Albatta. Guruh sozlamalari → Jadval bo‘limidan vaqtni o‘zgartirishingiz mumkin.", sentAt: at(-2, "16:30") },
        { id: "m-1039-3", from: "user", text: "Rahmat, tushunarli bo‘ldi!", sentAt: at(-2, "16:41") },
      ],
    },
    archived(1, "answered", "To‘lov cheki kelmadi", "Javohir Aliyev", "javohir_a", "parent", 3),
    archived(2, "answered", "Uyga vazifa ko‘rinmayapti", "Sevinch Rahimova", "sevinch_r", "student", 4),
    archived(3, "answered", "Profil rasmini almashtirish", "Otabek Sobirov", "otabek_s", "teacher", 5),
    archived(4, "answered", "Davomat noto‘g‘ri belgilangan", "Laylo Nazarova", "laylo_n", "parent", 6),
    ...Array.from({ length: 12 }, (_, i) =>
      archived(10 + i, "closed", ["Parolni tiklash", "Video sekin yuklanmoqda", "Guruhga qo‘shilish", "Ilovaga kira olmayapman"][i % 4]!, ["Aziz Qodirov", "Dilnoza Karimova", "Rustam Yo‘ldoshev", "Madina Xolmatova"][i % 4]!, ["aziz_q", "dilnoza_k", "rustam_y", "madina_x"][i % 4]!, i % 2 ? "teacher" : "student", 7 + i)
    ),
  ],
};
