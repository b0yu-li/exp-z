import { useEffect, useState } from 'react';
import { AddTransactionForm } from './components/AddTransactionForm';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
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

  const exportData = () => {
    const jsonString = JSON.stringify(transactions, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `exp-z-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
};

  return (
    <div className="min-h-screen bg-gray-900 py-10 px-4">
      <div className="max-w-md mx-auto">
        {/* The Exp-Z Header */}
        <Header onExportData={exportData}></Header>

        {/* The Dashboard (Summary) */}
        <Dashboard transactions={transactions} />

        {/* The Form */}
        <AddTransactionForm onAdd={addTransaction} />

        {/* The List */}
        <TransactionList transactions={transactions} onDelete={deleteTransaction} />
      </div>
    </div>
  );
}

export default App;