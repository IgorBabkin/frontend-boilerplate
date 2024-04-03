import { sleep } from '../../../lib/utils.ts';
import { onMount, perScope } from '../../../lib/scope/container.ts';
import { by, inject } from 'ts-ioc-container';
import { ConfigStore } from '../../domain/ConfigStore.ts';
import { ICommand } from '../../../lib/mediator/ICommand.ts';

@onMount
@perScope('application')
export class LoadConfig implements ICommand {
  constructor(@inject(by.key('IConfigStore')) private configStore: ConfigStore) {}

  async execute(): Promise<void> {
    await sleep(1000);
    this.configStore.setConfig({ theme: 'dark' });
  }
}
