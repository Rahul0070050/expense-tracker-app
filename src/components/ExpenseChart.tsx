"use client";

import { Transaction } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { useMemo } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface ExpenseChartProps {
  transactions: Transaction[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Housing: "#f97316",
  Food: "#10b981",
  Transportation: "#3b82f6",
  Entertainment: "#a855f7",
  Shopping: "#ec4899",
  Utilities: "#eab308",
  Salary: "#22c55e",
  Freelance: "#14b8a6",
  Investment: "#6366f1",
  Gift: "#fb7185",
  "Emergency Fund": "#ef4444",
  Retirement: "#94a3b8",
  Vacation: "#06b6d4",
  "General Savings": "#3b82f6",
  Other: "#64748b",
};

export function ExpenseChart({ transactions }: ExpenseChartProps) {
  const data = useMemo(() => {
    const grouped = transactions.reduce(
      (acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl shadow-2xl h-full flex flex-col">
        <h2 className="text-xl font-semibold text-white tracking-tight mb-4">
          By Category
        </h2>
        <div className="flex flex-1 items-center justify-center text-slate-500">
          No data yet
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl shadow-2xl h-full flex flex-col">
      <h2 className="mb-4 text-xl font-semibold text-white tracking-tight">
        By Category
      </h2>
      <div className="flex-1 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              cornerRadius={6}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CATEGORY_COLORS[entry.name] ?? CATEGORY_COLORS.Other}
                  className="outline-none hover:opacity-80 transition-opacity"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [
                formatCurrency(Number(value) || 0),
                "Amount",
              ]}
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "#fff",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
              }}
              itemStyle={{ color: "#e2e8f0" }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-slate-300 text-sm font-medium">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
