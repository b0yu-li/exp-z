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
