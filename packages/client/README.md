# README

## Testing

+ Install dependencies: `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`

```shell
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

+ Update `package.json`

```json
"scripts": {
    ...,
    "test": "vitest",
    "test:ui": "vitest --ui",
    "coverage": "vitest run --coverage",
    ...
  },
```

+ Create `src/setupTests.ts`

```typescript
import '@testing-library/jest-dom';
```

+ Update `vite.config.ts`

```typescript
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  test: {
    globals: true,             // Allows using describe/expect without importing
    environment: 'jsdom',      // Simulates a browser
    setupFiles: './src/setupTests.ts', // Runs your setup before tests
    css: true,                 // (Optional) Processes CSS modules
  },
})
```

+ An example test

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('DeleteConfirmationModal', () => {
    const mockOnClose = vi.fn();
    const mockOnConfirm = vi.fn();

    // Reset mocks before each test to ensure a clean slate
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the modal content when isOpen is true', () => {
        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
            />
        );

        expect(screen.getByText('Delete Transaction?')).toBeInTheDocument();

        expect(screen.getByText(/Are you sure you want to remove this transaction\?/i)).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('should call onConfirm when the Delete button is clicked', () => {
        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
            />
        );

        const deleteButton = screen.getByRole('button', { name: 'Delete' });
        fireEvent.click(deleteButton);

        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
        expect(mockOnClose).not.toHaveBeenCalled();
    });
});
```

### `useAddTransactionForm` Anatomy

Key Techniques Used:

1. **`vi.mock`**: We completely bypassed the `TransactionContext`. We don't need `TransactionProvider` wrapping our tests; we just tell Vitest: "Whenever this file asks for `useTransactions`, give it this mock object instead."

2. **`renderHook`**: You can't use standard `render(<MyComponent />)` for hooks. `renderHook` creates a headless component specifically for testing hooks.

3. **`act()`**: Any time we change state (like calling `setText`), we must wrap it in `act(...)`. This ensures React processes the update before we check our `expect` assertions.

4. **`expect.any(Number)`**: Since `id` is generated using `Date.now()`, it changes every millisecond. We can't predict the exact number, so we just assert that "It must be a Number".
