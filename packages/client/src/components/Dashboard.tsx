import { useState } from "react";
import { useTransactions } from "../context/TransactionContext";
import { useDashboardStats } from "../hooks/useDashboardStats"; // <--- Import Hook
import { MonthPicker } from "./MonthPicker";

export const Dashboard = () => {
    const { transactions } = useTransactions();
    const [view, setView] = useState<'expenses' | 'balance'>('expenses');

    // Default to current month
    const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7));

    // --- USE THE HOOK ---
    const { allTimeStats, monthlyStats } = useDashboardStats(transactions, selectedMonth);

    // Determine which data to display
    const isBalanceView = view === 'balance';

    const displayMainValue = isBalanceView ? allTimeStats.balance : monthlyStats.expenseTotal;
    const displayIncome = isBalanceView ? allTimeStats.income : monthlyStats.income;
    const displayExpense = isBalanceView ? allTimeStats.expense : monthlyStats.expense;

    return (
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl mb-8 text-center border border-gray-700 relative overflow-visible">

            {/* Gradient Top Border */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r transition-all duration-500 rounded-t-2xl ${isBalanceView
                    ? 'from-indigo-500 via-purple-500 to-pink-500'
                    : 'from-orange-500 via-red-500 to-pink-500'
                }`}></div>

            {/* Controls Container */}
            <div className="flex flex-col items-center gap-6 mb-6">
                <div className="bg-gray-900 p-1 rounded-lg inline-flex shadow-inner">
                    <button
                        onClick={() => setView('expenses')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 ${!isBalanceView ? 'bg-gray-700 text-white shadow-lg transform scale-105' : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        Expenses
                    </button>
                    <button
                        onClick={() => setView('balance')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 ${isBalanceView ? 'bg-gray-700 text-white shadow-lg transform scale-105' : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        Balance
                    </button>
                </div>

                {/* Month Picker (Conditional) */}
                {!isBalanceView && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300 z-20">
                        <MonthPicker
                            value={selectedMonth}
                            onChange={setSelectedMonth}
                        />
                    </div>
                )}
            </div>

            {/* Main Stats Display */}
            <h4 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-2 transition-opacity">
                {isBalanceView ? 'Current Balance' : 'Monthly Expenses'}
            </h4>

            <h1 className={`text-5xl font-bold mb-6 tracking-tight transition-colors duration-300 ${isBalanceView ? 'text-white' : 'text-red-400'
                }`}>
                ${displayMainValue}
            </h1>

            {/* Bottom Stats Grid */}
            <div className="flex justify-center gap-8 border-t border-gray-700 pt-6">
                <div className="text-center w-1/2">
                    <h4 className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">
                        {isBalanceView ? 'Total Income' : 'Month Income'}
                    </h4>
                    <p className="text-green-400 font-bold text-xl">+${displayIncome}</p>
                </div>
                <div className="w-px bg-gray-700"></div>
                <div className="text-center w-1/2">
                    <h4 className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">
                        {isBalanceView ? 'Total Expense' : 'Month Expense'}
                    </h4>
                    <p className="text-red-400 font-bold text-xl">-${displayExpense}</p>
                </div>
            </div>
        </div>
    );
};