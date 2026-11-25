import { Suspense } from "react";
import { OverviewSkeleton, PlansOverviewPage } from "@/views/plans-overview";
import { parseScenario } from "@/shared/api/demo-scenario";

async function Content({ searchParams }: Pick<PageProps<"/tariflar/sozlamalar">, "searchParams">) {
  const { demo } = await searchParams;
  return <PlansOverviewPage mode="settings" scenario={parseScenario(demo)} />;
}

export default function Page(props: PageProps<"/tariflar/sozlamalar">) {
  return (
    <Suspense fallback={<OverviewSkeleton />}>
      <Content searchParams={props.searchParams} />
    </Suspense>
  );
}
