"use client";

import { ArrowDownRight, PiggyBank } from "lucide-react";
import { motion } from "framer-motion";

interface BottomNavProps {
  onAddExpense: () => void;
  onAddSaving: () => void;
}

export function BottomNav({ onAddExpense, onAddSaving }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 flex justify-center pointer-events-none">
      <div className="bg-[#0a0f1c]/80 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl flex gap-2 pointer-events-auto">
        <button 
          onClick={onAddSaving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full text-white font-semibold shadow-lg shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all w-32 justify-center"
        >
          <PiggyBank className="w-5 h-5" />
          <span>Savings</span>
        </button>
        <button 
          onClick={onAddExpense}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full text-white font-semibold shadow-lg shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all w-32 justify-center"
        >
          <ArrowDownRight className="w-5 h-5" />
          <span>Expense</span>
        </button>
      </div>
    </div>
  );
}
