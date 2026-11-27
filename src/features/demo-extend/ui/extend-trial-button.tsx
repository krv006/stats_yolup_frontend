"use client";

import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { useExtendTrial } from "../model/use-extend-trial";

export function ExtendTrialButton({ teacherId, days = 7, className }: { teacherId: string; days?: number; className?: string }) {
  const extend = useExtendTrial();
  return (
    <Button
      variant="outline"
      className={cn("px-3.5", className)}
      disabled={extend.isPending}
      onClick={() => extend.mutate({ teacherId, days })}
    >
      {extend.isPending ? "Uzaytirilmoqda..." : `+${days} kun uzaytirish`}
    </Button>
  );
}
