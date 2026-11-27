import { Suspense } from "react";
import { DashboardPage, DashboardSkeleton } from "@/views/dashboard";
import { parseScenario } from "@/shared/api/demo-scenario";
import { CURRENT_USER } from "@/shared/config/session";

async function Content({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const { demo } = await searchParams;
  return <DashboardPage userName={CURRENT_USER.name} scenario={parseScenario(demo)} />;
}

export default function Page(props: PageProps<"/">) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Content searchParams={props.searchParams} />
    </Suspense>
  );
}
