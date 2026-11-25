"use client";

import { AlertDialog as Primitive } from "@base-ui/react/alert-dialog";
import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";
import { BACKDROP_CLASS, POPUP_CLASS } from "@/shared/ui/dialog";

export const AlertDialog = Primitive.Root;
export const AlertDialogTrigger = Primitive.Trigger;
export const AlertDialogClose = Primitive.Close;

export function AlertDialogContent({ className, children, ...props }: ComponentProps<typeof Primitive.Popup>) {
  return (
    <Primitive.Portal>
      <Primitive.Backdrop className={BACKDROP_CLASS} />
      <Primitive.Popup className={cn(POPUP_CLASS, "max-w-100", className)} {...props}>
        {children}
      </Primitive.Popup>
    </Primitive.Portal>
  );
}

export function AlertDialogTitle({ className, ...props }: ComponentProps<typeof Primitive.Title>) {
  return <Primitive.Title className={cn("text-title-lg text-ink", className)} {...props} />;
}

export function AlertDialogDescription({ className, ...props }: ComponentProps<typeof Primitive.Description>) {
  return <Primitive.Description className={cn("mt-3 text-body text-ink-secondary", className)} {...props} />;
}

export function AlertDialogFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mt-[15px] flex justify-end gap-2.5", className)} {...props} />;
}
