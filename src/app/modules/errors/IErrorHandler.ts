import { inject, key, provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope/container';
import { type IErrorBus, IErrorBusKey } from './ErrorBus';

export const IErrorHandlerKey = Symbol('IErrorHandler');

export interface IErrorHandler {
  handle(fn: () => Promise<void>): void;
}

@register(key(IErrorHandlerKey), scope(Scope.application))
@provider(singleton())
export class ErrorHandler implements IErrorHandler {
  constructor(@inject(IErrorBusKey.resolve) private errorBus$: IErrorBus) {}

  handle(fn: () => Promise<void>): void {
    fn().catch((error) => {
      this.errorBus$.next(error);
    });
  }
}
