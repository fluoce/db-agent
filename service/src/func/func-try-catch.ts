import { Logger } from '@nestjs/common';
import { funcBestError } from './func-best-error';

export async function funcTryCatch<T, T2>({
  func,
  logger,
  action,
  fallbackName = 'unknown',
  fallback,
}: {
  func: () => Promise<T>;
  logger: Logger;
  action: string;
  fallbackName?: string;
  fallback?: () => Promise<T2>;
}): Promise<T | T2 | null> {
  try {
    return await func();
  } catch (error) {
    logger.error(action, funcBestError(error));
    if (!fallback) {
      return null;
    }
    logger.warn(`${action}_running fallback function_${fallbackName}`);
    try {
      return await fallback();
    } catch (fallbackError) {
      logger.error(
        `${action}_fallback function failed_${fallbackName}`,
        funcBestError(fallbackError),
      );
      return null;
    }
  }
}
