import { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';

// Utility helper (could be moved to a utils.ts file later)
const getLocalISOString = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60_000;
    return new Date(now.getTime() - offset).toISOString();
};

export const useAddTransactionForm = () => {
    const { addTransaction } = useTransactions();

    // State
    const [text, setText] = useState('');
    const [amount, setAmount] = useState('');
    const [dateTime, setDateTime] = useState(getLocalISOString());
    const [isExpense, setIsExpense] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!text.trim() || !amount) return;

        // Convert logic
        const val = parseFloat(amount);
        const finalAmount = isExpense ? -Math.abs(val) : Math.abs(val);

        // Add Transaction
        addTransaction({
            id: Date.now(),
            text,
            amount: finalAmount,
            dateTime: dateTime
        });

        // Reset Form
        setText('');
        setAmount('');
        // We generally keep the date as 'now' or the last selected date, 
        // but resetting to 'now' is safer for new entries:
        setDateTime(getLocalISOString());
    };

    return {
        // Data
        text,
        amount,
        dateTime,
        isExpense,
        // Setters
        setText,
        setAmount,
        setDateTime,
        setIsExpense,
        // Actions
        handleSubmit
    };
};