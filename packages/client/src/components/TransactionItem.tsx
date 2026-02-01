import type { Transaction } from "../models/Transaction";

interface TransactionItemProps {
    transaction: Transaction;
    onDelete: (id: number) => void;
}

const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    }).format(date);
};

export const TransactionItem = ({ transaction: t, onDelete }: TransactionItemProps) => {
    return (
        <li className={`group bg-gray-800 p-4 rounded-lg shadow-sm flex justify-between items-center border-l-4 transition-all hover:bg-gray-750 ${t.amount < 0 ? 'border-red-500' : 'border-green-500'
            }`}>
            {/* LEFT SIDE: Text & Date */}
            <div className="flex flex-col flex-1 min-w-0 pr-4">
                <span className="text-gray-100 font-medium break-words">
                    {t.text}
                </span>
                <span className="text-xs text-gray-500 mt-0.5 font-medium">
                    {formatTime(t.dateTime)}
                </span>
            </div>

            {/* RIGHT SIDE: Amount & Delete Button */}
            <div className="flex items-center gap-4 shrink-0">
                <span
                    className={`font-bold text-lg whitespace-nowrap ${t.amount < 0 ? 'text-red-400' : 'text-green-400'
                        }`}
                >
                    {t.amount < 0 ? '-' : '+'}${Math.abs(t.amount).toFixed(2)}
                </span>
                <button
                    onClick={() => onDelete(t.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded-full hover:bg-gray-700"
                    aria-label="Delete transaction"
                >
                    ✕
                </button>
            </div>
        </li>
    );
};