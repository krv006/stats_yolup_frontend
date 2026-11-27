"use client";

import { Search } from "lucide-react";
import { useId, useState, type KeyboardEvent } from "react";
import { RECIPIENT_ROLE_LABEL, useRecipientSearch, type Recipient } from "@/entities/announcement";
import { cn } from "@/shared/lib/cn";
import { InitialsAvatar } from "@/shared/ui/avatar";

/** Name / @username combobox for a direct message. */
export function RecipientPicker({
  value,
  onChange,
  invalid,
}: {
  value: Recipient | null;
  onChange: (user: Recipient | null) => void;
  invalid?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const search = useRecipientSearch(value ? "" : query);
  const results = value || !query.trim() ? [] : (search.data ?? []);
  const expanded = open && query.trim().length > 0 && !value;

  function pick(user: Recipient) {
    onChange(user);
    setQuery("");
    setOpen(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!expanded || !results.length) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (i + step + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      pick(results[Math.min(active, results.length - 1)]!);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "flex h-[38px] items-center gap-2 rounded-md border border-transparent px-3 transition-colors",
          "hover:border-line focus-within:border-action focus-within:ring-3 focus-within:ring-ring/20",
          invalid && "border-danger"
        )}
      >
        {value ? (
          <InitialsAvatar name={value.name} className="size-[21px] text-[10px]" />
        ) : (
          <Search className="size-3.5 shrink-0 text-ink-tertiary" aria-hidden="true" />
        )}
        <input
          role="combobox"
          aria-label="Foydalanuvchi"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-invalid={invalid || undefined}
          aria-activedescendant={expanded && results.length ? `${listId}-${active}` : undefined}
          autoComplete="off"
          value={value ? `${value.name} (@${value.username})` : query}
          placeholder="Ism yoki @username bo‘yicha qidiring..."
          onChange={(event) => {
            onChange(null);
            setQuery(event.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 bg-transparent text-body text-ink outline-none placeholder:text-ink-tertiary"
        />
      </div>

      {expanded ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Qidiruv natijalari"
          className="absolute inset-x-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border border-line bg-elevated p-1 shadow-lg"
        >
          {results.map((user, i) => (
            <li
              key={user.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              // mousedown keeps focus in the input so blur doesn't close the list first
              onMouseDown={(event) => {
                event.preventDefault();
                pick(user);
              }}
              onMouseEnter={() => setActive(i)}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2",
                i === active && "bg-subtle"
              )}
            >
              <InitialsAvatar name={user.name} className="size-[26px] text-[11px]" />
              <span className="min-w-0 flex-1 truncate text-body text-ink">
                {user.name} <span className="text-ink-secondary">(@{user.username})</span>
              </span>
              <span className="text-caption text-ink-tertiary">{RECIPIENT_ROLE_LABEL[user.role]}</span>
            </li>
          ))}
          {!results.length ? (
            <li className="px-2.5 py-2 text-body text-ink-secondary">
              {search.isFetching ? "Qidirilmoqda..." : "Hech kim topilmadi"}
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
