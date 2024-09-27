import { Observable, Subject } from 'rxjs';
import { DomainError } from '@context/errors/DomainError.ts';
import { depKey } from 'ts-ioc-container';

export interface IErrorService {
  error$: Observable<DomainError>;
  filter$<E>(predicate: (e: unknown) => e is E): Observable<E>;
  throwError(e: DomainError): void;
  wrapByErrorHandling<A>(handler: (a: A) => void): (e: A) => void;
}

export const IErrorServiceKey = depKey<IErrorService>('IErrorService');

export const ErrorService = IErrorServiceKey.register((s) => {
  const error$ = new Subject<DomainError>();

  return {
    error$,
  };
});
