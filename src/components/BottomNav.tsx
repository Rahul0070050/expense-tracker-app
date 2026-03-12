"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface BottomNavProps {
  onAddClick: () => void;
}

export function BottomNav({ onAddClick }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 flex justify-center pointer-events-none">
      <div className="bg-[#0a0f1c]/80 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl shadow-blue-500/10 pointer-events-auto">
        <button 
          onClick={onAddClick}
          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40 text-white hover:scale-110 active:scale-90 transition-all"
        >
          <Plus className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
}
