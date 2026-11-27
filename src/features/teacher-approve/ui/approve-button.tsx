"use client";

import { useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { plansApi, useInvalidatePlans } from "@/entities/plan";
import { Button } from "@/shared/ui/button";
import { toast } from "@/shared/ui/toast";

export function ApproveButton({ applicantId }: { applicantId: string }) {
  const invalidate = useInvalidatePlans();
  const approve = useMutation({
    mutationFn: () => plansApi.approveApplicant(applicantId),
    onSuccess: async ({ name, username }) => {
      await invalidate();
      toast.success(`${name} (@${username}) o‘qituvchi sifatida tasdiqlandi`);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Button size="xs" className="gap-1.5 px-[11px]" disabled={approve.isPending} onClick={() => approve.mutate()}>
      <Check className="size-3.5" strokeWidth={2.25} />
      {approve.isPending ? "Tasdiqlanmoqda..." : "Tasdiqlash"}
    </Button>
  );
}
