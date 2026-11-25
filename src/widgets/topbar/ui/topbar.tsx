"use client";

import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { LogoutDialog } from "@/features/auth-logout";
import { DEFAULT_SEARCH_PLACEHOLDER, findNavItem } from "@/shared/config/navigation";
import { formatUzDate } from "@/shared/lib/format";

// TODO(auth): replace with the signed-in user once the auth API is wired.
const CURRENT_USER = { name: "vintozer", initials: "VZ", role: "Administrator" };
const UNREAD_NOTIFICATIONS = 6;

export function Topbar() {
  const searchRef = useRef<HTMLInputElement>(null);
  const placeholder = findNavItem(usePathname())?.searchPlaceholder ?? DEFAULT_SEARCH_PLACEHOLDER;

  // ⌘K / Ctrl+K focuses the global search.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-(--layout-topbar) items-center gap-6 border-b border-line bg-surface px-8">
      <label className="flex h-9 w-85 items-center gap-2 rounded-md border border-line bg-surface pr-2.5 pl-3.5 focus-within:border-action focus-within:ring-3 focus-within:ring-ring/20">
        <Search className="size-3.5 shrink-0 text-ink-tertiary" aria-hidden="true" />
        <span className="sr-only">Qidiruv</span>
        <input
          ref={searchRef}
          type="search"
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-body text-ink outline-none placeholder:text-ink-tertiary"
        />
        <kbd className="rounded-xs border border-line bg-elevated px-1.5 font-sans text-micro text-ink">⌘K</kbd>
      </label>

      <div className="ml-auto flex items-center gap-[27px]">
        <Today />

        <button
          type="button"
          className="flex items-center gap-2 rounded-xs text-ink-secondary outline-none hover:text-ink focus-visible:ring-3 focus-visible:ring-ring/40"
          aria-label={`Bildirishnomalar: ${UNREAD_NOTIFICATIONS} ta o‘qilmagan`}
        >
          <Bell className="size-3.5" strokeWidth={1.75} />
          <span className="text-caption font-semibold text-ink">{UNREAD_NOTIFICATIONS}</span>
        </button>

        <LogoutDialog
          trigger={
            <span className="flex items-center gap-2.5 text-left">
              <span className="grid size-8 place-items-center rounded-full bg-inverse text-caption font-semibold text-ink-inverse">
                {CURRENT_USER.initials}
              </span>
              <span className="flex flex-col">
                <span className="text-label leading-4 font-semibold text-ink">{CURRENT_USER.name}</span>
                <span className="text-caption text-ink-secondary">{CURRENT_USER.role}</span>
              </span>
            </span>
          }
        />
      </div>
    </header>
  );
}

const noopSubscribe = () => () => {};

/** Client-only date — avoids prerendering a stale "today" into the static shell. */
function Today() {
  const label = useSyncExternalStore(noopSubscribe, () => formatUzDate(new Date()), () => null);
  return <time className="min-w-25 text-right text-body text-ink-secondary">{label}</time>;
}
