import { useCallback, useEffect, useState } from "react";

export type TransactionType = "expense" | "income" | "saving";

export type Category =
  // Expense categories
  | "Housing"
  | "Food"
  | "Transportation"
  | "Entertainment"
  | "Shopping"
  | "Utilities"
  | "Other"
  // Income categories
  | "Salary"
  | "Freelance"
  | "Investment"
  | "Gift"
  // Saving categories
  | "Emergency Fund"
  | "Retirement"
  | "Vacation"
  | "General Savings";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: string;
}

export function useTransactions(userEmail: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!userEmail) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/transactions?userEmail=${encodeURIComponent(userEmail)}`,
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch transactions");
      }
      const data: Transaction[] = await res.json();
      setTransactions(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
      console.error("Failed to fetch transactions:", msg);
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  }, [userEmail]);

  useEffect(() => {
    if (!userEmail) {
      setTransactions([]);
      setIsLoaded(false);
      return;
    }
    fetchTransactions();
  }, [fetchTransactions, userEmail]);

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    if (!userEmail) return;
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...transaction, userEmail }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add transaction");
      }
      const newTransaction: Transaction = await res.json();
      setTransactions((prev) => [newTransaction, ...prev]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
      throw e;
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!userEmail) return;
    // Optimistic UI update
    const prev = transactions;
    setTransactions((t) => t.filter((tx) => tx.id !== id));
    try {
      const res = await fetch(`/api/transactions?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setTransactions(prev); // Rollback
        const err = await res.json();
        throw new Error(err.error || "Failed to delete transaction");
      }
    } catch (e: unknown) {
      setTransactions(prev); // Rollback on network error
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
    }
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    isLoaded,
    isLoading,
    error,
  };
}
