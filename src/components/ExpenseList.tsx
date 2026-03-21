"use client";

import { Transaction } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Car,
  ChevronLeft,
  ChevronRight,
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
  X,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const selectedDateTransactions = transactions.filter((tx) =>
    isSameDay(parseISO(tx.date), selectedDate),
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl h-full">
      {/* Calendar Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-800/20">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-white tracking-tight">
          {format(currentMonth, dateFormat)}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="p-4 border-b border-white/5">
        <div className="grid grid-cols-7 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((dayName) => (
            <div
              key={dayName}
              className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider py-1"
            >
              {dayName}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const hasExpense = transactions.some(
              (t) => t.type === "expense" && isSameDay(parseISO(t.date), day),
            );
            const hasSaving = transactions.some(
              (t) => t.type === "saving" && isSameDay(parseISO(t.date), day),
            );
            const hasIncome = transactions.some(
              (t) => t.type === "income" && isSameDay(parseISO(t.date), day),
            );

            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isTodayDate = isToday(day);

            let dayClass =
              "relative flex flex-col items-center justify-center p-2 rounded-xl transition-all aspect-square cursor-pointer font-medium text-sm border border-transparent ";

            if (!isCurrentMonth) {
              dayClass += "text-slate-600/50 ";
            } else if (isSelected) {
              dayClass +=
                "bg-blue-600 text-white shadow-lg shadow-blue-500/30 font-bold scale-105 z-10 ";
            } else if (isTodayDate) {
              dayClass +=
                "text-blue-400 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 ";
            } else {
              dayClass += "text-slate-300 hover:bg-slate-800 ";
            }

            return (
              <div
                key={day.toISOString()}
                className={dayClass}
                onClick={() => {
                  setSelectedDate(day);
                  setIsModalOpen(true);
                }}
              >
                <span>{format(day, "d")}</span>

                {/* Indicators */}
                <div className="flex gap-1 mt-1 absolute bottom-1.5 flex-wrap justify-center w-full px-1">
                  {hasIncome && (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.8)]" />
                  )}
                  {hasSaving && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_4px_rgba(96,165,250,0.8)]" />
                  )}
                  {hasExpense && (
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_4px_rgba(251,113,133,0.8)]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Transactions Modal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsModalOpen(false)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
                />

                {/* Modal Content */}
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.95 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto max-h-[85vh]"
                >
                  {/* Header */}
                  <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-800/40">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold text-slate-200">
                        {isToday(selectedDate)
                          ? "Today's Transactions"
                          : format(selectedDate, "MMMM d, yyyy")}
                      </h3>
                      <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-white/5">
                        {selectedDateTransactions.length} items
                      </span>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* List */}
                  <div className="p-2 overflow-y-auto custom-scrollbar flex-1 bg-slate-900/50 min-h-[50vh] sm:min-h-[auto]">
                    {selectedDateTransactions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-12 text-slate-500 opacity-80 h-full">
                        <span className="text-sm border border-slate-700/50 rounded-xl px-6 py-4 border-dashed bg-slate-800/20">
                          No transactions on this date
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1 pb-10 sm:pb-0">
                        <AnimatePresence initial={false}>
                          {selectedDateTransactions.map((tx, i) => {
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
                                whileHover={{
                                  backgroundColor: "rgba(255,255,255,0.03)",
                                }}
                                transition={{
                                  duration: 0.2,
                                  delay: Math.min(i * 0.04, 0.4),
                                }}
                                className="group flex items-center justify-between p-4 rounded-xl transition-all"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-3">
                                  <div className="flex items-center gap-3 sm:gap-4">
                                    <CategoryIcon
                                      category={tx.category}
                                      type={tx.type}
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p className="font-semibold text-slate-200 truncate">
                                        {tx.description}
                                      </p>
                                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                                        <span
                                          className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-md capitalize ${cfg.badge}`}
                                        >
                                          {tx.type}
                                        </span>
                                        <span className="hidden xs:inline text-xs text-slate-600">
                                          •
                                        </span>
                                        <span className="text-[10px] sm:text-xs text-slate-500 truncate">
                                          {tx.category}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between sm:justify-end gap-3 pl-12 sm:pl-0">
                                    <span
                                      className={`font-bold text-base sm:text-lg whitespace-nowrap ${cfg.cls}`}
                                    >
                                      {cfg.prefix}
                                      {formatCurrency(tx.amount)}
                                    </span>
                                    <button
                                      onClick={() => onDelete(tx.id)}
                                      className="opacity-100 sm:opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                                      aria-label="Delete transaction"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
