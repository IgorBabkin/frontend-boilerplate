import { by, inject } from 'ts-ioc-container';
import { byAliases } from './container.ts';
import { IAsyncCommand, ICommand, isAsyncCommand } from '../mediator/ICommand.ts';
import { type IMediator } from '../mediator/IMediator.ts';

export class ScopeMediator {
  constructor(
    @inject(byAliases.some('onMount')) private startCommands: (ICommand | IAsyncCommand)[],
    @inject(by.key('ICommandMediator')) private mediator: IMediator,
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
