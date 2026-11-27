"use client";

import { useMutation } from "@tanstack/react-query";
import { plansApi, useInvalidatePlans } from "@/entities/plan";
import { formatDate } from "@/shared/lib/format";
import { toast } from "@/shared/ui/toast";

export function useExtendTrial() {
  const invalidate = useInvalidatePlans();
  return useMutation({
    mutationFn: ({ teacherId, days }: { teacherId: string; days: number }) => plansApi.extendTrial(teacherId, days),
    onSuccess: async (teacher, { days }) => {
      await invalidate();
      const until = teacher.trialEndsAt ? ` (${formatDate(teacher.trialEndsAt)} gacha)` : "";
      toast.success(`${teacher.name} uchun demo muddati +${days} kunga${until} uzaytirildi`);
    },
    onError: (error) => toast.error(error.message),
  });
}
