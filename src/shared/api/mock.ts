import type { DemoScenario } from "./demo-scenario";

/**
 * Helpers for the in-memory mock backend. Swap the entity `*-api.ts`
 * implementations for real HTTP calls; nothing above them changes.
 */

const LATENCY_MS = 350;

export function mockDelay(signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(resolve, LATENCY_MS);
    signal?.addEventListener("abort", () => {
      clearTimeout(id);
      reject(signal.reason);
    });
  });
}

/** Resolve after the mock latency, honouring the QA scenario. Returns a deep copy. */
export async function mockRespond<T>(
  scenario: DemoScenario,
  build: () => T,
  options: { empty?: () => T; signal?: AbortSignal } = {}
): Promise<T> {
  await mockDelay(options.signal);
  if (scenario === "error") throw new Error("Server bilan aloqa uzildi.");
  const data = scenario === "empty" && options.empty ? options.empty() : build();
  return structuredClone(data);
}
