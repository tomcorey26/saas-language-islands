/**
 * Exponential backoff with jitter
 * Prevents thundering herd problem when multiple requests fail simultaneously
 *
 * @param fn - The async function to retry
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param baseDelay - Base delay in milliseconds (default: 1000ms)
 * @returns The result of the function if successful
 * @throws The last error if all retries fail
 */
export async function exponentialBackoffWithJitter<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // If this was the last attempt, don't wait
      if (attempt === maxRetries - 1) {
        break;
      }

      // Calculate exponential delay: 2^attempt * baseDelay
      const exponentialDelay = Math.pow(2, attempt) * baseDelay;

      // Add jitter: random value between 0 and exponentialDelay
      const jitter = Math.random() * exponentialDelay;
      const totalDelay = exponentialDelay + jitter;

      // Wait before next retry
      await new Promise((resolve) => setTimeout(resolve, totalDelay));
    }
  }

  // All retries failed, throw the last error
  throw lastError!;
}
