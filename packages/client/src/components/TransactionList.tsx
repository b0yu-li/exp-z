import { useMemo, useState } from "react";
import type { Transaction } from "../models/Transaction";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

interface Props {
    transactions: Transaction[];
    onDelete: (id: number) => void;
}

const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(date);
    // Output: "Jan 28, 7:30 PM"
};

const formatDateHeader = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    // Check if the year matches the current year
    const isCurrentYear = date.getFullYear() === now.getFullYear();

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        // Conditionally include year if it's not the current year
        year: isCurrentYear ? undefined : 'numeric'
    }).format(date);
};

export const TransactionList = ({ transactions, onDelete }: Props) => {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Grouping Logic: Returns object { "2023-10-27": [Transaction, ...], ... }
    const groupedTransactions = useMemo(() => {
        const groups: Record<string, Transaction[]> = {};

        // Sort all transactions first by date descending
        const sorted = [...transactions].sort((a, b) => b.dateTime.localeCompare(a.dateTime));

        sorted.forEach(t => {
            // Create key "YYYY-MM-DD"
            const dateKey = t.dateTime.split('T')[0];
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(t);
        });

        return groups;
    }, [transactions]);

    // Get date keys sorted descending (Newest date first)
    const dateKeys = Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a));

    const confirmDelete = () => {
        if (deleteId !== null) {
            onDelete(deleteId);
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

                {/* Iterate over each Date Group */}
                <div className="space-y-8">
                    {dateKeys.map(dateKey => {
                        const dayTransactions = groupedTransactions[dateKey];
                        const dayTotal = dayTransactions.reduce((acc, t) => acc + t.amount, 0);

                        // We use the first transaction's full date string to format the header 
                        // to avoid timezone shifts if we just parsed "YYYY-MM-DD"
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
                                        : 'bg-gray-800 border-gray-700 text-gray-300'
                                        }`}>
                                        {dayTotal < 0 ? '-' : '+'}${Math.abs(dayTotal).toFixed(2)}
                                    </span>
                                </div>

                                {/* List for this day */}
                                <ul className="space-y-3">
                                    {dayTransactions.map((t) => (
                                        <li
                                            key={t.id}
                                            className={`group bg-gray-800 p-4 rounded-lg shadow-sm flex justify-between items-center border-l-4 transition-all hover:bg-gray-750 ${t.amount < 0 ? 'border-red-500' : 'border-green-500'
                                                }`}
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-gray-100 font-medium">{t.text}</span>
                                                {/* Show only time here since date is in header */}
                                                <span className="text-xs text-gray-500 mt-0.5 font-medium">
                                                    {formatDate(t.dateTime)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <span className={`font-bold text-lg ${t.amount < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                                    {t.amount < 0 ? '-' : '+'}${Math.abs(t.amount).toFixed(2)}
                                                </span>
                                                <button
                                                    onClick={() => setDeleteId(t.id)}
                                                    className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded-full hover:bg-gray-700"
                                                    aria-label="Delete transaction"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Render the Modal */}
            <DeleteConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
            />
        </>
    );
};