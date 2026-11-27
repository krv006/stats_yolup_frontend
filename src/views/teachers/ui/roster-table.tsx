"use client";

import { BarChart3, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { TestAccessSwitch } from "@/features/teacher-test-access";
import { PLAN_DOT, type Plan, type RosterTeacher } from "@/entities/plan";
import { cn } from "@/shared/lib/cn";
import { formatRating } from "@/shared/lib/format";
import { InitialsAvatar } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { SearchInput } from "@/shared/ui/input";
import { Panel } from "@/shared/ui/panel";

const TH = "h-[39px] px-3 text-left text-body font-normal whitespace-nowrap text-ink-secondary first:pl-5 last:pr-5";
const TD = "h-[60px] px-3 align-middle first:pl-5 last:pr-5";
/** Column widths measured from the design; the last one takes the rest. */
const WIDTHS = [346, 122, 171, 145, 191];

function matches(t: RosterTeacher, query: string) {
  const q = query.trim().toLowerCase().replace(/^@/, "");
  return !q || t.name.toLowerCase().includes(q) || t.username.toLowerCase().includes(q);
}

export function RosterTable({
  teachers,
  plans,
  onAnalyze,
}: {
  teachers: RosterTeacher[];
  plans: Plan[];
  onAnalyze: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const visible = teachers.filter((t) => matches(t, query));
  const planName = (id: RosterTeacher["planId"]) => plans.find((p) => p.id === id)?.name ?? id;

  return (
    <Panel className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 px-5 py-[14px]">
        <h2 className="flex items-center gap-2 text-title text-ink">
          Barcha tasdiqlangan o‘qituvchilar
          <span className="text-caption font-normal">{teachers.length}</span>
        </h2>
        <SearchInput
          label="O‘qituvchini qidirish"
          placeholder="Ism yoki @username bo‘yicha..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="ml-auto w-65"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-275 table-fixed border-collapse">
          <caption className="sr-only">Tasdiqlangan o‘qituvchilar</caption>
          <colgroup>
            {WIDTHS.map((w, i) => (
              <col key={i} style={{ width: w }} />
            ))}
            <col />
          </colgroup>
          <thead className="border-y border-line">
            <tr>
              <th scope="col" className={TH}>O‘qituvchi</th>
              <th scope="col" className={TH}>Tarif</th>
              <th scope="col" className={TH}>Kurslar</th>
              <th scope="col" className={TH}>Reyting</th>
              <th scope="col" className={TH}>Test yaratish</th>
              <th scope="col" className={TH}>Tahlil</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((t) => (
              <tr key={t.id} className="border-b border-line-subtle last:border-0">
                <td className={TD}>
                  <div className="flex items-center gap-3">
                    <InitialsAvatar name={t.name} size="lg" />
                    <div className="min-w-0">
                      <Link
                        href={`/tariflar/${t.planId}/${encodeURIComponent(t.id)}`}
                        className="block truncate text-[14px] leading-5 font-medium text-ink hover:text-brand"
                      >
                        {t.name}
                      </Link>
                      <p className="truncate text-caption text-ink">
                        @{t.username}
                        <span className="px-1.5" aria-hidden="true">|</span>
                        {t.subject}
                      </p>
                    </div>
                  </div>
                </td>
                <td className={TD}>
                  <span className="flex items-center gap-1.5 text-caption font-medium text-ink">
                    <span className={cn("size-1.5 rounded-full", PLAN_DOT[t.planId])} aria-hidden="true" />
                    {planName(t.planId)}
                  </span>
                </td>
                <td className={cn(TD, "text-body text-ink")}>
                  {t.courses} kurs, {t.lessons} ta dars
                </td>
                <td className={TD}>
                  {t.ratingAvg != null ? (
                    <span className="flex items-center gap-1.5 text-body text-ink">
                      <Star className="size-3 fill-star text-star" aria-hidden="true" />
                      <span className="font-semibold">{formatRating(t.ratingAvg)}</span>
                      <span className="text-caption text-ink-secondary">({t.ratingCount} ta baho)</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-body text-ink">
                      — <span className="text-caption text-ink-secondary">(Baho yo‘q)</span>
                    </span>
                  )}
                </td>
                <td className={TD}>
                  <TestAccessSwitch teacherId={t.id} teacherName={t.name} enabled={t.testCreation} />
                </td>
                <td className={cn(TD, "text-right")}>
                  <Button variant="secondary" size="xs" className="gap-1.5 px-3" onClick={() => onAnalyze(t.id)}>
                    <BarChart3 className="size-3" /> Tahlil
                  </Button>
                </td>
              </tr>
            ))}
            {visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-body text-ink-secondary">
                  Qidiruv bo‘yicha hech kim topilmadi.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
