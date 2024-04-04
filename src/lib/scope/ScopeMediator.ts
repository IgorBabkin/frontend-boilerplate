import { by, inject } from 'ts-ioc-container';
import { byAliases } from './container.ts';
import { IAsyncCommand, ICommand, isAsyncCommand } from '../mediator/ICommand.ts';
import { type IMediator } from '../mediator/IMediator.ts';
import { ICommandMediatorKey } from '../mediator/CommandMediator.ts';

export class ScopeMediator {
  constructor(
    @inject(byAliases.onMount) private startCommands: (ICommand | IAsyncCommand)[],
    @inject(by.key(ICommandMediatorKey)) private mediator: IMediator,
  ) {}

  start(): void {
    for (const command of this.startCommands) {
      if (isAsyncCommand(command)) {
        this.mediator.sendAsync(command, undefined);
      } else {
        this.mediator.send(command, undefined);
      }
    }
  }
}
