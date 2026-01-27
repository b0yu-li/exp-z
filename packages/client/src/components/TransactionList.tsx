export interface Transaction {
    id: number;
    text: string;
    amount: number;
}

interface Props {
    transactions: Transaction[];
    onDelete: (id: number) => void;
}

export const TransactionList = ({ transactions, onDelete }: Props) => {
    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold mb-4 text-gray-200 border-b border-gray-600 pb-2">History</h3>
            <ul className="space-y-3">
                {transactions.length === 0 && (
                    <p className="text-gray-500 italic">No transactions yet.</p>
                )}
                {transactions.map((t) => (
                    <li
                        key={t.id}
                        className={`bg-white p-3 rounded shadow-sm flex justify-between items-center border-l-4 ${t.amount < 0 ? 'border-red-500' : 'border-green-500'
                            }`}
                    >
                        <span className="text-gray-700">{t.text}</span>
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