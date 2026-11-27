import { Suspense } from "react";
import { TeachersPage } from "@/views/teachers";
import { parseScenario } from "@/shared/api/demo-scenario";

async function Content({ searchParams }: Pick<PageProps<"/oqituvchilar">, "searchParams">) {
  const { demo } = await searchParams;
  return <TeachersPage scenario={parseScenario(demo)} />;
}

export default function Page(props: PageProps<"/oqituvchilar">) {
  return (
    <Suspense>
      <Content searchParams={props.searchParams} />
    </Suspense>
  );
}
