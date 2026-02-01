import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { Transaction } from "../models/Transaction";

interface TransactionContextType {
    transactions: Transaction[];
    addTransaction: (transaction: Transaction) => void;
    deleteTransaction: (id: number) => void;
    exportData: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
    // 1. STATE with Lazy Initialization
    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        const saved = localStorage.getItem('exp-z-data');
        return saved ? JSON.parse(saved) : [];
    });

    // 2. PERSISTENCE
    useEffect(() => {
        localStorage.setItem('exp-z-data', JSON.stringify(transactions));
    }, [transactions]);

    // 3. ACTIONS
    const addTransaction = useCallback((transaction: Transaction) => {
        setTransactions(prev => [transaction, ...prev]);
    }, []);

    const deleteTransaction = useCallback((id: number) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    }, []);

    const exportData = useCallback(() => {
        const jsonString = JSON.stringify(transactions, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = `exp-z-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    }, [transactions]);

    return (
        <TransactionContext.Provider value={{ transactions, addTransaction, deleteTransaction, exportData }}>
            {children}
        </TransactionContext.Provider>
    );
};

// Custom Hook for easy access
export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error("useTransactions must be used within a TransactionProvider");
    }
    return context;
};