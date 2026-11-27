import type { DemoScenario } from "@/shared/api/demo-scenario";
import { mockRespond } from "@/shared/api/mock";
import type {
  ClientHealthSummary,
  ClientRange,
  MonitoringHistory,
  ServerRange,
  SystemHealth,
} from "../model/types";
import {
  CURRENT_SAMPLES,
  HISTORY,
  LAST_SAMPLE_AT,
  SAMPLE_INTERVAL_MINUTES,
  VIDEOS,
  clientUsers,
} from "./mock-data";

let reading = 0;

/** Monitoring endpoints (Prometheus / Docker agent behind the backend). */
export const systemApi = {
  getHealth(scenario: DemoScenario, signal?: AbortSignal) {
    return mockRespond<SystemHealth>(
      scenario,
      () => ({
        server: {
          current: { ...CURRENT_SAMPLES[reading++ % CURRENT_SAMPLES.length]!, createdAt: LAST_SAMPLE_AT },
          sampleIntervalMinutes: SAMPLE_INTERVAL_MINUTES,
        },
        videos: VIDEOS,
      }),
      {
        empty: () => ({
          server: { current: null, sampleIntervalMinutes: SAMPLE_INTERVAL_MINUTES },
          videos: { totalVideos: 0, teachers: [] },
        }),
        signal,
      }
    );
  },

  getHistory(hours: ServerRange, scenario: DemoScenario, signal?: AbortSignal) {
    return mockRespond<MonitoringHistory>(scenario, () => ({ hours, ...HISTORY[hours] }), {
      empty: () => ({ hours, points: 0, avgCpuPercent: 0, peak: null }),
      signal,
    });
  },

  getClientHealth(hours: ClientRange, scenario: DemoScenario, signal?: AbortSignal) {
    return mockRespond<ClientHealthSummary>(
      scenario,
      () => {
        const users = clientUsers(hours);
        return {
          hours,
          reportIntervalSeconds: 30,
          total: users.reduce((acc, u) => acc + u.reports, 0),
          cpuLimitedTotal: users.reduce((acc, u) => acc + u.cpuLimitedReports, 0),
          users,
        };
      },
      { empty: () => ({ hours, reportIntervalSeconds: 30, total: 0, cpuLimitedTotal: 0, users: [] }), signal }
    );
  },
};
