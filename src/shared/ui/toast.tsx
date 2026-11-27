"use client";

import { create } from "zustand";
import { cn } from "@/shared/lib/cn";

type ToastTone = "success" | "warning" | "error";

const TONE_DOT: Record<ToastTone, string> = { success: "bg-success", warning: "bg-warning", error: "bg-danger" };

interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastStore {
  toasts: Toast[];
  push: (message: string, tone?: ToastTone) => void;
  dismiss: (id: number) => void;
}

const DURATION_MS = 3500;
const MAX_VISIBLE = 3;
let seq = 0;

const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  push(message, tone = "success") {
    const id = ++seq;
    set((state) => ({ toasts: [...state.toasts, { id, message, tone }].slice(-MAX_VISIBLE) }));
    setTimeout(() => get().dismiss(id), DURATION_MS);
  },
  dismiss(id) {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));

/** Imperative API — callable from mutation callbacks. */
export const toast = {
  success: (message: string) => useToastStore.getState().push(message, "success"),
  warning: (message: string) => useToastStore.getState().push(message, "warning"),
  error: (message: string) => useToastStore.getState().push(message, "error"),
};

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed right-0 bottom-6 left-0 z-60 flex flex-col items-center gap-2 lg:left-(--layout-sidebar)"
    >
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismiss(t.id)}
          className="pointer-events-auto flex items-center gap-2.5 rounded-lg bg-inverse px-4 py-2.5 text-body font-medium text-ink-inverse shadow-lg animate-in fade-in slide-in-from-bottom-2"
        >
          <span
            className={cn("size-2 shrink-0 rounded-full", TONE_DOT[t.tone])}
            aria-hidden="true"
          />
          {t.message}
        </button>
      ))}
    </div>
  );
}
