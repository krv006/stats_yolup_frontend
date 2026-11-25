"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";

export function LogoutDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  function signOut() {
    // TODO(auth): call the logout endpoint and redirect to /login once auth exists.
    queryClient.clear();
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
        aria-label="Profil: tizimdan chiqish"
      >
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Tizimdan chiqish</AlertDialogTitle>
        <AlertDialogDescription>
          Haqiqatan ham administrator akkauntidan chiqmoqchimisiz?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="secondary" className="h-[33px] px-[15px]">Bekor qilish</Button>} />
          <Button variant="danger" className="h-[33px] px-[15px]" onClick={signOut}>
            Chiqish
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
