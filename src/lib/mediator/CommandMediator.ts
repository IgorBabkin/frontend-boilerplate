import { Observable, Subject } from 'rxjs';
import { IMediator } from './IMediator.ts';
import { ICommand, IObservableQuery, matchPayload } from './ICommand.ts';
import { by, type IContainer, inject, key, provider, register, singleton } from 'ts-ioc-container';

import { SimpleMediator } from './SimpleMediator.ts';
import { byCommandAliases } from '../scope/container.ts';

export const ICommandMediatorKey = Symbol('ICommandMediator');

@register(key(ICommandMediatorKey))
@provider(singleton())
export class CommandMediator implements IMediator {
  private mediator: SimpleMediator;

  constructor(
    @inject(by.scope.current) scope: IContainer,
    @inject(byCommandAliases.onConstruct) private initCommands: ICommand[],
    @inject(byCommandAliases.onBeforeExecution) private beforeCommands: ICommand[],
  ) {
    this.mediator = new SimpleMediator(scope);
  }

  async initialize<TPayload>(command: ICommand<TPayload>): Promise<void> {
    await this.runBeforeCommands(command, this.initCommands);
    await this.mediator.initialize(command);
  }

  send$<TPayload, TResponse>(query: IObservableQuery<TPayload, TResponse>, payload: TPayload): Observable<TResponse> {
    const result$ = new Subject<TResponse>();
    this.runBeforeCommands(query, this.beforeCommands)
      .then(() => {
        this.mediator.send$(query, payload).subscribe(result$);
      })
      .catch((e: unknown) => {
        result$.error(e);
      });
    return result$.asObservable();
  }

  async send<TPayload = never>(command: ICommand<TPayload>, payload: TPayload): Promise<void> {
    await this.runBeforeCommands(command, this.beforeCommands);
    await this.mediator.send(command, payload);
  }

  private async runBeforeCommands(target: IObservableQuery | ICommand, beforeCommands: ICommand[]) {
    const commands = beforeCommands.filter((c) => matchPayload(c, target));
    for (const c of commands) {
      await this.mediator.send(c, target);
    }
  }
}
