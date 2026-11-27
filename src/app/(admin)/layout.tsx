import { Suspense } from "react";
import { Sidebar, SidebarFallback } from "@/widgets/sidebar";
import { Topbar, TopbarFallback } from "@/widgets/topbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      {/* URL-aware chrome streams in; the fallbacks keep the shell identical. */}
      <Suspense fallback={<SidebarFallback />}>
        <Sidebar />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <Suspense fallback={<TopbarFallback />}>
          <Topbar />
        </Suspense>
        <main className="flex flex-1 flex-col px-8 pt-[25px] pb-[30px]">{children}</main>
      </div>
    </div>
  );
}
