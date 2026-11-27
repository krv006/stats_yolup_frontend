export type RecipientRole = "student" | "teacher";

export interface Recipient {
  id: string;
  name: string;
  username: string;
  role: RecipientRole;
}

export type Audience = { kind: "all" } | { kind: "user"; user: Recipient };

/** One row of the "sent" history. */
export interface AnnouncementSummary {
  id: string;
  audience: Audience;
  /** How many users it was delivered to. */
  audienceSize: number;
  text: string;
  /** Local ISO date-time. */
  sentAt: string;
  readCount: number;
  /** Single-recipient messages: when it was read ("HH:MM" date-time), if at all. */
  readAt: string | null;
}

export interface AnnouncementHistory {
  items: AnnouncementSummary[];
  /** Active users an "all" announcement reaches today. */
  activeUsers: { teachers: number; students: number };
}

export interface AnnouncementReader {
  user: Recipient;
  readAt: string;
}

export interface AnnouncementReaders {
  announcement: AnnouncementSummary;
  readers: AnnouncementReader[];
}

export interface SendAnnouncementInput {
  audience: { kind: "all" } | { kind: "user"; userId: string };
  text: string;
}
