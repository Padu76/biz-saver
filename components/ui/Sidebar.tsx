"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Panoramica" },
  { href: "/upload", label: "Carica documenti" },
  { href: "/report", label: "Report risparmi" },
  { href: "/history", label: "Storico analisi" }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r border-slate-800 bg-black/60 px-4 py-5 text-sm text-slate-200 md:flex">
      <div className="mb-6 flex items-center gap-2 px-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20 ring-1 ring-accent/40">
          <span className="text-lg font-bold text-accent">λ</span>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-accent">
            BizSaver AI
          </div>
          <p className="text-[11px] text-slate-400">Control panel</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-accent/20 text-accent"
                  : "text-slate-300 hover:bg-slate-900 hover:text-accent"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-[11px] text-slate-400">
        <div className="mb-1 text-xs font-semibold text-slate-200">
          Suggerimento
        </div>
        Collega questo pannello alla tua logica di analisi AI e ai dati reali per
        trasformarlo in un assistente di risparmio sempre aggiornato.
      </div>
    </aside>
  );
}
