"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { limitLabels, type Plan } from "@/entities/plan";
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
import { normalizeUzPhone } from "../lib/normalize-phone";
import { useCreateDemo } from "../model/use-create-demo";

const schema = z.object({
  name: z.string().trim().min(3, "Ism va familiyani kiriting"),
  phone: z.string().refine((v) => normalizeUzPhone(v) != null, "Telefon: +998 XX XXX XX XX"),
  subject: z.string().trim().min(2, "Fanni kiriting"),
});

type FormValues = z.infer<typeof schema>;

export function NewDemoDialog({
  open,
  onOpenChange,
  demoPlan,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  demoPlan: Plan | undefined;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open ? <DemoForm demoPlan={demoPlan} onDone={() => onOpenChange(false)} /> : null}
    </Dialog>
  );
}

function DemoForm({ demoPlan, onDone }: { demoPlan: Plan | undefined; onDone: () => void }) {
  const create = useCreateDemo();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "+998 ", subject: "" },
  });
  const { errors } = form.formState;

  const submit = form.handleSubmit((values) =>
    create.mutate(
      { name: values.name.trim(), subject: values.subject.trim(), phone: normalizeUzPhone(values.phone)! },
      { onSuccess: onDone }
    )
  );

  return (
    <DialogContent>
      <form onSubmit={submit} noValidate>
        <DialogTitle>Bepul demo ochish</DialogTitle>
        <DialogDescription>
          {demoPlan
            ? `O‘qituvchiga ${demoPlan.trialDays} kunlik bepul sinov beriladi: ${limitLabels("demo", demoPlan.limits).join(", ")}.`
            : "O‘qituvchiga bepul sinov muddati beriladi."}
        </DialogDescription>

        <div className="mt-5 flex flex-col gap-4">
          <Field label="Ism va familiya" error={errors.name?.message}>
            <Input autoComplete="name" aria-invalid={!!errors.name} {...form.register("name")} />
          </Field>
          <Field label="Telefon" error={errors.phone?.message}>
            <Input type="tel" autoComplete="tel" aria-invalid={!!errors.phone} {...form.register("phone")} />
          </Field>
          <Field label="Fan" error={errors.subject?.message}>
            <Input placeholder="Masalan: Ingliz tili" aria-invalid={!!errors.subject} {...form.register("subject")} />
          </Field>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="secondary" type="button">Bekor qilish</Button>} />
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? "Ochilmoqda..." : "Demo ochish"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
