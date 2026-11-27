"use client";

import { useMutation } from "@tanstack/react-query";
import { plansApi, useInvalidatePlans, type NewDemoInput } from "@/entities/plan";
import { toast } from "@/shared/ui/toast";

export function useCreateDemo() {
  const invalidate = useInvalidatePlans();
  return useMutation({
    mutationFn: (input: NewDemoInput) => plansApi.createDemo(input),
    onSuccess: async (teacher, input) => {
      await invalidate();
      const sms = input.sendSms ? " va login SMS yuborildi" : "";
      toast.success(`${teacher.name} uchun ${input.trialDays} kunlik bepul demo ochildi${sms}`);
    },
    onError: (error) => toast.error(error.message),
  });
}
