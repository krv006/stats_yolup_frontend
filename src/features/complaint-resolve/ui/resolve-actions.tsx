"use client";

import { useMutation } from "@tanstack/react-query";
import { complaintsApi, useInvalidateComplaints, type Complaint } from "@/entities/complaint";
import { Button } from "@/shared/ui/button";
import { toast } from "@/shared/ui/toast";

type Decision = "approve" | "reject";

/** "Rad etish" / "Tasdiqlash" for a new complaint. */
export function ResolveActions({ complaint }: { complaint: Complaint }) {
  const invalidate = useInvalidateComplaints();
  const resolve = useMutation({
    mutationFn: (decision: Decision) => complaintsApi[decision](complaint.id),
    onSuccess: async (_, decision) => {
      await invalidate();
      if (decision === "approve") {
        toast.success(`Shikoyat tasdiqlandi va @${complaint.accused.username} akkauntiga chat cheklovi qo‘llandi`);
      } else {
        toast.warning("Shikoyat asossiz deb topildi va 'Rad etilgan' ro‘yxatiga o‘tkazildi");
      }
    },
    onError: (error) => toast.error(error.message),
  });
  const pending = resolve.isPending ? resolve.variables : null;

  return (
    <div className="flex shrink-0 gap-2.5">
      <Button variant="outline" className="h-9 px-[15px]" disabled={pending != null} onClick={() => resolve.mutate("reject")}>
        {pending === "reject" ? "Rad etilmoqda..." : "Rad etish"}
      </Button>
      <Button variant="danger" className="h-9 px-[15px]" disabled={pending != null} onClick={() => resolve.mutate("approve")}>
        {pending === "approve" ? "Tasdiqlanmoqda..." : "Tasdiqlash"}
      </Button>
    </div>
  );
}
