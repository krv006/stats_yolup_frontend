"use client";

import { useState } from "react";
import {
  PAID_PLANS,
  PLAN_DOT,
  useTeacherDetail,
  type PaidPlanId,
  type Plan,
  type PlanLimits,
} from "@/entities/plan";
import { cn } from "@/shared/lib/cn";
import { formatDate, formatUsd, isoAddMonths, todayIso } from "@/shared/lib/format";
import { Button } from "@/shared/ui/button";
import { ChoiceGroup } from "@/shared/ui/choice-group";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/shared/ui/dialog";
import { SUBSCRIPTION_MONTHS, type MoveRequest } from "../model/types";
import { useMoveTeacher } from "../model/use-move-teacher";

function limitsSummary({ maxStudents, maxGroups }: PlanLimits): string {
  if (maxStudents == null && maxGroups == null) return "Cheklanmagan";
  return [
    maxStudents != null ? `${maxStudents} student` : "Cheklanmagan student",
    maxGroups != null ? `${maxGroups} guruh` : "cheklanmagan guruh",
  ].join(", ");
}

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

function PlanOption({
  plan,
  checked,
  disabled,
  onSelect,
}: {
  plan: Plan;
  checked: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      className={cn(
        "relative flex h-[111px] cursor-pointer flex-col rounded-[10px] border-2 px-3 pt-3 transition-colors",
        checked ? "border-action bg-action-subtle" : "border-transparent hover:bg-subtle",
        disabled && "cursor-not-allowed opacity-50 hover:bg-transparent"
      )}
    >
      <input
        type="radio"
        name="plan"
        value={plan.id}
        checked={checked}
        disabled={disabled}
        onChange={onSelect}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-4 right-3 grid size-4 place-items-center rounded-full border peer-focus-visible:ring-3 peer-focus-visible:ring-ring/40",
          checked ? "border-action bg-action" : "border-line bg-surface"
        )}
      >
        {checked ? <span className="size-1.5 rounded-full bg-elevated" /> : null}
      </span>
      <span className="flex items-center gap-2 text-body font-semibold text-ink">
        <span className={cn("size-[7px] rounded-full", PLAN_DOT[plan.id])} aria-hidden="true" />
        {plan.name}
      </span>
      <span className="mt-2 flex items-baseline gap-1 text-ink">
        <span className="text-[22px] leading-7 font-semibold">{formatUsd(plan.priceMonthly)}</span>
        <span className="text-caption text-ink-secondary">/ oy</span>
      </span>
      <span className="mt-2 text-caption text-ink">{limitsSummary(plan.limits)}</span>
    </label>
  );
}

function MoveForm({ request, plans, onDone }: { request: MoveRequest; plans: Plan[]; onDone: () => void }) {
  const [target, setTarget] = useState<PaidPlanId>(request.suggested);
  const [months, setMonths] = useState<number>(SUBSCRIPTION_MONTHS[0]);
  const detail = useTeacherDetail(request.teacherId, "default");
  const move = useMoveTeacher();

  const options = PAID_PLANS.map((id) => plans.find((p) => p.id === id)).filter((p): p is Plan => p != null);
  const selected = options.find((p) => p.id === target);
  const price = selected?.priceMonthly ?? 0;
  const today = todayIso();
  const until = isoAddMonths(today, months);
  const current = detail.data;

  return (
    <DialogContent className="max-w-140">
      <DialogTitle>Pullik tarifga o‘tkazish</DialogTitle>
      <DialogDescription>
        {request.teacherName}
        {current ? (
          <>
            <span className="px-2" aria-hidden="true">|</span>
            Hozir: {current.plan.name} ({current.teacher.groups} guruh, {current.teacher.students} student)
          </>
        ) : null}
      </DialogDescription>

      <fieldset className="mt-[19px] grid grid-cols-3 gap-1.5">
        <legend className="sr-only">Tarif</legend>
        {options.map((plan) => (
          <PlanOption
            key={plan.id}
            plan={plan}
            checked={plan.id === target}
            disabled={plan.id === current?.plan.id}
            onSelect={() => setTarget(plan.id as PaidPlanId)}
          />
        ))}
      </fieldset>

      <p className="mt-[18px] text-body font-medium text-ink">Obuna muddati</p>
      <ChoiceGroup
        label="Obuna muddati"
        className="mt-[11px] px-1"
        value={months}
        onChange={setMonths}
        options={SUBSCRIPTION_MONTHS.map((m) => ({
          value: m,
          label: (
            <span className="text-body">
              <span className="font-semibold text-ink">{m} oy</span>
              <span className="ml-1.5 text-ink-secondary">({formatUsd(price * m)})</span>
            </span>
          ),
        }))}
      />

      <div className="mt-[37px] flex items-end justify-between gap-4 px-4">
        <div>
          <p className="text-caption text-ink-secondary">Jami to‘lov summasi</p>
          <p className="text-[24px] leading-7 font-semibold text-ink">{formatUsd(price * months)}.00</p>
        </div>
        <div className="text-right">
          <p className="text-caption text-ink-secondary">Faol muddat</p>
          <p className="mt-1 text-body font-semibold text-ink">
            {formatDate(today)} — {formatDate(until)}
            {months > 1 ? ` (${months} oy)` : null}
          </p>
        </div>
      </div>

      <DialogFooter className="mt-[31px]">
        <DialogClose render={<Button variant="secondary" className="px-4">Bekor qilish</Button>} />
        <Button
          disabled={move.isPending || !selected}
          onClick={() => move.mutate({ teacherId: request.teacherId, planId: target, months }, { onSuccess: onDone })}
        >
          {move.isPending ? "Faollashtirilmoqda..." : "Tarifni faollashtirish"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
