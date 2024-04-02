import { by, constructor, inject } from 'ts-ioc-container';
import { byAliases } from './container.ts';
import { type IErrorBus, IErrorBusKey } from '../../app/domain/ErrorBus.ts';
import { IQueryHandler } from '../mediator/IQueryHandler.ts';
import { type IMediator } from '../mediator/IMediator.ts';

export class ScopeMediator {
  constructor(
    @inject(byAliases.some('onMount')) private startCommands: constructor<IQueryHandler>[],
    @inject(by.key(IErrorBusKey)) private errorBus: IErrorBus,
    @inject(by.key('ICommandMediator')) private mediator: IMediator,
  ) {}

  start(): void {
    for (const command of this.startCommands) {
      void this.executeCommand(command);
    }
  }

  private async executeCommand(command: constructor<IQueryHandler>): Promise<void> {
    try {
      await this.mediator.send(command, undefined);
    } catch (e) {
      this.errorBus.next(e as Error);
    }
  }
}
