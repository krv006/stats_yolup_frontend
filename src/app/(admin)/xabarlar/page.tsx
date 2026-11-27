import { Suspense } from "react";
import { AnnouncementsPage } from "@/views/announcements";
import { parseScenario } from "@/shared/api/demo-scenario";

async function Content({ searchParams }: Pick<PageProps<"/xabarlar">, "searchParams">) {
  const { demo } = await searchParams;
  return <AnnouncementsPage scenario={parseScenario(demo)} />;
}

export default function Page(props: PageProps<"/xabarlar">) {
  return (
    <Suspense>
      <Content searchParams={props.searchParams} />
    </Suspense>
  );
}
