"use client";

import { useMutation } from "@tanstack/react-query";
import { plansApi, priceLabel, useInvalidatePlans, type MoveTeacherInput } from "@/entities/plan";
import { toast } from "@/shared/ui/toast";

export function useMoveTeacher() {
  const invalidate = useInvalidatePlans();
  return useMutation({
    mutationFn: (input: MoveTeacherInput) => plansApi.moveTeacher(input),
    onSuccess: async ({ teacher, plan }) => {
      await invalidate();
      toast.success(`${teacher.name} ${plan.name} tarifga (${priceLabel(plan)}) muvaffaqiyatli o‘tkazildi`);
    },
    onError: (error) => toast.error(error.message),
  });
}
