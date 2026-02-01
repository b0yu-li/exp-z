import { useState } from "react";
import { useTransactions } from "../context/TransactionContext";
import { useTransactionHistory } from "../hooks/useTransactionHistory"; // <--- Import Hook
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { TransactionItem } from "./TransactionItem"; // <--- Import Component
import { EditTransactionModal } from "./EditTransactionModal";
import type { Transaction } from "../models/Transaction";

export const TransactionList = () => {
    const { transactions, deleteTransaction } = useTransactions();
    const { groupedTransactions, dateKeys, formatDateHeader } = useTransactionHistory(transactions); // <--- Use Hook
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null); // <--- New State

    const confirmDelete = () => {
        if (deleteId !== null) {
            deleteTransaction(deleteId);
            setDeleteId(null);
        }
    };

    return (
        <>
            <div className="mt-8">
                <h3 className="text-lg font-bold mb-6 text-gray-200 border-b border-gray-700 pb-2">History</h3>

                {transactions.length === 0 && (
                    <p className="text-gray-500 italic text-center py-4">No transactions yet.</p>
                )}

                <div className="space-y-8">
                    {dateKeys.map(dateKey => {
                        const dayTransactions = groupedTransactions[dateKey];
                        const dayTotal = dayTransactions.reduce((acc, t) => acc + t.amount, 0);
                        const headerLabel = formatDateHeader(dayTransactions[0].dateTime);

                        return (
                            <div key={dateKey} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {/* Day Header */}
                                <div className="flex justify-between items-end mb-3 px-1">
                                    <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest opacity-80">
                                        {headerLabel}
                                    </h4>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${dayTotal >= 0
                                        ? 'bg-gray-800 border-gray-700 text-gray-300'
                                        : 'bg-gray-800 border-gray-700 text-gray-300' // Keeping your gray style for negative headers too
                                        }`}>
                                        {dayTotal < 0 ? '-' : '+'}${Math.abs(dayTotal).toFixed(2)}
                                    </span>
                                </div>

                                {/* List for this day */}
                                <ul className="space-y-3">
                                    {dayTransactions.map((t) => (
                                        <TransactionItem
                                            key={t.id}
                                            transaction={t}
                                            onEdit={setEditingTransaction}
                                            onDelete={setDeleteId}
                                        />
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* EDIT MODAL (New) */}
            <EditTransactionModal
                isOpen={!!editingTransaction}
                transaction={editingTransaction}
                onClose={() => setEditingTransaction(null)}
            />

            <DeleteConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
            />
        </>
    );
};