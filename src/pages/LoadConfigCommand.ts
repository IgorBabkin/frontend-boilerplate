import { IAsyncCommand } from '../IAsyncCommand.ts';
import { alias, provider, register, scope, singleton } from 'ts-ioc-container';
import { sleep } from '../utils.ts';
import { hasTags } from '../scope/container.ts';

@register(alias('onMount'))
@provider(scope(hasTags.every('page', 'home')), singleton())
export class LoadConfigCommand implements IAsyncCommand {
  async execute(): Promise<void> {
    await sleep(2000);
    console.log('LoadConfigCommand -> done');
  }
}
