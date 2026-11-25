"use client";

import { useMutation } from "@tanstack/react-query";
import { plansApi, useInvalidatePlans, type NewDemoInput } from "@/entities/plan";
import { toast } from "@/shared/ui/toast";

export function useCreateDemo() {
  const invalidate = useInvalidatePlans();
  return useMutation({
    mutationFn: (input: NewDemoInput) => plansApi.createDemo(input),
    onSuccess: async (teacher) => {
      await invalidate();
      toast.success(`${teacher.name} uchun bepul demo ochildi`);
    },
    onError: (error) => toast.error(error.message),
  });
}
