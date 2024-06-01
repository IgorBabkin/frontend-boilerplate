import { handleAsyncError } from '@ibabkin/utils';
import { UnknownError } from '@modules/errors/UnknownError';

export const mapNetworkError = (error: unknown, { target, method }: { target: string; method: string }) => {
  return new UnknownError(`[${target}.${method}] ${error}`);
};

export const mapAuthError = handleAsyncError((error, { target, method }) => {
  return new UnknownError(`[${target}.${method}] ${error}`);
});
