"use client";

import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export function BarChart({ data }: { data: any[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 h-64">
      <h3 className="text-sm font-semibold text-slate-300 mb-3">
        Risparmio annuo per categoria
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={data}>
          <XAxis dataKey="categoria" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip />
          <Bar dataKey="risparmio_annuo" fill="#22c55e" radius={[4, 4, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}
