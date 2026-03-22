"use client";

import { Category, TransactionType } from "@/lib/store";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { AlignLeft, Calendar, IndianRupee, Plus, Tag, X } from "lucide-react";
import { useEffect, useState } from "react";

interface AddTransactionModalProps {
  isOpen: boolean;
  type: "expense" | "saving";
  onClose: () => void;
  onAdd: (transaction: {
    type: TransactionType;
    amount: number;
    category: Category;
    description: string;
    date: string;
  }) => Promise<void>;
}

const CATEGORIES_BY_TYPE: Record<"expense" | "saving", Category[]> = {
  expense: [
    "Housing",
    "Food",
    "Transportation",
    "Entertainment",
    "Shopping",
    "Utilities",
    "Other",
  ],
  saving: ["Emergency Fund", "Retirement", "Vacation", "General Savings"],
};

const TYPE_STYLES: Record<
  "expense" | "saving",
  { label: string; accent: string; bg: string; ring: string }
> = {
  expense: {
    label: "Expense",
    accent: "text-rose-400",
    bg: "bg-rose-500/20",
    ring: "focus:border-rose-500 focus:ring-rose-500",
  },
  saving: {
    label: "Saving",
    accent: "text-blue-400",
    bg: "bg-blue-500/20",
    ring: "focus:border-blue-500 focus:ring-blue-500",
  },
};

export function AddTransactionModal({
  isOpen,
  type,
  onClose,
  onAdd,
}: AddTransactionModalProps) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCategory(CATEGORIES_BY_TYPE[type][0]);
      setAmount("");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [isOpen, type]);

  const style = TYPE_STYLES[type as "expense" | "saving"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || !description) return;
    setIsSubmitting(true);
    try {
      await onAdd({
        type,
        amount: Number(amount),
        category: type === "saving" ? "General Savings" : category,
        description,
        date: new Date(date).toISOString(),
      });

      if (type === "saving") {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          zIndex: 1000,
          colors: ["#60a5fa", "#3b82f6", "#818cf8", "#cbd5e1", "#e2e8f0"],
        });
      }

      setAmount("");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Add Transaction</h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Amount */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Amount
                </label>
                <div className="relative">
                  <IndianRupee className="absolute inset-y-0 left-3 my-auto h-5 w-5 text-slate-400 pointer-events-none" />
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={`block w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-slate-500 outline-none focus:ring-1 transition-all ${style.ring}`}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Description
                </label>
                <div className="relative">
                  <AlignLeft className="absolute inset-y-0 left-3 my-auto h-5 w-5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`block w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-slate-500 outline-none focus:ring-1 transition-all ${style.ring}`}
                    placeholder="What was it for?"
                  />
                </div>
              </div>

              {/* Category */}
              {type === "expense" && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">
                    Category
                  </label>
                  <div className="relative">
                    <Tag className="absolute inset-y-0 left-3 my-auto h-5 w-5 text-slate-400 pointer-events-none" />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className={`block w-full appearance-none rounded-xl border border-white/10 bg-slate-800 py-3 pl-10 pr-4 text-white outline-none focus:ring-1 transition-all ${style.ring}`}
                    >
                      {CATEGORIES_BY_TYPE[type as "expense" | "saving"].map(
                        (c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>
              )}

              {/* Date */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute inset-y-0 left-3 my-auto h-5 w-5 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`block w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white outline-none focus:ring-1 transition-all [color-scheme:dark] ${style.ring}`}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${
                    type === "expense"
                      ? "bg-gradient-to-r from-rose-500 to-pink-600"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                  ) : (
                    <>
                      <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
                      Add {TYPE_STYLES[type as "expense" | "saving"].label}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
