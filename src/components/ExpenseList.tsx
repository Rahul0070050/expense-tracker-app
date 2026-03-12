"use client";

import { Transaction } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Car,
  Film,
  Gift,
  Home,
  MoreHorizontal,
  PiggyBank,
  Plane,
  ShoppingBag,
  Trash2,
  TrendingUp,
  Umbrella,
  Utensils,
  Zap,
} from "lucide-react";
import React from "react";

interface ExpenseListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const CategoryIcon = ({
  category,
  type,
}: {
  category: string;
  type: string;
}) => {
  const base = "p-2.5 rounded-xl";
  const icons: Record<string, React.ReactNode> = {
    Housing: (
      <div className={`${base} bg-orange-500/20 text-orange-400`}>
        <Home className="w-5 h-5" />
      </div>
    ),
    Food: (
      <div className={`${base} bg-emerald-500/20 text-emerald-400`}>
        <Utensils className="w-5 h-5" />
      </div>
    ),
    Transportation: (
      <div className={`${base} bg-blue-500/20 text-blue-400`}>
        <Car className="w-5 h-5" />
      </div>
    ),
    Entertainment: (
      <div className={`${base} bg-purple-500/20 text-purple-400`}>
        <Film className="w-5 h-5" />
      </div>
    ),
    Shopping: (
      <div className={`${base} bg-pink-500/20 text-pink-400`}>
        <ShoppingBag className="w-5 h-5" />
      </div>
    ),
    Utilities: (
      <div className={`${base} bg-yellow-500/20 text-yellow-400`}>
        <Zap className="w-5 h-5" />
      </div>
    ),
    Salary: (
      <div className={`${base} bg-emerald-500/20 text-emerald-400`}>
        <Briefcase className="w-5 h-5" />
      </div>
    ),
    Freelance: (
      <div className={`${base} bg-teal-500/20 text-teal-400`}>
        <TrendingUp className="w-5 h-5" />
      </div>
    ),
    Investment: (
      <div className={`${base} bg-indigo-500/20 text-indigo-400`}>
        <TrendingUp className="w-5 h-5" />
      </div>
    ),
    Gift: (
      <div className={`${base} bg-rose-500/20 text-rose-400`}>
        <Gift className="w-5 h-5" />
      </div>
    ),
    "Emergency Fund": (
      <div className={`${base} bg-red-500/20 text-red-400`}>
        <Umbrella className="w-5 h-5" />
      </div>
    ),
    Retirement: (
      <div className={`${base} bg-slate-500/20 text-slate-300`}>
        <PiggyBank className="w-5 h-5" />
      </div>
    ),
    Vacation: (
      <div className={`${base} bg-cyan-500/20 text-cyan-400`}>
        <Plane className="w-5 h-5" />
      </div>
    ),
    "General Savings": (
      <div className={`${base} bg-blue-500/20 text-blue-400`}>
        <PiggyBank className="w-5 h-5" />
      </div>
    ),
  };
  return (
    icons[category] ?? (
      <div className={`${base} bg-slate-500/20 text-slate-400`}>
        <MoreHorizontal className="w-5 h-5" />
      </div>
    )
  );
};

const TYPE_CONFIG = {
  expense: {
    prefix: "-",
    cls: "text-rose-400",
    badge: "bg-rose-500/15 text-rose-400",
  },
  income: {
    prefix: "+",
    cls: "text-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-400",
  },
  saving: {
    prefix: "+",
    cls: "text-blue-400",
    badge: "bg-blue-500/15 text-blue-400",
  },
};

export function ExpenseList({ transactions, onDelete }: ExpenseListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400 border border-white/5 rounded-2xl bg-slate-900/20 backdrop-blur-md">
        <div className="w-16 h-16 mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
          <Zap className="w-8 h-8 text-slate-500" />
        </div>
        <p className="text-lg font-medium text-slate-300">
          No transactions yet
        </p>
        <p className="text-sm mt-1">Add a transaction to get started</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl h-full">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          Recent Transactions
        </h2>
        <span className="text-sm font-medium text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full">
          {transactions.length} Total
        </span>
      </div>
      <div className="p-2">
        <div className="max-h-[500px] overflow-y-auto pr-1 custom-scrollbar space-y-1">
          <AnimatePresence initial={false}>
            {transactions.map((tx, i) => {
              const cfg = TYPE_CONFIG[tx.type];
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                    transition: { duration: 0.15 },
                  }}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  transition={{ duration: 0.2, delay: Math.min(i * 0.04, 0.4) }}
                  className="group flex items-center justify-between p-4 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-4">
                    <CategoryIcon category={tx.category} type={tx.type} />
                    <div>
                      <p className="font-semibold text-slate-200">
                        {tx.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-md capitalize ${cfg.badge}`}
                        >
                          {tx.type}
                        </span>
                        <span className="text-xs text-slate-500">
                          {tx.category}
                        </span>
                        <span className="text-xs text-slate-600">•</span>
                        <span className="text-xs text-slate-500">
                          {formatDate(tx.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold text-lg ${cfg.cls}`}>
                      {cfg.prefix}
                      {formatCurrency(tx.amount)}
                    </span>
                    <button
                      onClick={() => onDelete(tx.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                      aria-label="Delete transaction"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
