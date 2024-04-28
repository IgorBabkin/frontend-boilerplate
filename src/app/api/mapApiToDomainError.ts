import { handleAsyncError } from '@ibabkin/utils';
import { UnknownError } from '../domain/errors/UnknownError.ts';

export const mapNetworkError = (error: unknown, { target, method }: { target: string; method: string }) => {
  throw new UnknownError(`[${target}.${method}] ${error}`);
};

export const mapAuthError = handleAsyncError((error, { target, method }) => {
  throw new UnknownError(`[${target}.${method}] ${error}`);
});
