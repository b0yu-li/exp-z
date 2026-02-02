import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAddTransactionForm } from './useAddTransactionForm';

// 1. Mock the Context Hook
// We hijack the import so we can spy on 'addTransaction'
const mockAddTransaction = vi.fn();

vi.mock('../context/TransactionContext', () => ({
    useTransactions: () => ({
        addTransaction: mockAddTransaction,
    }),
}));

describe('useAddTransactionForm', () => {

    // Clear mocks before every test to ensure a clean slate
    beforeEach(() => {
        vi.clearAllMocks();
        // Optional: specific date mocking if you need exact string matching
        // vi.useFakeTimers(); 
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useAddTransactionForm());

        expect(result.current.text).toBe('');
        expect(result.current.amount).toBe('');
        expect(result.current.isExpense).toBe(true);
        // Date should be a valid ISO string
        expect(new Date(result.current.dateTime).toString()).not.toBe('Invalid Date');
    });

    it('should update state setters correctly', () => {
        const { result } = renderHook(() => useAddTransactionForm());

        // We wrap state updates in 'act' so React knows it happened
        act(() => {
            result.current.setText('Groceries');
            result.current.setAmount('50');
            result.current.setIsExpense(false);
        });

        expect(result.current.text).toBe('Groceries');
        expect(result.current.amount).toBe('50');
        expect(result.current.isExpense).toBe(false);
    });

    it('should NOT submit if validation fails (empty fields)', () => {
        const { result } = renderHook(() => useAddTransactionForm());
        const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

        // Case 1: Empty everything
        act(() => {
            result.current.handleSubmit(mockEvent);
        });
        expect(mockAddTransaction).not.toHaveBeenCalled();

        // Case 2: Only text provided
        act(() => {
            result.current.setText('Test');
            result.current.handleSubmit(mockEvent);
        });
        expect(mockAddTransaction).not.toHaveBeenCalled();
    });

    it('should submit an EXPENSE correctly (negative amount)', () => {
        const { result } = renderHook(() => useAddTransactionForm());
        const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

        act(() => {
            result.current.setText('Lunch');
            result.current.setAmount('20.50');
            result.current.setIsExpense(true); // Default, but explicit
        });

        act(() => {
            result.current.handleSubmit(mockEvent);
        });

        // Verify the Context function was called with correct data
        expect(mockAddTransaction).toHaveBeenCalledTimes(1);
        expect(mockAddTransaction).toHaveBeenCalledWith({
            id: expect.any(Number), // We don't care about the exact ID timestamp
            text: 'Lunch',
            amount: -20.5, // Check strict equality on the number conversion
            dateTime: expect.any(String)
        });

        // Verify preventDefault was called
        expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should submit an INCOME correctly (positive amount)', () => {
        const { result } = renderHook(() => useAddTransactionForm());
        const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

        act(() => {
            result.current.setText('Salary');
            result.current.setAmount('5000');
            result.current.setIsExpense(false); // Toggle to Income
        });

        act(() => {
            result.current.handleSubmit(mockEvent);
        });

        expect(mockAddTransaction).toHaveBeenCalledWith(expect.objectContaining({
            text: 'Salary',
            amount: 5000 // Positive number
        }));
    });

    it('should reset form after successful submission', () => {
        const { result } = renderHook(() => useAddTransactionForm());
        const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

        // Fill form
        act(() => {
            result.current.setText('Coffee');
            result.current.setAmount('5');
        });

        // Submit
        act(() => {
            result.current.handleSubmit(mockEvent);
        });

        // Check Reset
        expect(result.current.text).toBe('');
        expect(result.current.amount).toBe('');
        // Note: isExpense is not reset in your code, which is good UX (remains as last selection)
        expect(result.current.isExpense).toBe(true);
    });
});