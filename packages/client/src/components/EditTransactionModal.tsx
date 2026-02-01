import { useEffect, useState } from "react";
import { useTransactions } from "../context/TransactionContext";
import type { Transaction } from "../models/Transaction";

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
}

export const EditTransactionModal = ({ isOpen, onClose, transaction }: EditModalProps) => {
    const { editTransaction } = useTransactions();

    // Local State
    const [text, setText] = useState('');
    const [amount, setAmount] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [isExpense, setIsExpense] = useState(true);

    // 1. Populate form when transaction changes
    useEffect(() => {
        if (transaction) {
            setText(transaction.text);
            setAmount(Math.abs(transaction.amount).toString());
            setDateTime(transaction.dateTime);
            setIsExpense(transaction.amount < 0);
        }
    }, [transaction]);

    if (!isOpen || !transaction) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const val = parseFloat(amount);
        const finalAmount = isExpense ? -Math.abs(val) : Math.abs(val);

        editTransaction({
            ...transaction, // Keep original ID
            text,
            amount: finalAmount,
            dateTime
        });

        onClose();
    };

    return (
        // TODO: - I don't see any animations yet?
        <div className="modal-open fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-2xl max-w-sm w-full relative z-10">
                <h3 className="text-xl font-bold text-gray-100 mb-4">Edit Transaction</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Toggle */}
                    <div className="grid grid-cols-2 gap-4 p-1 bg-gray-900 rounded-lg">
                        <label className={`flex justify-center items-center cursor-pointer p-2 rounded-md transition-all ${isExpense ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'text-gray-400 hover:bg-gray-800'}`}>
                            <input type="radio" checked={isExpense} onChange={() => setIsExpense(true)} className="hidden" />
                            <span className="font-semibold text-sm">Expense</span>
                        </label>
                        <label className={`flex justify-center items-center cursor-pointer p-2 rounded-md transition-all ${!isExpense ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'text-gray-400 hover:bg-gray-800'}`}>
                            <input type="radio" checked={!isExpense} onChange={() => setIsExpense(false)} className="hidden" />
                            <span className="font-semibold text-sm">Income</span>
                        </label>
                    </div>

                    {/* Inputs */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Description</label>
                        <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full rounded-md bg-gray-700 border-gray-600 text-white p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Amount</label>
                        <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full rounded-md bg-gray-700 border-gray-600 text-white p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Date</label>
                        <input type="datetime-local" value={dateTime.slice(0, 16)} onChange={e => setDateTime(e.target.value)} className="w-full rounded-md bg-gray-700 border-gray-600 text-white p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg text-gray-300 font-medium hover:bg-gray-700 transition-colors">Cancel</button>
                        <button type="submit" className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-500/30">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};