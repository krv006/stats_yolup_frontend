import { Suspense } from "react";
import { DashboardPage, DashboardSkeleton } from "@/views/dashboard";
import { parseScenario } from "@/shared/api/demo-scenario";

const USER_NAME = "vintozer"; // TODO(auth): from session

async function Content({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const { demo } = await searchParams;
  return <DashboardPage userName={USER_NAME} scenario={parseScenario(demo)} />;
}

export default function Page(props: PageProps<"/">) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Content searchParams={props.searchParams} />
    </Suspense>
  );
}
