import { inject, key, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@lib/scope/container.ts';
import { type IErrorBus, IErrorBusKey } from './ErrorBus.ts';

export const IErrorHandlerKey = Symbol('IErrorHandler');

export interface IErrorHandler {
  handle(fn: () => Promise<void>): void;
}

@register(key(IErrorHandlerKey), scope(Scope.application), singleton())
export class ErrorHandler implements IErrorHandler {
  constructor(@inject(IErrorBusKey.resolve) private errorBus$: IErrorBus) {}

  handle(fn: () => Promise<void>): void {
    fn().catch((error) => {
      this.errorBus$.next(error);
    });
  }
}
