import { by, inject, key, provider, register, scope, singleton } from 'ts-ioc-container';
import { type IErrorBus, IErrorBusKey } from '../../domain/errors/ErrorBus.ts';
import { Observable } from 'rxjs';
import { query, service } from '../../../lib/mediator/ICommand.ts';
import { Scope } from '../../../lib/scope/container.ts';

export const IErrorServiceKey = Symbol('IErrorService');

@service
@register(key(IErrorServiceKey))
@provider(scope(Scope.application), singleton())
export class ErrorService {
  constructor(@inject(by.key(IErrorBusKey)) private errorBus: IErrorBus) {}

  @query
  getError$(): Observable<Error> {
    return this.errorBus.asObservable();
  }
}
