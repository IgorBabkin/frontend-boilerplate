import { by, inject } from 'ts-ioc-container';
import { byComponentAliases } from './container.ts';
import { ICommand } from '../mediator/ICommand.ts';
import { type IMediator } from '../mediator/IMediator.ts';
import { ICommandMediatorKey } from '../mediator/CommandMediator.ts';
import { type IErrorBus, IErrorBusKey } from '../../app/domain/errors/ErrorBus.ts';

export class ScopeMediator {
  constructor(
    @inject(byComponentAliases.onMount) private startCommands: ICommand[],
    @inject(by.key(ICommandMediatorKey)) private mediator: IMediator,
    @inject(by.key(IErrorBusKey)) private errorBus: IErrorBus,
  ) {}

  start(): void {
    for (const command of this.startCommands) {
      this.mediator.send(command, undefined).catch((e) => this.errorBus.next(e));
    }
  }
}
