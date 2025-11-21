import Link from "next/link";
import { ReactNode } from "react";
import { Sidebar } from "@/components/ui/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-slate-950 to-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-4 py-4 md:px-8 md:py-6">
        {children}
      </main>
    </div>
  );
}
