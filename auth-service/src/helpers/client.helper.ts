export const retryClientCall = async <T>(
  fn: () => Promise<T>,
  attempts = 3,
  baseDelay = 150
): Promise<T> => {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const jitter = Math.floor(Math.random() * 50);
      const delay = baseDelay * Math.pow(2, i) + jitter;
      await new Promise((apply) => setTimeout(apply, delay));
    }
  }
  throw lastErr;
};
