import { useMemo, useState } from "react";
import type { Transaction } from "../models/Transaction";

interface DashboardProps {
    transactions: Transaction[];
}

export const Dashboard = ({ transactions }: DashboardProps) => {
    const [view, setView] = useState<'expenses' | 'balance'>('expenses');

    // Default to current month (YYYY-MM format)
    const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7));

    // --- Calculation Logic ---

    // 1. All-Time Stats (For Balance View)
    const allAmounts = transactions.map(t => t.amount);
    const totalBalance = allAmounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const allIncome = allAmounts
        .filter(item => item > 0)
        .reduce((acc, item) => acc + item, 0)
        .toFixed(2);
    const allExpense = (
        allAmounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1
    ).toFixed(2);

    // 2. Monthly Stats (For Expenses View)
    const monthlyTransactions = useMemo(() => {
        return transactions.filter(t => t.dateTime.startsWith(selectedMonth));
    }, [transactions, selectedMonth]);

    const monthlyAmounts = monthlyTransactions.map(t => t.amount);

    // Calculate Monthly Expense
    const monthlyExpenseTotal = (
        monthlyAmounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1
    ).toFixed(2);

    // Calculate Monthly Income (Optional: makes the bottom stats consistent with the view)
    const monthlyIncomeTotal = monthlyAmounts
        .filter(item => item > 0)
        .reduce((acc, item) => acc + item, 0)
        .toFixed(2);

    // --- Display Variables ---
    // Switch between All-Time and Monthly based on the current view
    const displayMainValue = view === 'balance' ? totalBalance : monthlyExpenseTotal;
    const displayIncome = view === 'balance' ? allIncome : monthlyIncomeTotal;
    const displayExpense = view === 'balance' ? allExpense : monthlyExpenseTotal;

    return (
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl mb-8 text-center border border-gray-700 relative overflow-hidden">
            {/* Gradient Top Border */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r transition-all duration-500 ${view === 'balance'
                ? 'from-indigo-500 via-purple-500 to-pink-500'
                : 'from-orange-500 via-red-500 to-pink-500'
                }`}></div>

            {/* Toggle Tabs */}
            <div className="flex flex-col items-center gap-4 mb-6">
                <div className="bg-gray-900 p-1 rounded-lg inline-flex shadow-inner">
                    <button
                        onClick={() => setView('expenses')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 ${view === 'expenses' ? 'bg-gray-700 text-white shadow-lg transform scale-105' : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        Expenses
                    </button>
                    <button
                        onClick={() => setView('balance')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 ${view === 'balance' ? 'bg-gray-700 text-white shadow-lg transform scale-105' : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        Balance
                    </button>
                </div>

                {/* Month Picker (Only visible in Expenses view) */}
                {view === 'expenses' && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="bg-gray-700/50 text-white text-sm border border-gray-600 rounded-lg px-3 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer hover:bg-gray-700"
                        />
                    </div>
                )}
            </div>

            <h4 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-2 transition-opacity">
                {view === 'balance' ? 'Current Balance' : 'Monthly Expenses'}
            </h4>

            {/* Main Number Display */}
            <h1 className={`text-5xl font-bold mb-6 tracking-tight transition-colors duration-300 ${view === 'balance' ? 'text-white' : 'text-red-400'
                }`}>
                ${displayMainValue}
            </h1>

            <div className="flex justify-center gap-8 border-t border-gray-700 pt-6">
                <div className="text-center w-1/2">
                    <h4 className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">
                        {view === 'balance' ? 'Total Income' : 'Month Income'}
                    </h4>
                    <p className="text-green-400 font-bold text-xl">+${displayIncome}</p>
                </div>
                <div className="w-px bg-gray-700"></div>
                <div className="text-center w-1/2">
                    <h4 className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">
                        {view === 'balance' ? 'Total Expense' : 'Month Expense'}
                    </h4>
                    <p className="text-red-400 font-bold text-xl">-${displayExpense}</p>
                </div>
            </div>
        </div>
    );
};