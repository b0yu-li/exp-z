import { useState } from 'react';
import type { Transaction } from '../models/Transaction';

interface Props {
    onAdd: (transaction: Transaction) => void;
}

// HELPER: Get current local time in YYYY-MM-DDTHH:mm format
const getLocalISOString = () => {
    const now = new Date();
    // getTimezoneOffset() returns minutes relative to UTC (e.g., -480 for GMT+8)
    // We subtract it to shift the time "forward" to match local clock time in the ISO string
    const offset = now.getTimezoneOffset() * 60_000;
    const localDate = new Date(now.getTime() - offset);
    return localDate.toISOString();
};

export const AddTransactionForm = ({ onAdd }: Props) => {
    // 2. Local State (Controlled Inputs)
    const [text, setText] = useState('');
    const [amount, setAmount] = useState('');
    const [dateTime, setDateTime] = useState(getLocalISOString());
    const [isExpense, setIsExpense] = useState(true); // Default to Expense (most common)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Stop the page reload!

        // Basic Validation
        if (!text.trim() || !amount) return;

        // 3. Logic: Convert string to number and apply the sign based on the toggle
        const val = parseFloat(amount);
        const finalAmount = isExpense ? -Math.abs(val) : Math.abs(val);

        // 4. Pass data to parent
        onAdd({
            id: Date.now(), // Simple ID for now
            text,
            amount: finalAmount,
            dateTime: dateTime
        });

        // 5. Reset Form
        setText('');
        setAmount('');
    };

    return (
        <div className="bg-gray-700 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-bold mb-4 text-gray-200">Add New Transaction</h3>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Type Toggle */}
                <div className="grid grid-cols-2 gap-4 p-1 bg-gray-900 rounded-lg">
                    <label className={`flex justify-center items-center cursor-pointer p-2 rounded-md transition-all ${isExpense
                        ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                        : 'text-gray-400 hover:bg-gray-800 border border-transparent' // Added border-transparent
                        }`}>
                        <input
                            type="radio"
                            name="type"
                            checked={isExpense}
                            onChange={() => setIsExpense(true)}
                            className="hidden"
                        />
                        <span className="font-semibold text-sm">Expense</span>
                    </label>

                    <label className={`flex justify-center items-center cursor-pointer p-2 rounded-md transition-all ${!isExpense
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                        : 'text-gray-400 hover:bg-gray-800 border border-transparent' // Added border-transparent
                        }`}>
                        <input
                            type="radio"
                            name="type"
                            checked={!isExpense}
                            onChange={() => setIsExpense(false)}
                            className="hidden"
                        />
                        <span className="font-semibold text-sm">Income</span>
                    </label>
                </div>

                {/* Text Input */}
                <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">Description</label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="e.g. Lunch with Sarah"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-200 p-2 border"
                    />
                </div>

                {/* Amount Input */}
                <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">Amount ($)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.01" // Allow cents
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-200 p-2 border"
                    />
                </div>

                {/* Date & Time Input */}
                <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">Date & Time</label>
                    <input
                        type="datetime-local"
                        value={dateTime.slice(0, 16)}
                        onChange={(e) => setDateTime(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-200 p-2 border"
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full text-white font-bold py-2 px-4 rounded transition-colors ${isExpense
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-green-500 hover:bg-green-600'
                        }`}
                >
                    Add {isExpense ? 'Expense' : 'Income'}
                </button>
            </form>
        </div>
    );
};