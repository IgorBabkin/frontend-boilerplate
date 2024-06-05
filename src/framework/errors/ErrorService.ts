import { provider, register, scope, singleton } from 'ts-ioc-container';
import { Observable, Subject } from 'rxjs';
import { Scope } from '@framework/scope.ts';
import { service } from '@framework/service/ServiceProvider.ts';
import { IErrorService, IErrorServiceKey } from './IErrorService.public.ts';
import { DomainError } from '@context/errors/DomainError.ts';

@register(IErrorServiceKey.register, scope(Scope.application))
@provider(service, singleton())
export class ErrorService implements IErrorService {
  private errorBus = new Subject<DomainError>();

  getError$(): Observable<DomainError> {
    return this.errorBus.asObservable();
  }

  throwError(error: DomainError): void {
    this.errorBus.next(error);
  }
}
