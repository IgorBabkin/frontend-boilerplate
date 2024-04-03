import { Observable } from 'rxjs';
import { IMediator } from './IMediator.ts';
import { IObservableQuery, ICommand, IAsyncCommand } from './ICommand.ts';
import { by, inject, key, provider, register, singleton } from 'ts-ioc-container';
import { type IErrorBus, IErrorBusKey } from '../../app/domain/ErrorBus.ts';

@register(key('ICommandMediator'))
@provider(singleton())
export class CommandMediator implements IMediator {
  constructor(@inject(by.key(IErrorBusKey)) private errorBus: IErrorBus) {}

  sendAsync<TPayload>(command: IAsyncCommand<TPayload>, payload: TPayload): void {
    command.executeAsync(payload).catch((e) => this.errorBus.next(e as Error));
  }

  send$<TPayload, TResponse>(query: IObservableQuery<TPayload, TResponse>, payload: TPayload): Observable<TResponse> {
    return query.create(payload);
  }

  send<TPayload>(command: ICommand<TPayload>, payload: TPayload): void {
    try {
      command.execute(payload);
    } catch (e) {
      this.errorBus.next(e as Error);
    }
  }
}
