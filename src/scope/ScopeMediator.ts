import { inject } from 'ts-ioc-container';
import { IAsyncCommand } from '../IAsyncCommand.ts';
import { byAliases } from './container.ts';

export class ScopeMediator {
  constructor(
    @inject(byAliases.some('onMount')) private startCommands: IAsyncCommand[],
    private tags: string,
  ) {}

  async start(): Promise<void> {
    for (const command of this.startCommands) {
      await command.execute(this.tags);
    }
  }
}
