import { useMemo } from "react";
import type { Transaction } from "../models/Transaction";

export const useTransactionHistory = (transactions: Transaction[]) => {

    // Grouping Logic
    const groupedTransactions = useMemo(() => {
        const groups: Record<string, Transaction[]> = {};
        const sorted = [...transactions].sort((a, b) => b.dateTime.localeCompare(a.dateTime));

        sorted.forEach(t => {
            const dateKey = t.dateTime.split('T')[0];
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(t);
        });

        return groups;
    }, [transactions]);

    // Get sorted keys
    const dateKeys = Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a));

    // Helper for the Header (e.g. "Oct 24")
    const formatDateHeader = (isoString: string): string => {
        const date = new Date(isoString);
        const now = new Date();
        const isCurrentYear = date.getFullYear() === now.getFullYear();

        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: isCurrentYear ? undefined : 'numeric'
        }).format(date);
    };

    return { groupedTransactions, dateKeys, formatDateHeader };
};