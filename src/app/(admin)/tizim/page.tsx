import { Suspense } from "react";
import { SystemHealthPage } from "@/views/system-health";
import { parseScenario } from "@/shared/api/demo-scenario";

async function Content({ searchParams }: Pick<PageProps<"/tizim">, "searchParams">) {
  const { demo } = await searchParams;
  return <SystemHealthPage scenario={parseScenario(demo)} />;
}

export default function Page(props: PageProps<"/tizim">) {
  return (
    <Suspense>
      <Content searchParams={props.searchParams} />
    </Suspense>
  );
}
