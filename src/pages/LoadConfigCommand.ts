import { IAsyncCommand } from '../IAsyncCommand.ts';
import { alias, setVisibility, provider, register, scope } from 'ts-ioc-container';
import { sleep } from '../utils.ts';
import { hasTags } from '../scope/container.ts';

@register(alias('onMount'))
@provider(scope(hasTags.every('application')), setVisibility((parent, child) => parent === child))
export class LoadConfigCommand implements IAsyncCommand {
  async execute(...args: unknown[]): Promise<void> {
    await sleep(2000);
    console.log('LoadConfigCommand -> done', ...args);
  }
}
