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

### `AddTransactionForm.test.tsx` Anatomy

Key Techniques Used:

1. **UI Isolation via `vi.mock`**:

    + I mocked the custom hook `useAddTransactionForm`. This isolates the _View_ (the component) from the _Logic_ (the hook).

    + If the hook has a bug, this test won't fail. This test _only_ fails if the component stops displaying data correctly or stops wiring up buttons to the hook's functions.

2. **State Injection (`mockReturnValue`)**:

    + I use `vi.mocked(...).mockReturnValue(...)` as a "control panel" to inject state directly into the component.

    + Instead of clicking a button to change the state to "Income" (integration testing), we simply _tell the component_ "The state is now Income" and verify it renders the green UI. This makes testing visual states incredibly fast and reliable.

3. **Simulating "Change" Events**:

    + **`fireEvent.change`**: I use this to simulate typing. We verify that typing "New Laptop" immediately calls the `setText` setter passed down from the hook.

    + **Ghost State Handling**: Because the hook is **mocked**, the value of `isExpense` **doesn't actually change**. It stays `true` forever in my test world. To test the "Expense" click, I had to explicitly initialize the mock state to "Income" (`isExpense: false`) so the click matched my expectation (`expect(mockSetIsExpense).toHaveBeenCalledWith(true)`).

4. **Accessibility-First Selection**:

    + **`getByLabelText`**: This was critical. It forced me to add `htmlFor` and `id` attributes to our code. Now, the test confirms that a screen reader user can find the "Date & Time" input, not just that an input exists somewhere on the page.

    + **`getByRole('button', { name: ... })`**: I distinguish between the "Add Expense" and "Add Income" buttons by their accessible name, ensuring the text updates dynamically as expected.

### `DeleteConfirmationModal.test.tsx` Anatomy

Key Techniques Used:

+ **`queryByText` vs `getByText`**:

  + **`getByText`** throws an error immediately if the text isn't found, which is perfect for asserting that something _should_ be there (like in the "visible state" test).

  + **`queryByText`** returns `null` instead of throwing, which is essential for asserting that something should _not_ be there (`expect(...).not.toBeInTheDocument()`).

+ **`getByRole` with `{ name: ... }`**:

  + Instead of relying on fragile CSS classes or generic text searches, we select elements by their accessible role (e.g., `'button'`).

  + The `{ name: 'Delete' }` option specifically targets the button with "Delete" text, preventing confusion with the modal title "Delete Transaction?" which also contains the word "Delete". This ensures we are testing exactly what a screen reader or keyboard user would interact with.

+ **Mock Functions (`vi.fn()`)**:

  + We create "spy" functions using `vi.fn()` to pass as props (`onClose`, `onConfirm`).

  + This allows us to track _if_ and _how many times_ (`toHaveBeenCalledTimes(1)`) the component tried to call these functions when the user clicked a button, effectively testing the "wiring" of the component.

+ **`fireEvent.click()`**:

  + This utility simulates a real user click event on the DOM element we selected. It triggers the `onClick` handler defined in the React component, bridging the gap between the static DOM and the interactive logic.

+ **`beforeEach` Cleanup**:

  + `vi.clearAllMocks()` is run before every single test. This ensures that a click in "Test A" doesn't accidentally count towards the call usage in "Test B", keeping every test isolated and reliable.

### `useAddTransactionForm.test.ts` Anatomy

Key Techniques Used:

1. **`vi.mock`**: We completely bypassed the `TransactionContext`. We don't need `TransactionProvider` wrapping our tests; we just tell Vitest: "Whenever this file asks for `useTransactions`, give it this mock object instead."

2. **`renderHook`**: You can't use standard `render(<MyComponent />)` for hooks. `renderHook` creates a headless component specifically for testing hooks.

3. **`act()`**: Any time we change state (like calling `setText`), we must wrap it in `act(...)`. This ensures React processes the update before we check our `expect` assertions.

4. **`expect.any(Number)`**: Since `id` is generated using `Date.now()`, it changes every millisecond. We can't predict the exact number, so we just assert that "It must be a Number".
