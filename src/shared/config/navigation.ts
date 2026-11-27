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
  { href: "/", label: "Boshqaruv paneli", icon: House, aliases: [SYSTEM_HEALTH_HREF] },
  {
    href: "/tariflar",
    label: "Tariflar",
    icon: LayoutGrid,
    searchPlaceholder: "O‘qituvchi, guruh yoki telefon...",
  },
  { href: "/oqituvchilar", label: "O‘qituvchilar", icon: GraduationCap },
  { href: "/murojaatlar", label: "Murojaatlar", icon: MessageSquare },
  { href: "/shikoyatlar", label: "Shikoyatlar", icon: Flag },
  { href: "/xabarlar", label: "Xabarlar", icon: Megaphone },
];
