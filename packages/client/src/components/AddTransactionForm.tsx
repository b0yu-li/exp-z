import { useAddTransactionForm } from '../hooks/useAddTransactionForm'; // <--- Import Hook

export const AddTransactionForm = () => {
    // Destructure everything we need from the hook
    const {
        text, setText,
        amount, setAmount,
        dateTime, setDateTime,
        isExpense, setIsExpense,
        handleSubmit
    } = useAddTransactionForm();

    return (
        <div className="bg-gray-700 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-bold mb-4 text-gray-200">Add New Transaction</h3>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Type Toggle */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-gray-900 rounded-lg">
                    <label className={`flex justify-center items-center cursor-pointer p-2 rounded-md transition-all ${isExpense
                        ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                        : 'text-gray-400 hover:bg-gray-800 border border-transparent'
                        }`}>
                        <input
                            type="radio"
                            checked={isExpense}
                            onChange={() => setIsExpense(true)}
                            className="hidden"
                        />
                        <span className="font-semibold text-sm">Expense</span>
                    </label>

                    <label className={`flex justify-center items-center cursor-pointer p-2 rounded-md transition-all ${!isExpense
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                        : 'text-gray-400 hover:bg-gray-800 border border-transparent'
                        }`}>
                        <input
                            type="radio"
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-200 p-2 border bg-gray-600 border-gray-500"
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
                        step="0.01"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-200 p-2 border bg-gray-600 border-gray-500"
                    />
                </div>

                {/* Date & Time Input */}
                <div>
                    <label htmlFor='input-amount' className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">Date & Time</label>
                    <input
                        id='input-amount'
                        type="datetime-local"
                        value={dateTime.slice(0, 16)}
                        onChange={(e) => setDateTime(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-200 p-2 border bg-gray-600 border-gray-500"
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full text-white font-bold py-2 px-4 rounded transition-colors shadow-lg ${isExpense
                        ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
                        : 'bg-green-500 hover:bg-green-600 shadow-green-500/30'
                        }`}
                >
                    Add {isExpense ? 'Expense' : 'Income'}
                </button>
            </form>
        </div>
    );
};