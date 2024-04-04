import { Observable } from 'rxjs';
import { IMediator } from './IMediator.ts';
import { IAsyncCommand, ICommand, IObservableQuery } from './ICommand.ts';
import { by, type IContainer, inject, key, provider, register, singleton } from 'ts-ioc-container';
import { type IErrorBus, IErrorBusKey } from '../../app/domain/errors/ErrorBus.ts';

import { getCondition } from './IAsyncCondition.ts';

export const ICommandMediatorKey = Symbol('ICommandMediator');

@register(key(ICommandMediatorKey))
@provider(singleton())
export class CommandMediator implements IMediator {
  constructor(
    @inject(by.key(IErrorBusKey)) private errorBus: IErrorBus,
    @inject(by.scope.current) private scope: IContainer,
  ) {}

  sendAsync<TPayload>(command: IAsyncCommand<TPayload>, payload: TPayload): void {
    const Condition = getCondition(command);
    if (Condition === undefined) {
      return this.asyncExecute(() => command.executeAsync(payload));
    }

    return this.asyncExecute(async () => {
      const condition = this.scope.resolve(Condition);
      if (await condition.isTrue()) {
        return command.executeAsync(payload);
      }
    });
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

  private asyncExecute(fn: () => Promise<unknown>): void {
    fn().catch((e) => this.errorBus.next(e as Error));
  }
}
