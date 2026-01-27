import { useState, useEffect } from 'react';
import { AddTransactionForm } from './components/AddTransactionForm';
import { TransactionList } from './components/TransactionList';
import type { Transaction } from './models/Transaction';

function App() {
  // 1. STATE with Lazy Initialization
  // We pass a function to useState so it only runs ONCE on mount,
  // instead of parsing JSON on every render.
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('exp-z-data');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. PERSISTENCE
  // Whenever 'transactions' changes, save it.
  useEffect(() => {
    localStorage.setItem('exp-z-data', JSON.stringify(transactions));
  }, [transactions]);

  // 3. ACTIONS
  const addTransaction = (transaction: Transaction) => {
    const newTransaction: Transaction = transaction;
    setTransactions([newTransaction, ...transactions]); // Newest first
  };

  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // 4. DERIVED STATE (The "Math" Section)
  // We calculate these on the fly. No extra state variables needed.
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);
  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1
  ).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-900 py-10 px-4">
      <div className="max-w-md mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-green-600 tracking-tighter">Exp-Z</h1>
          <p className="text-gray-100 text-sm mt-1">Ultimate Control. Zero Compromise.</p>
        </header>

        {/* The Dashboard (Summary) */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl mb-8 text-center border border-gray-700 relative overflow-hidden">
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

        {/* The Form */}
        <AddTransactionForm onAdd={addTransaction} />

        {/* The List */}
        <TransactionList transactions={transactions} onDelete={deleteTransaction} />
      </div>
    </div>
  );
}

export default App;