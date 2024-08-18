import { provider, register, scope, singleton } from 'ts-ioc-container';
import { filter, Observable, Subject } from 'rxjs';
import { Scope } from '@framework/scope.ts';
import { IErrorService, IErrorServiceKey } from './IErrorService.public.ts';
import { DomainError } from '@context/errors/DomainError.ts';

@register(IErrorServiceKey.register, scope(Scope.application))
@provider(singleton())
export class ErrorService implements IErrorService {
  error$ = new Subject<DomainError>();

  throwError(error: DomainError): void {
    this.error$.next(error);
  }

  filter$<E>(predicate: (e: unknown) => e is E): Observable<E> {
    return this.error$.pipe(filter(predicate));
  }
}
