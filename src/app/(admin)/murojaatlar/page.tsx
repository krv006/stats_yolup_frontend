import { Suspense } from "react";
import { SupportPage } from "@/views/support";
import { parseScenario } from "@/shared/api/demo-scenario";

async function Content({ searchParams }: Pick<PageProps<"/murojaatlar">, "searchParams">) {
  const { demo } = await searchParams;
  return <SupportPage scenario={parseScenario(demo)} />;
}

export default function Page(props: PageProps<"/murojaatlar">) {
  return (
    <Suspense>
      <Content searchParams={props.searchParams} />
    </Suspense>
  );
}
