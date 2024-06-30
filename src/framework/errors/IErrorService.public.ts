import { Observable } from 'rxjs';
import { accessor } from '@lib/di/utils.ts';
import { DomainError } from '@context/errors/DomainError.ts';

export interface IErrorService {
  getError$(): Observable<DomainError>;
  throwError(e: DomainError): void;
}

export const IErrorServiceKey = accessor<IErrorService>('IErrorService');
