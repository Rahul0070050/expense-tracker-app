"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, User, Wallet } from "lucide-react";
import { useState } from "react";

interface IdentityModalProps {
  isOpen: boolean;
  onConfirm: (name: string) => void;
}

export function IdentityModal({ isOpen, onConfirm }: IdentityModalProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onConfirm(name.trim());
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0a0f1c]/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 p-4 rounded-2xl bg-indigo-500/20 border border-indigo-500/20">
                <Wallet className="w-10 h-10 text-indigo-400" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                Welcome Back
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Please enter your name to access your personalized expense
                tracker.
              </p>

              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    autoFocus
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:grayscale py-4 rounded-2xl text-white font-semibold transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                >
                  Start Tracking <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
