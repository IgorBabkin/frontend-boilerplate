import { IAsyncCommand } from './IAsyncCommand.ts';
import { sleep } from './utils.ts';
import { onMount, perWidget } from './scope/container.ts';
import { by, inject } from 'ts-ioc-container';
import { ConfigStore } from './ConfigStore.ts';

@onMount
@perWidget('application')
export class LoadConfig implements IAsyncCommand {
  constructor(@inject(by.key('IConfigStore')) private configStore: ConfigStore) {}

  async execute(): Promise<void> {
    await sleep(1000);
    this.configStore.setConfig({ theme: 'dark' });
  }
}
