import { IContainer, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { type IErrorBus, IErrorBusKey } from '@domain/errors/ErrorBus.ts';
import { Observable } from 'rxjs';
import { query } from '@lib/components/operations.ts';
import { Scope } from '@lib/scope/container.ts';
import { accessor } from '@lib/container/utils.ts';
import { service } from '@lib/components/ServiceProvider.ts';

export const IErrorServiceKey = accessor<IErrorService>(Symbol('IErrorService'));

export interface IErrorService {
  getError$(): Observable<Error>;
}

export const error$ = (c: IContainer) => IErrorServiceKey.resolve(c).getError$();

@register(IErrorServiceKey.register, scope(Scope.application))
@provider(service, singleton())
export class ErrorService implements IErrorService {
  constructor(@inject(IErrorBusKey.resolve) private errorBus: IErrorBus) {}

  @query getError$(): Observable<Error> {
    return this.errorBus.asObservable();
  }
}
