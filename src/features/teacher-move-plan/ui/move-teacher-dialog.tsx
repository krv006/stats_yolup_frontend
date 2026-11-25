"use client";

import { useState } from "react";
import {
  PAID_PLANS,
  PLAN_DOT,
  limitLabels,
  priceLabel,
  type PaidPlanId,
  type Plan,
  type PlanId,
} from "@/entities/plan";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/shared/ui/dialog";
import type { MoveRequest } from "../model/types";
import { useMoveTeacher } from "../model/use-move-teacher";

export function MoveTeacherDialog({
  request,
  plans,
  onClose,
}: {
  request: MoveRequest | null;
  plans: Plan[];
  onClose: () => void;
}) {
  return (
    <Dialog open={request != null} onOpenChange={(open) => !open && onClose()}>
      {/* Keyed so the selection resets for every new request. */}
      {request ? <MoveForm key={request.teacherId} request={request} plans={plans} onDone={onClose} /> : null}
    </Dialog>
  );
}

function MoveForm({ request, plans, onDone }: { request: MoveRequest; plans: Plan[]; onDone: () => void }) {
  const [target, setTarget] = useState<PaidPlanId>(request.suggested);
  const move = useMoveTeacher();
  const options = plans.filter((p): p is Plan & { id: PaidPlanId } =>
    (PAID_PLANS as PlanId[]).includes(p.id) && p.id !== request.from
  );
  const targetName = plans.find((p) => p.id === target)?.name ?? "";

  return (
    <DialogContent>
      <DialogTitle>Tarifga o‘tkazish</DialogTitle>
      <DialogDescription>{request.teacherName} uchun yangi tarifni tanlang.</DialogDescription>

      <fieldset className="mt-5 flex flex-col gap-2">
        <legend className="sr-only">Tarif</legend>
        {options.map((plan) => {
          const checked = plan.id === target;
          return (
            <label
              key={plan.id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors",
                checked ? "border-action bg-action-subtle" : "border-line-subtle hover:bg-subtle"
              )}
            >
              <input
                type="radio"
                name="plan"
                value={plan.id}
                checked={checked}
                onChange={() => setTarget(plan.id)}
                className="size-4 accent-(--action-primary)"
              />
              <span className={cn("size-2 rounded-full", PLAN_DOT[plan.id])} aria-hidden="true" />
              <span className="flex-1">
                <span className="block text-label text-ink">{plan.name}</span>
                <span className="block text-caption text-ink-secondary">{limitLabels(plan.id, plan.limits).join(" · ")}</span>
              </span>
              <span className="text-caption font-semibold text-ink">{priceLabel(plan)}</span>
            </label>
          );
        })}
      </fieldset>

      <DialogFooter>
        <DialogClose render={<Button variant="secondary">Bekor qilish</Button>} />
        <Button
          disabled={move.isPending}
          onClick={() =>
            move.mutate({ teacherId: request.teacherId, planId: target, planName: targetName }, { onSuccess: onDone })
          }
        >
          {move.isPending ? "O‘tkazilmoqda..." : `${targetName} tarifiga o‘tkazish`}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
