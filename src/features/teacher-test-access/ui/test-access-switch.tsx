"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { planKeys, plansApi, type TeacherRoster } from "@/entities/plan";
import { Switch } from "@/shared/ui/switch";
import { toast } from "@/shared/ui/toast";

/** Toggles the AI test builder for one teacher; flips optimistically. */
export function TestAccessSwitch({
  teacherId,
  teacherName,
  enabled,
}: {
  teacherId: string;
  teacherName: string;
  enabled: boolean;
}) {
  const queryClient = useQueryClient();
  const toggle = useMutation({
    mutationFn: (next: boolean) => plansApi.setTestCreation(teacherId, next),
    onMutate: async (next) => {
      const key = planKeys.all;
      await queryClient.cancelQueries({ queryKey: key });
      const snapshots = queryClient.getQueriesData<TeacherRoster>({ queryKey: [...key, "roster"] });
      for (const [queryKey, data] of snapshots) {
        if (!data) continue;
        queryClient.setQueryData<TeacherRoster>(queryKey, {
          ...data,
          teachers: data.teachers.map((t) => (t.id === teacherId ? { ...t, testCreation: next } : t)),
        });
      }
      return { snapshots };
    },
    onError: (error, _next, context) => {
      context?.snapshots.forEach(([queryKey, data]) => queryClient.setQueryData(queryKey, data));
      toast.error(error.message);
    },
    onSuccess: ({ name, enabled: on }) =>
      toast.success(`${name} uchun Test yaratish xizmati ${on ? "yoqildi" : "o‘chirildi"}`),
    onSettled: () => queryClient.invalidateQueries({ queryKey: [...planKeys.all, "roster"] }),
  });

  return (
    <span className="flex items-center gap-2 text-body text-ink">
      <Switch
        checked={enabled}
        onChange={(next) => toggle.mutate(next)}
        label={`${teacherName}: Test yaratish`}
        disabled={toggle.isPending}
      />
      {enabled ? "Yoqilgan" : "O‘chiq"}
    </span>
  );
}
