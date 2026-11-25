import { Sidebar } from "@/widgets/sidebar";
import { Topbar } from "@/widgets/topbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex flex-1 flex-col px-8 pt-[25px] pb-[30px]">{children}</main>
      </div>
    </div>
  );
}
