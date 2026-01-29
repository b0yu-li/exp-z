import { useState } from "react";

interface DashboardProps {
    total: string;
    income: string;
    expense: string;
}

export const Dashboard = ({ total, income, expense }: DashboardProps) => {
    const [view, setView] = useState<'expenses' | 'balance'>('expenses');

    return (
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl mb-8 text-center border border-gray-700 relative overflow-hidden">
            {/* Gradient Top Border - Changes color based on view */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r transition-all duration-500 ${view === 'balance'
                ? 'from-indigo-500 via-purple-500 to-pink-500'
                : 'from-orange-500 via-red-500 to-pink-500'
                }`}></div>

            {/* Toggle Tabs */}
            <div className="flex justify-center mb-6">
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
            </div>

            <h4 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-2 transition-opacity">
                {view === 'balance' ? 'Current Balance' : 'Total Expenses'}
            </h4>

            {/* Main Number Display */}
            <h1 className={`text-5xl font-bold mb-6 tracking-tight transition-colors duration-300 ${view === 'balance' ? 'text-white' : 'text-red-400'
                }`}>
                ${view === 'balance' ? total : expense}
            </h1>

            <div className="flex justify-center gap-8 border-t border-gray-700 pt-6">
                <div className="text-center w-1/2">
                    <h4 className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Income</h4>
                    <p className="text-green-400 font-bold text-xl">+${income}</p>
                </div>
                <div className="w-px bg-gray-700"></div>
                <div className="text-center w-1/2">
                    <h4 className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Expense</h4>
                    <p className="text-red-400 font-bold text-xl">-${expense}</p>
                </div>
            </div>
        </div>
    );
};