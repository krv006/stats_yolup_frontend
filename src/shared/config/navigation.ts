import {
  Flag,
  GraduationCap,
  House,
  LayoutGrid,
  Megaphone,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Pending-items counter shown on the right. */
  count?: number;
  /** Section has its own page; otherwise the placeholder route serves it. */
  ready?: boolean;
  /** Global search hint while this section is open. */
  searchPlaceholder?: string;
  /** Other routes that belong to this section (keep it highlighted). */
  aliases?: string[];
}

/** System health page, reached from the sidebar status line. */
export const SYSTEM_HEALTH_HREF = "/tizim";

export const DEFAULT_SEARCH_PLACEHOLDER = "O‘qituvchi, kurs yoki foydalanuvchi...";

/** The nav item that owns `pathname` ("/" matches only itself). */
export function findNavItem(pathname: string): NavItem | undefined {
  const owns = (base: string) => (base === "/" ? pathname === "/" : pathname === base || pathname.startsWith(`${base}/`));
  return NAV_ITEMS.find((item) => owns(item.href) || item.aliases?.some(owns));
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Boshqaruv paneli", icon: House, ready: true, aliases: [SYSTEM_HEALTH_HREF] },
  {
    href: "/tariflar",
    label: "Tariflar",
    icon: LayoutGrid,
    ready: true,
    searchPlaceholder: "O‘qituvchi, guruh yoki telefon...",
  },
  { href: "/oqituvchilar", label: "O‘qituvchilar", icon: GraduationCap, ready: true },
  { href: "/murojaatlar", label: "Murojaatlar", icon: MessageSquare, count: 3 },
  { href: "/shikoyatlar", label: "Shikoyatlar", icon: Flag, count: 2 },
  { href: "/xabarlar", label: "Xabarlar", icon: Megaphone },
];
