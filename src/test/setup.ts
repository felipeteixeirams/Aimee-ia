import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Set environment variable for React testing
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});
