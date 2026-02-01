import type { Transaction } from "../models/Transaction";

interface TransactionItemProps {
    transaction: Transaction;
    onEdit: (transaction: Transaction) => void; // <--- NEW PROP
    onDelete: (id: number) => void;
}

const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    }).format(date);
};

export const TransactionItem = ({ transaction: t, onEdit, onDelete }: TransactionItemProps) => {
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
            <div className="flex items-center gap-3 shrink-0">
                <span className={`font-bold text-lg whitespace-nowrap mr-2 ${t.amount < 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {t.amount < 0 ? '-' : '+'}${Math.abs(t.amount).toFixed(2)}
                </span>

                {/* EDIT BUTTON (Pencil) */}
                <button
                    onClick={() => onEdit(t)}
                    className="text-gray-500 hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-full hover:bg-gray-700"
                    aria-label="Edit"
                >
                    {/* Heroicons Pencil Square */}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>

                {/* DELETE BUTTON (X) */}
                <button
                    onClick={() => onDelete(t.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-full hover:bg-gray-700"
                    aria-label="Delete"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </li>
    );
};