import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { AddTransactionForm } from './AddTransactionForm';
import * as HookModule from '../hooks/useAddTransactionForm';

// 1. Mock the Hook File
vi.mock('../hooks/useAddTransactionForm');

describe('AddTransactionForm UI', () => {
    // 2. Setup Spies (Mock Functions)
    const mockSetText = vi.fn();
    const mockSetAmount = vi.fn();
    const mockSetDateTime = vi.fn();
    const mockSetIsExpense = vi.fn();
    const mockHandleSubmit = vi.fn((e) => e.preventDefault());

    // 3. Define Default Hook State
    const defaultValues = {
        text: '',
        setText: mockSetText,
        amount: '',
        setAmount: mockSetAmount,
        dateTime: '2026-02-03T12:00', // Hardcoded date for consistency
        setDateTime: mockSetDateTime,
        isExpense: true,
        setIsExpense: mockSetIsExpense,
        handleSubmit: mockHandleSubmit,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset the mock to default before every test
        vi.mocked(HookModule.useAddTransactionForm).mockReturnValue(defaultValues);
    });

    test('renders all form fields correctly', () => {
        render(<AddTransactionForm />);

        expect(screen.getByText('Add New Transaction')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('e.g. Lunch with Sarah')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();

        // Date input renders with the value we mocked
        const dateInput = screen.getByLabelText(/date & time/i) as HTMLInputElement;
        expect(dateInput.value).toBe('2026-02-03T12:00');

        // Check Button Text
        expect(screen.getByRole('button', { name: /add expense/i })).toBeInTheDocument();
    });

    test('calls setText when description is typed', () => {
        render(<AddTransactionForm />);

        const input = screen.getByPlaceholderText('e.g. Lunch with Sarah');
        fireEvent.change(input, { target: { value: 'New Laptop' } });

        expect(mockSetText).toHaveBeenCalledTimes(1);
        expect(mockSetText).toHaveBeenCalledWith('New Laptop');
    });

    test('calls setAmount when amount is typed', () => {
        render(<AddTransactionForm />);

        const input = screen.getByPlaceholderText('0.00');
        fireEvent.change(input, { target: { value: '1500' } });

        expect(mockSetAmount).toHaveBeenCalledTimes(1);
        expect(mockSetAmount).toHaveBeenCalledWith('1500');
    });

    test('toggles to INCOME mode correctly (Green UI)', () => {
        // OVERRIDE: Simulate hook returning isExpense = false
        vi.mocked(HookModule.useAddTransactionForm).mockReturnValue({
            ...defaultValues,
            isExpense: false
        });

        render(<AddTransactionForm />);

        // Button should now say "Add Income" and be green
        const button = screen.getByRole('button', { name: /add income/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('bg-green-500');

        // Expense label should NOT be highlighted (optional check)
        const incomeLabelText = screen.getByText('Income');
        expect(incomeLabelText.parentElement).toHaveClass('bg-green-500/20');
    });

    test('calls setIsExpense when toggle buttons are clicked', () => {
        render(<AddTransactionForm />);

        // Click "Income"
        const incomeLabel = screen.getByText('Income');
        fireEvent.click(incomeLabel);
        // Note: Clicking the label triggers the input change in React
        expect(mockSetIsExpense).toHaveBeenCalledWith(false);

        // Click "Expense"
        const expenseLabel = screen.getByText('Expense');
        fireEvent.click(expenseLabel);
        expect(mockSetIsExpense).toHaveBeenCalledWith(true);
    });

    test('calls handleSubmit when the form button is clicked', () => {
        render(<AddTransactionForm />);

        const submitButton = screen.getByRole('button', { name: /add expense/i });
        fireEvent.click(submitButton);

        expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });
});