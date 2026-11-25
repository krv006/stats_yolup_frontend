"use client";

import { useMutation } from "@tanstack/react-query";
import { plansApi, useInvalidatePlans, type PlanId, type PlanSettingsInput } from "@/entities/plan";
import { toast } from "@/shared/ui/toast";

export type PlanSettingsDrafts = Partial<Record<PlanId, PlanSettingsInput>>;

export function useSavePlanSettings() {
  const invalidate = useInvalidatePlans();
  return useMutation({
    mutationFn: (drafts: PlanSettingsDrafts) => plansApi.updatePlans(drafts),
    onSuccess: async () => {
      await invalidate();
      toast.success("Tarif limitlari va narx sozlamalari muvaffaqiyatli saqlandi");
    },
    onError: (error) => toast.error(error.message),
  });
}
