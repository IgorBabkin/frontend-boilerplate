import { Observable } from 'rxjs';
import { by, inject } from 'ts-ioc-container';
import { IObservableQuery } from '../../../lib/mediator/ICommand.ts';
import { type IErrorBus, IErrorBusKey } from '../../domain/errors/ErrorBus.ts';

export class GetErrors implements IObservableQuery<void, Error> {
  constructor(@inject(by.key(IErrorBusKey)) private errorBus: IErrorBus) {}

  create(): Observable<Error> {
    return this.errorBus.asObservable();
  }
}
