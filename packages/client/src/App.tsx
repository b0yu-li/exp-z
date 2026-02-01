import { AddTransactionForm } from './components/AddTransactionForm';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { TransactionList } from './components/TransactionList';
import { TransactionProvider } from './context/TransactionContext';

function App() {
  return (
    <TransactionProvider>
      <div className="min-h-screen bg-gray-900 py-10 px-4">
        <div className="max-w-md mx-auto">
          {/* Header handles its own export logic now via context */}
          <Header />

          {/* Dashboard pulls its own data */}
          <Dashboard />

          {/* Form handles its own submission */}
          <AddTransactionForm />

          {/* List handles its own deletion */}
          <TransactionList />
        </div>
      </div>
    </TransactionProvider>
  );
}

export default App;