"use client";

import { useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useState } from "react";
import { supportApi, useInvalidateSupport, type SupportTicket } from "@/entities/support";
import { cn } from "@/shared/lib/cn";
import { formatDate } from "@/shared/lib/format";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Button, buttonVariants } from "@/shared/ui/button";
import { toast } from "@/shared/ui/toast";

/** "Murojaatni yopish" with a confirmation; shows the close date once closed. */
export function CloseTicketButton({ ticket }: { ticket: SupportTicket }) {
  const [open, setOpen] = useState(false);
  const invalidate = useInvalidateSupport();
  const close = useMutation({
    mutationFn: () => supportApi.close(ticket.id),
    onSuccess: async () => {
      setOpen(false);
      await invalidate();
      toast.success(`Murojaat #${ticket.number} yopildi`);
    },
    onError: (error) => toast.error(error.message),
  });

  if (ticket.status === "closed") {
    return (
      <span className={cn(buttonVariants({ variant: "outline" }), "h-9 gap-1.5 px-[15px] text-body hover:bg-surface")}>
        <Check className="size-3.5" strokeWidth={2} />
        Yopilgan{ticket.closedAt ? ` (${formatDate(ticket.closedAt)})` : ""}
      </span>
    );
  }

  return (
    <>
      <Button variant="outline" className="h-9 gap-1.5 px-[15px] text-body" onClick={() => setOpen(true)}>
        <Check className="size-3.5" strokeWidth={2} />
        Murojaatni yopish
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-105">
          <AlertDialogTitle className="text-[17px]">Murojaatni yopishni tasdiqlaysizmi?</AlertDialogTitle>
          <AlertDialogDescription>
            Murojaat #{ticket.number} yopilgach, foydalanuvchi ushbu suhbatga qayta yozolmaydi (yangi murojaat ochishi
            mumkin).
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant="secondary" className="h-[33px] px-[15px]">Bekor qilish</Button>} />
            <Button className="h-[33px] px-[15px]" disabled={close.isPending} onClick={() => close.mutate()}>
              {close.isPending ? "Yopilmoqda..." : "Ha, yopilsin"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
