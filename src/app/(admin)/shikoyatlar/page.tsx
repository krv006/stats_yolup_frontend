import { Suspense } from "react";
import { ComplaintsPage } from "@/views/complaints";
import { parseScenario } from "@/shared/api/demo-scenario";

async function Content({ searchParams }: Pick<PageProps<"/shikoyatlar">, "searchParams">) {
  const { demo } = await searchParams;
  return <ComplaintsPage scenario={parseScenario(demo)} />;
}

export default function Page(props: PageProps<"/shikoyatlar">) {
  return (
    <Suspense>
      <Content searchParams={props.searchParams} />
    </Suspense>
  );
}
