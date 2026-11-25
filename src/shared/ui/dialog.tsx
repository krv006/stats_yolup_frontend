"use client";

import { Dialog as Primitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";

/** Shared with alert-dialog so every modal looks the same. */
export const BACKDROP_CLASS =
  "fixed inset-0 z-50 bg-scrim transition-opacity duration-150 data-starting-style:opacity-0 data-ending-style:opacity-0";
export const POPUP_CLASS = cn(
  "fixed top-1/2 left-1/2 z-50 w-[calc(100vw-32px)] -translate-1/2 rounded-xl border border-line bg-surface px-6 pt-5 pb-[22px] shadow-lg outline-none",
  "transition-[opacity,scale] duration-150 data-starting-style:scale-95 data-starting-style:opacity-0",
  "data-ending-style:scale-95 data-ending-style:opacity-0"
);

export const Dialog = Primitive.Root;
export const DialogClose = Primitive.Close;

export function DialogContent({ className, children, ...props }: ComponentProps<typeof Primitive.Popup>) {
  return (
    <Primitive.Portal>
      <Primitive.Backdrop className={BACKDROP_CLASS} />
      <Primitive.Popup className={cn(POPUP_CLASS, "max-w-110", className)} {...props}>
        {children}
        <Primitive.Close
          aria-label="Yopish"
          className="absolute top-4 right-4 grid size-8 place-items-center rounded-md text-ink-secondary hover:bg-subtle hover:text-ink"
        >
          <X className="size-4" />
        </Primitive.Close>
      </Primitive.Popup>
    </Primitive.Portal>
  );
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof Primitive.Title>) {
  return <Primitive.Title className={cn("pr-8 text-title-lg text-ink", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: ComponentProps<typeof Primitive.Description>) {
  return <Primitive.Description className={cn("mt-1.5 text-body text-ink-secondary", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mt-6 flex justify-end gap-2.5", className)} {...props} />;
}
