import type { Transaction } from "../models/Transaction";

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

const sortTransactionsChronologically = (transactions: Transaction[]): Transaction[] => {
    // TODO: sort by `Transaction.dateTime` string
    return transactions.sort((a, b) => Date.parse(b.dateTime) - Date.parse(a.dateTime))
}

export const TransactionList = ({ transactions, onDelete }: Props) => {
    const sortedTransactions = sortTransactionsChronologically(transactions);
    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold mb-4 text-gray-200 border-b border-gray-600 pb-2">History</h3>
            <ul className="space-y-3">
                {sortedTransactions.length === 0 && (
                    <p className="text-gray-500 italic">No transactions yet.</p>
                )}
                {sortedTransactions.map((t) => (
                    <li
                        key={t.id}
                        className={`bg-white p-3 rounded shadow-sm flex justify-between items-center border-l-4 ${t.amount < 0 ? 'border-red-500' : 'border-green-500'
                            }`}
                    >
                        <div className="flex flex-col">
                            <span className="text-gray-800 font-medium">{t.text}</span>
                            {/* NEW: Smaller, lighter text for the date */}
                            <span className="text-gray-400 text-xs">
                                {formatDate(t.dateTime)}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`font-bold ${t.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {t.amount < 0 ? '-' : '+'}${Math.abs(t.amount).toFixed(2)}
                            </span>
                            <button
                                onClick={() => onDelete(t.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
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
};