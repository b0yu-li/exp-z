import { useTransactions } from "../context/TransactionContext";

export const Header = () => {
    const { exportData } = useTransactions(); // <--- Hook

    return (
        <header className="text-center mb-10">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-800 tracking-tighter mb-2">Exp-Z</h1>
            <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">Ultimate Control. Zero Compromise.</p>

            <button
                onClick={exportData}
                className="text-xs font-bold text-gray-500 hover:text-indigo-400 border border-gray-700 hover:border-indigo-400/50 px-4 py-2 rounded-full transition-all uppercase tracking-wider hover:bg-gray-800"
            >
                ↓ Export JSON
            </button>
        </header>
    )
}