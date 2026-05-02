/**
 * Utility for retrying asynchronous operations with exponential backoff.
 */

export interface RetryOptions {
  maxAttempts: number;
  delayMs: number;
  backoffFactor: number;
  retryableErrorCodes?: string[];
}

const defaultOptions: RetryOptions = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffFactor: 2,
};

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const mergedOptions = { ...defaultOptions, ...options };
  let lastError: any;
  let currentDelay = mergedOptions.delayMs;

  for (let attempt = 1; attempt <= mergedOptions.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // If it's the last attempt, don't wait, just throw
      if (attempt === mergedOptions.maxAttempts) break;

      // Log retry attempt
      console.warn(`[Retry] Tentativa ${attempt} falhou. Retentando em ${currentDelay}ms...`, {
        error: error.message
      });

      await new Promise(resolve => setTimeout(resolve, currentDelay));
      currentDelay *= mergedOptions.backoffFactor;
    }
  }

  throw lastError;
}
