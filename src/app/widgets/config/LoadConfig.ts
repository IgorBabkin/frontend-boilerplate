import { sleep } from '../../../lib/utils.ts';
import { onMount, parentOnly, perScope } from '../../../lib/scope/container.ts';
import { by, inject, provider, visible } from 'ts-ioc-container';
import { ConfigStore, IConfigStoreKey } from '../../domain/config/ConfigStore.ts';
import { ICommand } from '../../../lib/mediator/ICommand.ts';

@onMount
@provider(perScope.application, visible(parentOnly))
export class LoadConfig implements ICommand {
  constructor(@inject(by.key(IConfigStoreKey)) private configStore: ConfigStore) {}

  async execute(): Promise<void> {
    await sleep(1000);
    this.configStore.setConfig({ theme: 'dark' });
  }
}
