"use client";

import { useMutation } from "@tanstack/react-query";
import { Send, Users } from "lucide-react";
import { useState, type FormEvent } from "react";
import { announcementsApi, useInvalidateAnnouncements, type Recipient } from "@/entities/announcement";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { ChoiceGroup } from "@/shared/ui/choice-group";
import { toast } from "@/shared/ui/toast";
import { RecipientPicker } from "./recipient-picker";

type Mode = "user" | "all";

/** "Yangi xabar yuborish": a direct message or a broadcast to every active user. */
export function AnnouncementForm({ activeUsers }: { activeUsers: { teachers: number; students: number } }) {
  const [mode, setMode] = useState<Mode>("user");
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const invalidate = useInvalidateAnnouncements();
  const total = activeUsers.teachers + activeUsers.students;

  const send = useMutation({
    mutationFn: () =>
      announcementsApi.send({
        audience: mode === "all" ? { kind: "all" } : { kind: "user", userId: recipient!.id },
        text: text.trim(),
      }),
    onSuccess: async () => {
      await invalidate();
      toast.success(
        mode === "all"
          ? `E’lon barcha ${total} ta foydalanuvchiga muvaffaqiyatli yuborildi`
          : `Xabar ${recipient!.name}ga yuborildi`
      );
      setText("");
      setRecipient(null);
      setSubmitted(false);
    },
    onError: (error) => toast.error(error.message),
  });

  const recipientError = mode === "user" && !recipient ? "Foydalanuvchini tanlang" : null;
  const textError = !text.trim() ? "Xabar matnini kiriting" : null;

  function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (!recipientError && !textError) send.mutate();
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col">
      <ChoiceGroup<Mode>
        label="Kimga yuboriladi"
        variant="card"
        value={mode}
        onChange={setMode}
        options={[
          { value: "user", label: <Option title="Bitta foydalanuvchi" hint="Qidirib tanlang" /> },
          { value: "all", label: <Option title="Hammaga" hint="Barcha foydalanuvchilar" /> },
        ]}
      />

      <div className="mt-[17px] flex flex-col gap-2">
        <span className="text-caption text-ink">{mode === "all" ? "Qabul qiluvchilar" : "Foydalanuvchi"}</span>
        {mode === "all" ? (
          <p className="flex h-[38px] items-center gap-2 pr-1 pl-3 text-body whitespace-nowrap text-ink">
            <span className="grid size-[21px] place-items-center rounded-full border border-line bg-chip" aria-hidden="true">
              <Users className="size-3 text-ink" strokeWidth={2} />
            </span>
            Barcha faol foydalanuvchilar ({activeUsers.teachers} o‘qituvchi, {activeUsers.students} o‘quvchi)
          </p>
        ) : (
          <RecipientPicker value={recipient} onChange={setRecipient} invalid={submitted && !!recipientError} />
        )}
        {submitted && recipientError && mode === "user" ? <FieldError>{recipientError}</FieldError> : null}
      </div>

      <label className="mt-[17px] flex flex-col gap-2">
        <span className="text-caption text-ink">Xabar matni</span>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          aria-invalid={(submitted && !!textError) || undefined}
          placeholder="Masalan: Assalomu alaykum! Ertaga soat 14:00 da platformada yangi test moduli bo‘yicha qisqa vebinar bo‘lib o‘tadi."
          rows={5}
          className="h-[128px] resize-none rounded-md border border-transparent px-3 py-[9px] text-body leading-[19px] text-ink outline-none transition-colors placeholder:text-ink-tertiary hover:border-line focus:border-action focus:ring-3 focus:ring-ring/20 aria-invalid:border-danger"
        />
      </label>
      {submitted && textError ? <FieldError className="mt-1">{textError}</FieldError> : null}

      <Button type="submit" className="mt-[17px] h-[34px] w-full gap-2" disabled={send.isPending}>
        <Send className="size-3.5" strokeWidth={2} />
        {send.isPending ? "Yuborilmoqda..." : "Xabarni yuborish"}
      </Button>
    </form>
  );
}

function Option({ title, hint }: { title: string; hint: string }) {
  return (
    <>
      <span className="text-body font-semibold text-ink">{title}</span>
      <span className="text-caption text-ink">{hint}</span>
    </>
  );
}

function FieldError({ children, className }: { children: string; className?: string }) {
  return (
    <span role="alert" className={cn("text-caption text-danger-fg", className)}>
      {children}
    </span>
  );
}
