import { IAsyncCommand } from '../IAsyncCommand.ts';
import { alias, provider, register, scope } from 'ts-ioc-container';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@register(alias('start'))
@provider(scope((c) => c.hasTag('page') && c.hasTag('home')))
export class LoadConfigCommand implements IAsyncCommand {
  async execute(): Promise<void> {
    await sleep(2000);
    console.log('LoadConfigCommand -> done');
  }
}
