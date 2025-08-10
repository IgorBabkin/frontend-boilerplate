import { Subject } from 'rxjs';
import { DomainError } from '@context/errors/DomainError.ts';
import { depKey, singleton } from 'ts-ioc-container';

export interface IErrorService {
  handleError(e: unknown): Promise<void>;
}

export const IErrorServiceKey = depKey<IErrorService>('IErrorService').pipe(singleton());

export const ErrorService = IErrorServiceKey.register((s) => {
  const error$ = new Subject<DomainError>();

  return {
    error$,
  };
});
