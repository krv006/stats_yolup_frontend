"use client";

import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DemoScenario } from "@/shared/api/demo-scenario";
import { announcementsApi } from "./announcements-api";

export const announcementKeys = {
  all: ["announcements"] as const,
  history: (scenario: DemoScenario) => [...announcementKeys.all, "history", scenario] as const,
  readers: (id: string) => [...announcementKeys.all, "readers", id] as const,
  recipients: (query: string) => [...announcementKeys.all, "recipients", query] as const,
};

export function useAnnouncementHistory(scenario: DemoScenario) {
  return useQuery({
    queryKey: announcementKeys.history(scenario),
    queryFn: ({ signal }) => announcementsApi.getHistory(scenario, signal),
  });
}

export function useAnnouncementReaders(id: string | null) {
  return useQuery({
    queryKey: announcementKeys.readers(id ?? ""),
    queryFn: ({ signal }) => announcementsApi.getReaders(id!, signal),
    enabled: id != null,
  });
}

export function useRecipientSearch(query: string) {
  const q = query.trim();
  return useQuery({
    queryKey: announcementKeys.recipients(q),
    queryFn: ({ signal }) => announcementsApi.searchRecipients(q, signal),
    enabled: q.length > 0,
    placeholderData: keepPreviousData,
  });
}

export function useInvalidateAnnouncements() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: announcementKeys.all });
}
