import { IAsyncCommand } from '../IAsyncCommand.ts';
import { provider, scope } from 'ts-ioc-container';
import { sleep } from '../utils.ts';
import { hasTags, hideFromChildren, onMount } from '../scope/container.ts';

@onMount
@provider(scope(hasTags.every('application')), hideFromChildren)
export class LoadConfigCommand implements IAsyncCommand {
  async execute(...args: unknown[]): Promise<void> {
    await sleep(2000);
    console.log('LoadConfigCommand -> done', ...args);
  }
}
