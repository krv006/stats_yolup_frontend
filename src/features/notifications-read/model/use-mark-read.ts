"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { planKeys, plansApi, type NotificationFeed } from "@/entities/plan";
import { toast } from "@/shared/ui/toast";

/** Marks notifications as read; the feed updates optimistically. */
export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();
  const key = planKeys.notifications();

  return useMutation({
    mutationFn: (ids: string[]) => plansApi.markNotificationsRead(ids),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<NotificationFeed>(key);
      if (previous) {
        const read = new Set(ids);
        const items = previous.items.map((n) => (read.has(n.id) ? { ...n, read: true } : n));
        queryClient.setQueryData<NotificationFeed>(key, { items, unreadCount: items.filter((n) => !n.read).length });
      }
      return { previous };
    },
    onError: (error, _ids, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
      toast.error(error.message);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}
