import { by, inject, key, provider, register, scope, singleton } from 'ts-ioc-container';
import { type IErrorBus, IErrorBusKey } from '../../domain/errors/ErrorBus.ts';
import { Observable } from 'rxjs';
import { query } from '../../../lib/mediator/ICommand.ts';
import { Scope } from '../../../lib/scope/container.ts';
import { service } from '../../../lib/mediator/ServiceProvider.ts';

export const IErrorServiceKey = Symbol('IErrorService');

@register(key(IErrorServiceKey))
@provider(service, scope(Scope.application), singleton())
export class ErrorService {
  constructor(@inject(by.key(IErrorBusKey)) private errorBus: IErrorBus) {}

  @query
  getError$(): Observable<Error> {
    return this.errorBus.asObservable();
  }
}
