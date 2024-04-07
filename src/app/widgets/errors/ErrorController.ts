import { by, inject, key, provider, register, scope, singleton } from 'ts-ioc-container';
import { type IErrorBus, IErrorBusKey } from '../../domain/errors/ErrorBus.ts';
import { Observable } from 'rxjs';
import { query } from '../../../lib/mediator/ICommand.ts';
import { Scope } from '../../../lib/scope/container.ts';

export const IErrorControllerKey = Symbol('IErrorController');

@register(key(IErrorControllerKey))
@provider(scope(Scope.application), singleton())
export class ErrorController {
  constructor(@inject(by.key(IErrorBusKey)) private errorBus: IErrorBus) {}

  @query
  getError$(): Observable<Error> {
    return this.errorBus.asObservable();
  }
}
