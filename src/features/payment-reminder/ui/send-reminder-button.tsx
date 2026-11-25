"use client";

import { useMutation } from "@tanstack/react-query";
import { plansApi } from "@/entities/plan";
import { Button } from "@/shared/ui/button";
import { toast } from "@/shared/ui/toast";

export function SendReminderButton({ teacherId, teacherName }: { teacherId: string; teacherName: string }) {
  const reminder = useMutation({
    mutationFn: () => plansApi.sendPaymentReminder(teacherId),
    onSuccess: () => toast.success(`${teacherName}ga to‘lov eslatmasi yuborildi`),
    onError: (error) => toast.error(error.message),
  });

  return (
    <Button variant="secondary" size="xs" disabled={reminder.isPending} onClick={() => reminder.mutate()}>
      {reminder.isPending ? "Yuborilmoqda..." : "Eslatma yuborish"}
    </Button>
  );
}
