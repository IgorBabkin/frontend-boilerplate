import { handleAsyncError } from '@ibabkin/utils';
import { UnknownError } from '../domain/errors/UnknownError.ts';

export const mapNetworkToDomainError = handleAsyncError((error, { target, method }) => {
  throw new UnknownError(`[${target}.${method}] ${error}`);
});

export const mapAuthToDomainError = handleAsyncError((error, { target, method }) => {
  throw new UnknownError(`[${target}.${method}] ${error}`);
});
