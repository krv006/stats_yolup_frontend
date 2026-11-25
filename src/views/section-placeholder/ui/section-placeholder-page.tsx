import type { NavItem } from "@/shared/config/navigation";
import { Panel } from "@/shared/ui/panel";

export function SectionPlaceholderPage({ section }: { section: NavItem }) {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <h1 className="text-display text-ink">{section.label}</h1>
      <Panel className="flex flex-1 items-center justify-center p-10 text-body text-ink-secondary">
        Bu bo‘lim tez orada qo‘shiladi.
      </Panel>
    </div>
  );
}
