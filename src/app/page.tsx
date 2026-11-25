import { LayoutDashboard } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <LayoutDashboard size={32} />
      <h1>Yo'Up Dashboard</h1>
    </div>
  );
}
