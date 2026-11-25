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
}

export const DEFAULT_SEARCH_PLACEHOLDER = "O‘qituvchi, kurs yoki foydalanuvchi...";

/** The nav item that owns `pathname` ("/" matches only itself). */
export function findNavItem(pathname: string): NavItem | undefined {
  return NAV_ITEMS.find((item) => (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)));
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Boshqaruv paneli", icon: House, ready: true },
  {
    href: "/tariflar",
    label: "Tariflar",
    icon: LayoutGrid,
    ready: true,
    searchPlaceholder: "O‘qituvchi, guruh yoki telefon...",
  },
  { href: "/oqituvchilar", label: "O‘qituvchilar", icon: GraduationCap, count: 2 },
  { href: "/murojaatlar", label: "Murojaatlar", icon: MessageSquare, count: 3 },
  { href: "/shikoyatlar", label: "Shikoyatlar", icon: Flag, count: 2 },
  { href: "/xabarlar", label: "Xabarlar", icon: Megaphone },
];
