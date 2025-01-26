export async function withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000,
    onError?: (error: Error) => boolean
): Promise<T> {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            if (onError && !onError(error)) break;
            await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, i)));
        }
    }
    throw lastError;
}