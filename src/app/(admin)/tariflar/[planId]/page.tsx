import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PlanDetailPage } from "@/views/plan-detail";
import { PLAN_ORDER, type PlanId } from "@/entities/plan";
import { parseScenario } from "@/shared/api/demo-scenario";

export function generateStaticParams() {
  return PLAN_ORDER.map((planId) => ({ planId }));
}

const isPlanId = (value: string): value is PlanId => (PLAN_ORDER as string[]).includes(value);

async function Content({ params, searchParams }: PageProps<"/tariflar/[planId]">) {
  const [{ planId }, { demo }] = await Promise.all([params, searchParams]);
  if (!isPlanId(planId)) notFound();
  return <PlanDetailPage planId={planId} scenario={parseScenario(demo)} />;
}

export default function Page(props: PageProps<"/tariflar/[planId]">) {
  return (
    <Suspense>
      <Content {...props} />
    </Suspense>
  );
}
