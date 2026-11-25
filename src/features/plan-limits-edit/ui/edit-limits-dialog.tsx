"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Plan, PlanSettingsInput } from "@/entities/plan";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Field, Input } from "@/shared/ui/input";

const positiveInt = (message: string) => z.string().trim().regex(/^[1-9]\d{0,5}$/, message);
/** Empty string = unlimited. */
const optionalLimit = z.string().trim().regex(/^([1-9]\d{0,5})?$/, "Musbat butun son kiriting yoki bo‘sh qoldiring");

const schema = z.object({
  price: z.string().trim().regex(/^\d{1,5}$/, "Narxni butun son bilan kiriting"),
  trialDays: z.string().trim(),
  maxStudents: optionalLimit,
  maxGroups: optionalLimit,
  groupSize: optionalLimit,
});

type FormValues = z.infer<typeof schema>;

const toLimit = (value: string) => (value === "" ? null : Number(value));
const fromLimit = (value: number | null) => (value == null ? "" : String(value));

export function EditLimitsDialog({
  plan,
  onClose,
  onApply,
}: {
  plan: Plan | null;
  onClose: () => void;
  onApply: (input: PlanSettingsInput) => void;
}) {
  return (
    <Dialog open={plan != null} onOpenChange={(open) => !open && onClose()}>
      {plan ? <LimitsForm key={plan.id} plan={plan} onApply={onApply} /> : null}
    </Dialog>
  );
}

function LimitsForm({ plan, onApply }: { plan: Plan; onApply: (input: PlanSettingsInput) => void }) {
  const isDemo = plan.id === "demo";
  const form = useForm<FormValues>({
    resolver: zodResolver(
      isDemo
        ? schema.extend({ trialDays: positiveInt("Kunlar sonini kiriting") })
        : schema
    ),
    defaultValues: {
      price: String(plan.priceMonthly),
      trialDays: fromLimit(plan.trialDays),
      maxStudents: fromLimit(plan.limits.maxStudents),
      maxGroups: fromLimit(plan.limits.maxGroups),
      groupSize: fromLimit(plan.limits.groupSize),
    },
  });
  const { errors } = form.formState;

  const submit = form.handleSubmit((values) =>
    onApply({
      priceMonthly: isDemo ? 0 : Number(values.price),
      trialDays: isDemo ? Number(values.trialDays) : null,
      limits: {
        maxStudents: toLimit(values.maxStudents),
        maxGroups: toLimit(values.maxGroups),
        groupSize: toLimit(values.groupSize),
      },
    })
  );

  return (
    <DialogContent>
      <form onSubmit={submit} noValidate>
        <DialogTitle>{plan.name} — limitlar</DialogTitle>
        <DialogDescription>
          Limitlar har bir o‘qituvchi uchun. Bo‘sh qoldirilgan limit — cheklanmagan.
        </DialogDescription>

        <div className="mt-5 grid grid-cols-2 gap-4">
          {isDemo ? (
            <Field label="Sinov muddati (kun)" error={errors.trialDays?.message}>
              <Input inputMode="numeric" aria-invalid={!!errors.trialDays} {...form.register("trialDays")} />
            </Field>
          ) : (
            <Field label="Narx ($ / oy)" error={errors.price?.message}>
              <Input inputMode="numeric" aria-invalid={!!errors.price} {...form.register("price")} />
            </Field>
          )}
          <Field label="Maks. student" error={errors.maxStudents?.message}>
            <Input inputMode="numeric" placeholder="Cheklanmagan" aria-invalid={!!errors.maxStudents} {...form.register("maxStudents")} />
          </Field>
          <Field label="Maks. guruh" error={errors.maxGroups?.message}>
            <Input inputMode="numeric" placeholder="Cheklanmagan" aria-invalid={!!errors.maxGroups} {...form.register("maxGroups")} />
          </Field>
          <Field label="Guruh hajmi" error={errors.groupSize?.message}>
            <Input inputMode="numeric" placeholder="Cheklanmagan" aria-invalid={!!errors.groupSize} {...form.register("groupSize")} />
          </Field>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="secondary" type="button">Bekor qilish</Button>} />
          <Button type="submit">Qo‘llash</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
