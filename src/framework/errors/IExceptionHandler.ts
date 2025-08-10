import { Exception } from '@helpers/exception.ts';
import { depKey, register } from 'ts-ioc-container';
import { MissingAuthTokenException } from '@framework/errors/MissingAuthTokenException.ts';

export interface IExceptionHandler {
  handle(exception: Exception): void | Promise<void>;
}

export const IExceptionHandlerKey = depKey<IExceptionHandler>('IExceptionHandler');

@register(IExceptionHandlerKey.asAlias)
export class MissingAuthTokenExceptionHandler implements IExceptionHandler {
  handle(exception: Exception): void | Promise<void> {
    if (exception instanceof MissingAuthTokenException) {
    }
  }
}
