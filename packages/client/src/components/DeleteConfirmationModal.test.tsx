import { render, screen, fireEvent } from '@testing-library/react';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('DeleteConfirmationModal', () => {
    // specific mocks for our handler functions
    const mockOnClose = vi.fn();
    const mockOnConfirm = vi.fn();

    // Reset mocks before each test to ensure a clean slate
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should not render anything when isOpen is false', () => {
        render(
            <DeleteConfirmationModal
                isOpen={false}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
            />
        );

        // We use queryByText because getByText throws an error if not found
        const title = screen.queryByText(/Delete Transaction\?/i);
        expect(title).not.toBeInTheDocument();
    });

    it('should render the modal content when isOpen is true', () => {
        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
            />
        );

        // Check for Title
        expect(screen.getByText('Delete Transaction?')).toBeInTheDocument();

        // Check for Warning Message
        expect(screen.getByText(/Are you sure you want to remove this transaction\?/i)).toBeInTheDocument();

        // Check for Buttons
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
        // We use { name: 'Delete' } to distinguish the button from the Title text
        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('should call onClose when the Cancel button is clicked', () => {
        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
            />
        );

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
        expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('should call onConfirm when the Delete button is clicked', () => {
        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
            />
        );

        // Targeted selection to ensure we don't accidentally click the Title text
        const deleteButton = screen.getByRole('button', { name: 'Delete' });
        fireEvent.click(deleteButton);

        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
        expect(mockOnClose).not.toHaveBeenCalled();
    });
});