import { by, inject, key, provider, register, singleton } from 'ts-ioc-container';
import { perScope } from '../../../lib/scope/container.ts';
import { type IErrorBus, IErrorBusKey } from '../../domain/errors/ErrorBus.ts';

export const IErrorHandlerKey = Symbol('IErrorHandler');

export interface IErrorHandler {
  handle(fn: () => Promise<void>): void;
}

@register(key(IErrorHandlerKey))
@provider(perScope.application, singleton())
export class ErrorHandler implements IErrorHandler {
  constructor(@inject(by.key(IErrorBusKey)) private errorBus$: IErrorBus) {}

  handle(fn: () => Promise<void>): void {
    fn().catch((error) => {
      this.errorBus$.next(error);
    });
  }
}
