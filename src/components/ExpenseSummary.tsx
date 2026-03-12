"use client";

import { Transaction } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowDownRight, PiggyBank, Target, Wallet } from "lucide-react";

interface ExpenseSummaryProps {
  transactions: Transaction[];
  onAddClick?: () => void;
}

const SAVINGS_TARGET = 50000;

export function ExpenseSummary({
  transactions,
  onAddClick,
}: ExpenseSummaryProps) {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalSavings = transactions
    .filter((t) => t.type === "saving")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalSavings - totalExpenses;
  const savingsProgress = Math.min((totalSavings / SAVINGS_TARGET) * 100, 100);

  const cards = [
    {
      title: "Net Balance",
      value: formatCurrency(balance),
      icon: <Wallet className="w-5 h-5" />,
      highlight: balance >= 0 ? "text-emerald-400" : "text-rose-400",
      bgClass: "bg-indigo-950/30 border-indigo-500/20",
      iconClass: "text-indigo-400",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(totalExpenses),
      icon: <ArrowDownRight className="w-5 h-5" />,
      highlight: "text-rose-400",
      bgClass: "bg-rose-950/30 border-rose-500/20",
      iconClass: "text-rose-400",
    },
    {
      title: "Total Savings",
      value: formatCurrency(totalSavings),
      icon: <PiggyBank className="w-5 h-5" />,
      highlight: "text-blue-400",
      bgClass: "bg-blue-950/30 border-blue-500/20",
      iconClass: "text-blue-400",
    },
    {
      title: "Savings Goal",
      value: `${savingsProgress.toFixed(1)}%`,
      icon: <Target className="w-5 h-5" />,
      highlight: "text-amber-400",
      bgClass: "bg-amber-950/30 border-amber-500/20",
      iconClass: "text-amber-400",
      isProgress: true,
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className={`relative overflow-hidden rounded-2xl border backdrop-blur-md p-6 ${card.bgClass} shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] transition-all duration-300 hover:-translate-y-1 group`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium tracking-wide text-sm uppercase">
              {card.title}
            </h3>
            <div
              className={`p-2 rounded-xl bg-slate-900/50 border border-white/5 ${card.iconClass}`}
            >
              {card.icon}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span
              className={`text-3xl font-bold tracking-tight ${card.highlight}`}
            >
              {card.value}
            </span>
            {card.isProgress && (
              <div className="mt-2">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${savingsProgress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-amber-400"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-bold">
                  Target: {formatCurrency(SAVINGS_TARGET)}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
