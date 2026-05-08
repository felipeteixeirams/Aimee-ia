import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});

// Set the global flag for React 18+ testing
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
