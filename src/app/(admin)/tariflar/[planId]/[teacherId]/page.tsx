import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TeacherDetailPage } from "@/views/teacher-detail";
import { PLAN_ORDER, type PlanId } from "@/entities/plan";
import { parseScenario } from "@/shared/api/demo-scenario";

const isPlanId = (value: string): value is PlanId => (PLAN_ORDER as string[]).includes(value);

async function Content({ params, searchParams }: PageProps<"/tariflar/[planId]/[teacherId]">) {
  const [{ planId, teacherId }, { demo }] = await Promise.all([params, searchParams]);
  if (!isPlanId(planId)) notFound();
  return <TeacherDetailPage planId={planId} teacherId={decodeURIComponent(teacherId)} scenario={parseScenario(demo)} />;
}

export default function Page(props: PageProps<"/tariflar/[planId]/[teacherId]">) {
  return (
    <Suspense>
      <Content {...props} />
    </Suspense>
  );
}
