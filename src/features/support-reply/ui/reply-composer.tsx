"use client";

import { useMutation } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { supportApi, useInvalidateSupport, type SupportTicket } from "@/entities/support";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { toast } from "@/shared/ui/toast";

/** Bottom bar of a conversation; disabled once the ticket is closed. */
export function ReplyComposer({ ticket }: { ticket: SupportTicket }) {
  const [text, setText] = useState("");
  const invalidate = useInvalidateSupport();
  const closed = ticket.status === "closed";
  const reply = useMutation({
    mutationFn: (message: string) => supportApi.reply(ticket.id, message),
    onSuccess: async () => {
      setText("");
      await invalidate();
      toast.success(`Javobingiz ${ticket.requester.name}ga yuborildi va murojaat 'Javob berilgan' holatiga o‘tdi`);
    },
    onError: (error) => toast.error(error.message),
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    const message = text.trim();
    if (message && !closed) reply.mutate(message);
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-3 border-t border-line px-5 py-3.5">
      <Input
        aria-label="Javob matni"
        value={closed ? "" : text}
        onChange={(event) => setText(event.target.value)}
        disabled={closed || reply.isPending}
        placeholder={
          closed ? "Ushbu murojaat yopilgan — yangi xabar yuborib bo‘lmaydi." : "Foydalanuvchiga javob yozing..."
        }
        className="h-[39px] flex-1 px-[14px] placeholder:text-ink disabled:cursor-not-allowed"
      />
      <Button type="submit" className="h-9 gap-2 px-3.5" disabled={closed || reply.isPending}>
        <Send className="size-3.5" strokeWidth={2} />
        {reply.isPending ? "Yuborilmoqda..." : "Javob yuborish"}
      </Button>
    </form>
  );
}
