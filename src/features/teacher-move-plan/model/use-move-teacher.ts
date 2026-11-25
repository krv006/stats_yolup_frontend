"use client";

import { useMutation } from "@tanstack/react-query";
import { plansApi, useInvalidatePlans, type PaidPlanId } from "@/entities/plan";
import { toast } from "@/shared/ui/toast";

interface MoveVariables {
  teacherId: string;
  planId: PaidPlanId;
  /** For the success message only. */
  planName: string;
}

export function useMoveTeacher() {
  const invalidate = useInvalidatePlans();
  return useMutation({
    mutationFn: ({ teacherId, planId }: MoveVariables) => plansApi.moveTeacher(teacherId, planId),
    onSuccess: async (teacher, { planName }) => {
      await invalidate();
      toast.success(`${teacher.name} ${planName} tarifiga o‘tkazildi`);
    },
    onError: (error) => toast.error(error.message),
  });
}
