import { IContainer, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { type IErrorBus, IErrorBusKey } from './ErrorBus';
import { Observable } from 'rxjs';
import { query } from '@framework/components/operations';
import { Scope } from '@framework/scope/container';
import { accessor } from '@core/container/utils';
import { service } from '@framework/components/ServiceProvider';

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
