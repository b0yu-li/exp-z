import { useMemo } from 'react';
import type { Transaction } from '../models/Transaction';

export const useDashboardStats = (transactions: Transaction[], selectedMonth: string) => {

    // 1. Calculate All-Time Stats
    const allTimeStats = useMemo(() => {
        const amounts = transactions.map(t => t.amount);

        const income = amounts
            .filter(a => a > 0)
            .reduce((acc, curr) => acc + curr, 0);

        const expense = amounts
            .filter(a => a < 0)
            .reduce((acc, curr) => acc + curr, 0) * -1;

        const balance = amounts.reduce((acc, curr) => acc + curr, 0);

        return {
            balance: balance.toFixed(2),
            income: income.toFixed(2),
            expense: expense.toFixed(2)
        };
    }, [transactions]);

    // 2. Calculate Monthly Stats
    const monthlyStats = useMemo(() => {
        const monthlyTransactions = transactions.filter(t => t.dateTime.startsWith(selectedMonth));
        const amounts = monthlyTransactions.map(t => t.amount);

        const income = amounts
            .filter(a => a > 0)
            .reduce((acc, curr) => acc + curr, 0);

        const expense = amounts
            .filter(a => a < 0)
            .reduce((acc, curr) => acc + curr, 0) * -1;

        // Note: For "Expenses View", the main number is usually just the expense total
        return {
            expenseTotal: expense.toFixed(2),
            income: income.toFixed(2),
            expense: expense.toFixed(2)
        };
    }, [transactions, selectedMonth]);

    return { allTimeStats, monthlyStats };
};