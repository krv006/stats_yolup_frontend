import { ShieldAlert } from "lucide-react";
import { ResolveActions } from "@/features/complaint-resolve";
import {
  CHAT_ROLE_LABEL,
  COMPLAINT_REASON_LABEL,
  COMPLAINT_STATUS_LABEL,
  type ChatUser,
  type Complaint,
} from "@/entities/complaint";
import { cn } from "@/shared/lib/cn";
import { formatDate, formatDateTime } from "@/shared/lib/format";
import { Panel } from "@/shared/ui/panel";

const person = (u: ChatUser) => `${u.name} (@${u.username}) — ${CHAT_ROLE_LABEL[u.role]}`;

export function ComplaintDetail({ complaint }: { complaint: Complaint }) {
  const { accused, reporter, status } = complaint;
  const rows: Array<[string, string]> = [
    ["Shikoyat qilgan", person(reporter)],
    ["Kimga nisbatan", person(accused)],
    ["Sabab", COMPLAINT_REASON_LABEL[complaint.reason]],
    ["Yuborilgan sana", formatDateTime(complaint.sentAt)],
  ];

  return (
    <Panel aria-label="Shikoyat tafsiloti" className="flex min-h-0 flex-col px-6 pt-[19px] pb-5">
      <header className="flex items-center gap-2.5">
        <ShieldAlert className="size-4 text-danger" strokeWidth={2} aria-hidden="true" />
        <h2 className="min-w-0 flex-1 truncate text-[17px] leading-6 font-semibold text-ink">
          Shikoyat tafsiloti va suhbat tekshiruvi
        </h2>
        <span className="flex shrink-0 items-center gap-1.5 text-caption font-medium text-ink-strong">
          {status === "new" ? <span className="size-1.5 rounded-full bg-warning" aria-hidden="true" /> : null}
          {COMPLAINT_STATUS_LABEL[status]}
        </span>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <dl className="mt-[23px] flex flex-col px-4">
          {rows.map(([label, value]) => (
            <div key={label} className="flex h-[25px] items-center justify-between gap-6">
              <dt className="shrink-0 text-caption text-ink">{label}</dt>
              <dd className="truncate text-body font-semibold text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <h3 className="mt-[23px] text-title text-ink">Suhbatning oxirgi xabarlari</h3>
        <ol className="mt-[23px] flex flex-col gap-2.5 px-4">
          {complaint.messages.map((m) => {
            const author = m.author === "accused" ? accused : reporter;
            return (
              <li
                key={m.id}
                className={cn(
                  "w-full rounded-lg px-3 pt-2 pb-2.5",
                  m.author === "accused" ? "max-w-111 self-start bg-danger-bg" : "max-w-106 self-end"
                )}
              >
                <p className="text-caption font-semibold text-ink">
                  {author.name} (@{author.username})<span className="mx-1.5">|</span>
                  {m.time}
                </p>
                <p className="text-body leading-[19px] text-ink">{m.text}</p>
              </li>
            );
          })}
        </ol>
      </div>

      <footer className="mt-4 flex justify-between gap-4 border-t border-line pt-3.5">
        <p className="flex min-h-9 items-center text-caption text-ink">
          {status === "new"
            ? "Tasdiqlansa foydalanuvchiga ogohlantirish / chat cheklovi qo‘llanadi."
            : status === "approved"
              ? `${formatDate(complaint.resolvedAt ?? complaint.sentAt)} da tasdiqlangan — @${accused.username} akkauntiga chat cheklovi qo‘llangan.`
              : `${formatDate(complaint.resolvedAt ?? complaint.sentAt)} da asossiz deb topilgan — chora ko‘rilmagan.`}
        </p>
        {status === "new" ? <ResolveActions complaint={complaint} /> : null}
      </footer>
    </Panel>
  );
}
