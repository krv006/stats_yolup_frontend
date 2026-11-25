import { Suspense } from "react";
import { OverviewSkeleton, PlansOverviewPage } from "@/views/plans-overview";
import { parseScenario } from "@/shared/api/demo-scenario";

async function Content({ searchParams }: Pick<PageProps<"/tariflar">, "searchParams">) {
  const { demo } = await searchParams;
  return <PlansOverviewPage mode="overview" scenario={parseScenario(demo)} />;
}

export default function Page(props: PageProps<"/tariflar">) {
  return (
    <Suspense fallback={<OverviewSkeleton />}>
      <Content searchParams={props.searchParams} />
    </Suspense>
  );
}
