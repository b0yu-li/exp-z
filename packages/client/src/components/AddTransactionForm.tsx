import { useState } from 'react';

// 1. Define the shape of the data we are passing up
// In an interview, defining strict types is a big plus.
interface TransactionData {
    text: string;
    amount: number;
}

interface Props {
    onAdd: (transaction: TransactionData) => void;
}

export const AddTransactionForm = ({ onAdd }: Props) => {
    // 2. Local State (Controlled Inputs)
    const [text, setText] = useState('');
    const [amount, setAmount] = useState('');
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
            text,
            amount: finalAmount,
        });

        // 5. Reset Form
        setText('');
        setAmount('');
    };

    return (
        <div className="bg-gray-700 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-bold mb-4 text-gray-200">Add New Transaction</h3>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Type Toggle (The UX Boost) */}
                <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="type"
                            checked={isExpense}
                            onChange={() => setIsExpense(true)}
                            className="w-4 h-4 text-red-600 focus:ring-red-500"
                        />
                        <span className="ml-2 text-gray-300">Expense</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="type"
                            checked={!isExpense}
                            onChange={() => setIsExpense(false)}
                            className="w-4 h-4 text-green-600 focus:ring-green-500"
                        />
                        <span className="ml-2 text-gray-300">Income</span>
                    </label>
                </div>

                {/* Text Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-200">Description</label>
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
                    <label className="block text-sm font-medium text-gray-200">Amount ($)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.01" // Allow cents
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