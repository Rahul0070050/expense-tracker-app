"use client";

import { Home, Plus, Settings, Wallet } from "lucide-react";
import { motion } from "framer-motion";

interface BottomNavProps {
  onAddClick: () => void;
}

export function BottomNav({ onAddClick }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 md:hidden">
      <div className="mx-auto max-w-md bg-[#0a0f1c]/80 backdrop-blur-xl border border-white/10 rounded-3xl h-18 flex items-center justify-around px-2 shadow-2xl shadow-blue-500/10">
        <button className="flex flex-col items-center gap-1 p-2 text-blue-400">
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        
        <button className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-blue-400 transition-colors">
          <Wallet className="w-6 h-6" />
          <span className="text-[10px] font-medium">History</span>
        </button>

        <button 
          onClick={onAddClick}
          className="relative -top-3 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40 text-white hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-8 h-8" />
        </button>

        <button className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-blue-400 transition-colors">
          <motion.div>
             <Settings className="w-6 h-6" />
          </motion.div>
          <span className="text-[10px] font-medium">More</span>
        </button>

        <div className="w-10 flex flex-col items-center gap-1 p-2 opacity-0">
            {/* Spacer for character look */}
        </div>
      </div>
    </div>
  );
}
