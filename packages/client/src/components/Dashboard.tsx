interface DashboardProps {
    total: string;
    income: string;
    expense: string;
}

export const Dashboard = ({ total, income, expense }: DashboardProps) => {
    return (
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl mb-8 text-center border border-gray-700 relative overflow-hidden">
            {/* Gradient Top Border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            <h4 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-2">Current Balance</h4>
            <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">${total}</h1>

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