"use client";

import { useTransactions } from "@/lib/store";
import { motion } from "framer-motion";
import { LogOut, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AddTransactionModal } from "./AddExpenseModal";
import { BiometricAuth } from "./BiometricAuth";
import { BottomNav } from "./BottomNav";
import { ExpenseChart } from "./ExpenseChart";
import { ExpenseList } from "./ExpenseList";
import { ExpenseSummary } from "./ExpenseSummary";
import { IdentityModal } from "./IdentityModal";
import { InstallPrompt } from "./InstallPrompt";
import { SetupGuide } from "./SetupGuide";

export function Dashboard() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [isFullyAuthenticated, setIsFullyAuthenticated] = useState(false);
  const [addingType, setAddingType] = useState<"expense" | "saving" | null>(null);

  // Load identity from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("expense_user_name");
    if (savedUser) {
      setCurrentUser(savedUser);
    } else {
      setShowIdentityModal(true);
    }
  }, []);

  const { transactions, addTransaction, deleteTransaction, isLoaded, error } =
    useTransactions(isFullyAuthenticated ? currentUser : null);

  const handleIdentityConfirm = (name: string) => {
    const standardizedName = name.trim().toLowerCase();
    localStorage.setItem("expense_user_name", standardizedName);
    setCurrentUser(standardizedName);
    setShowIdentityModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("expense_user_name");
    localStorage.removeItem("expense_auth_credential");
    setCurrentUser(null);
    setIsFullyAuthenticated(false);
    setShowIdentityModal(true);
  };

  const isConfigError = error?.includes("SHEETDB_API_URL");

  if (isConfigError) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] text-white flex items-center justify-center p-4">
        <SetupGuide />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24 md:pb-8">
      {currentUser && !isFullyAuthenticated && !showIdentityModal && (
        <BiometricAuth
          username={currentUser}
          onAuthenticated={() => setIsFullyAuthenticated(true)}
        />
      )}

      <IdentityModal
        isOpen={showIdentityModal}
        onConfirm={handleIdentityConfirm}
      />

      {/* Decorative gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <nav className="border-b border-white/5 bg-[#0a0f1c]/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Tracker
              </h1>
            </div>

            {currentUser && (
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/5">
                  <UserIcon className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-300 truncate max-w-[80px] lg:max-w-[150px]">
                    {currentUser}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Switch User"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {!isLoaded && !error ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-slate-400 font-medium">
                  Loading your finances...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <ExpenseSummary
                transactions={transactions}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <ExpenseList
                    transactions={transactions}
                    onDelete={deleteTransaction}
                  />
                </div>
                <div className="lg:col-span-1">
                  <ExpenseChart transactions={transactions} />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <BottomNav 
        onAddExpense={() => setAddingType("expense")}
        onAddSaving={() => setAddingType("saving")}
      />
      <InstallPrompt />

      <AddTransactionModal
        isOpen={addingType !== null}
        type={addingType || "expense"}
        onClose={() => setAddingType(null)}
        onAdd={addTransaction}
      />
    </div>
  );
}
