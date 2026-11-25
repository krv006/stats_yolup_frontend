import { notFound } from "next/navigation";
import { SectionPlaceholderPage } from "@/views/section-placeholder";
import { NAV_ITEMS } from "@/shared/config/navigation";

export function generateStaticParams() {
  return NAV_ITEMS.filter((item) => !item.ready).map((item) => ({ section: item.href.slice(1) }));
}

export default async function Page(props: PageProps<"/[section]">) {
  const { section } = await props.params;
  const item = NAV_ITEMS.find((nav) => !nav.ready && nav.href === `/${section}`);
  if (!item) notFound();
  return <SectionPlaceholderPage section={item} />;
}
