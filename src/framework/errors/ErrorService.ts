import { provider, register, scope, singleton } from 'ts-ioc-container';
import { filter, Observable, Subject } from 'rxjs';
import { Scope } from '@framework/scope.ts';
import { IErrorService, IErrorServiceKey } from './IErrorService.public.ts';
import { DomainError } from '@context/errors/DomainError.ts';
import { Service } from '@framework/service/Service.ts';

@register(IErrorServiceKey.register, scope(Scope.application))
@provider(singleton())
export class ErrorService extends Service implements IErrorService {
  error$ = new Subject<DomainError>();

  throwError(error: DomainError): void {
    this.error$.next(error);
  }

  filter$<E>(predicate: (e: unknown) => e is E): Observable<E> {
    return this.error$.pipe(filter(predicate));
  }

  wrapByErrorHandling<A>(handler: (a: A) => void): (e: A) => void {
    return (e: A) => {
      try {
        handler(e);
      } catch (e) {
        this.error$.next(e as DomainError);
      }
    };
  }
}
