import { by, inject } from 'ts-ioc-container';
import { IAsyncCommand } from './IAsyncCommand.ts';

export class ScopeMediator {
  constructor(@inject(by.aliases((aliases) => aliases.includes('start'))) private startCommands: IAsyncCommand[]) {}

  async start(): Promise<void> {
    console.log('start');
    for (const command of this.startCommands) {
      await command.execute();
    }
  }
}
