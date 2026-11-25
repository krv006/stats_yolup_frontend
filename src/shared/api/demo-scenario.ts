/**
 * Demo scenarios for QA until the real backend is wired:
 *   ?demo=empty  → empty state
 *   ?demo=error  → load error state
 */
export type DemoScenario = "default" | "empty" | "error";

const SCENARIOS: DemoScenario[] = ["default", "empty", "error"];

export function parseScenario(value: string | string[] | undefined): DemoScenario {
  return SCENARIOS.find((s) => s === value) ?? "default";
}
