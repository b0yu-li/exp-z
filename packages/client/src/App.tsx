import { useState, useEffect } from 'react';
import { AddTransactionForm } from './components/AddTransactionForm';
import { TransactionList, type Transaction } from './components/TransactionList';

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
  const addTransaction = (data: { text: string; amount: number }) => {
    const newTransaction: Transaction = {
      id: Date.now(), // Simple ID for now
      ...data,
    };
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
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg mb-6 text-center">
          <h4 className="text-gray-200 uppercase text-xs font-bold tracking-wider">Balance</h4>
          <h1 className="text-4xl font-bold my-2 text-gray-100">${total}</h1>

          <div className="flex justify-center gap-10 mt-6 border-t border-gray-500 pt-4">
            <div>
              <h4 className="text-gray-300 text-xs uppercase">Income</h4>
              <p className="text-green-500 font-bold text-xl">+${income}</p>
            </div>
            <div className="border-r border-gray-200"></div>
            <div>
              <h4 className="text-gray-300 text-xs uppercase">Expense</h4>
              <p className="text-red-500 font-bold text-xl">-${expense}</p>
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