import { by, inject } from 'ts-ioc-container';
import { type IErrorBus, IErrorBusKey } from '../../domain/errors/ErrorBus.ts';
import { Observable } from 'rxjs';
import { query } from '../../../lib/mediator/ICommand.ts';

export class ErrorController {
  constructor(@inject(by.key(IErrorBusKey)) private errorBus: IErrorBus) {}

  @query
  getError$(): Observable<Error> {
    return this.errorBus.asObservable();
  }
}
