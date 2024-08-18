import { Observable } from 'rxjs';
import { accessor } from '@lib/di/utils.ts';
import { DomainError } from '@context/errors/DomainError.ts';

export interface IErrorService {
  error$: Observable<DomainError>;
  filter$<E>(predicate: (e: unknown) => e is E): Observable<E>;
  throwError(e: DomainError): void;
}

export const IErrorServiceKey = accessor<IErrorService>('IErrorService');
