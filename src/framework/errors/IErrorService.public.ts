import { Observable } from 'rxjs';
import { Accessor } from '@lib/di/utils.ts';
import { DomainError } from '@context/errors/DomainError.ts';

export interface IErrorService {
  getError$(): Observable<DomainError>;
  throwError(e: DomainError): void;
}

export const IErrorServiceKey = new Accessor<IErrorService>('IErrorService');
