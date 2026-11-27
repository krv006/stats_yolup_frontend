"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Check } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LEAD_SOURCE_LABEL, type LeadSource, type Plan } from "@/entities/plan";
import { formatDate, isoAddDays, todayIso } from "@/shared/lib/format";
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
import { Field, Input } from "@/shared/ui/input";
import { normalizeUzPhone } from "../lib/normalize-phone";
import { DEMO_FEATURES, SOURCE_OPTIONS, TRIAL_OPTIONS } from "../model/options";
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
      {open ? <DemoForm defaultDays={demoPlan?.trialDays ?? 7} onDone={() => onOpenChange(false)} /> : null}
    </Dialog>
  );
}

const FIELD_INPUT = "h-[39px] px-3";

function DemoForm({ defaultDays, onDone }: { defaultDays: number; onDone: () => void }) {
  const create = useCreateDemo();
  const [trialDays, setTrialDays] = useState(defaultDays);
  const [source, setSource] = useState<LeadSource>("instagram");
  const [sendSms, setSendSms] = useState(true);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", subject: "" },
  });
  const { errors } = form.formState;
  const today = todayIso();

  const submit = form.handleSubmit((values) =>
    create.mutate(
      {
        name: values.name.trim(),
        subject: values.subject.trim(),
        phone: normalizeUzPhone(values.phone)!,
        trialDays,
        source,
        sendSms,
      },
      { onSuccess: onDone }
    )
  );

  return (
    <DialogContent className="max-w-130">
      <form onSubmit={submit} noValidate>
        <DialogTitle className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-plan-demo" aria-hidden="true" />
          Yangi o‘qituvchi uchun bepul demo
        </DialogTitle>
        <DialogDescription>O‘qituvchi YolUp platformasini to‘lovsiz sinab ko‘radi</DialogDescription>

        <div className="mt-[17px] flex flex-col gap-4">
          <Field label="O‘qituvchi ism-familiyasi" error={errors.name?.message}>
            <Input
              className={FIELD_INPUT}
              autoComplete="name"
              placeholder="Masalan: Aziza Rahimova"
              aria-invalid={!!errors.name}
              {...form.register("name")}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Telefon raqami" error={errors.phone?.message}>
              <Input
                className={FIELD_INPUT}
                type="tel"
                autoComplete="tel"
                placeholder="+998 90 000 00 00"
                aria-invalid={!!errors.phone}
                {...form.register("phone")}
              />
            </Field>
            <Field label="O‘qitadigan fani" error={errors.subject?.message}>
              <Input
                className={FIELD_INPUT}
                placeholder="Ingliz tili"
                aria-invalid={!!errors.subject}
                {...form.register("subject")}
              />
            </Field>
          </div>
        </div>

        <p className="mt-4 text-caption text-ink">Sinov muddati</p>
        <ChoiceGroup
          label="Sinov muddati"
          className="mt-3"
          value={trialDays}
          onChange={setTrialDays}
          options={TRIAL_OPTIONS.map((o) => ({
            value: o.days,
            label: (
              <>
                <span className="block text-body font-semibold text-ink">{o.days} kun</span>
                <span className="block text-caption text-ink-secondary">{o.hint}</span>
              </>
            ),
          }))}
        />

        <p className="mt-2 text-caption text-ink">Qayerdan murojaat qildi</p>
        <ChoiceGroup
          label="Qayerdan murojaat qildi"
          variant="brand"
          className="mt-1.5"
          value={source}
          onChange={setSource}
          options={SOURCE_OPTIONS.map((s) => ({ value: s, label: LEAD_SOURCE_LABEL[s] }))}
        />

        <div className="mt-7 px-3.5">
          <p className="text-caption font-semibold text-ink">Bepul demo ichiga nimalar kiradi:</p>
          <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-[7px]">
            {DEMO_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-caption text-ink-secondary">
                <Check className="size-3.5 shrink-0 text-success" strokeWidth={2.25} aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <label className="mt-[26px] flex cursor-pointer items-center gap-2.5 text-body text-ink">
          <input
            type="checkbox"
            checked={sendSms}
            onChange={(e) => setSendSms(e.target.checked)}
            className="size-4 accent-(--action-primary)"
          />
          Login va parolni o‘qituvchiga SMS orqali yuborish
        </label>

        <div className="mt-[15px] flex h-[38px] items-center justify-between rounded-lg border border-line px-3.5 text-body font-semibold text-ink">
          <span className="flex items-center gap-2">
            <CalendarDays className="size-3.5 text-plan-demo" aria-hidden="true" />
            {formatDate(today)} → {formatDate(isoAddDays(today, trialDays))} ({trialDays} kun)
          </span>
          <span>Bepul (0 so‘m)</span>
        </div>

        <DialogFooter className="mt-[15px]">
          <DialogClose render={<Button variant="secondary" type="button" className="px-4">Bekor qilish</Button>} />
          <Button type="submit" disabled={create.isPending} className="px-4">
            {create.isPending ? "Ochilmoqda..." : "Demo"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
