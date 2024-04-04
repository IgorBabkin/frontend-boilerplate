import { sleep } from '../../../lib/utils.ts';
import { hideFromChildren, onMount, Scope } from '../../../lib/scope/container.ts';
import { by, inject, provider } from 'ts-ioc-container';
import { ConfigStore } from '../../domain/ConfigStore.ts';
import { ICommand } from '../../../lib/mediator/ICommand.ts';

@onMount
@provider(Scope.application, hideFromChildren)
export class LoadConfig implements ICommand {
  constructor(@inject(by.key('IConfigStore')) private configStore: ConfigStore) {}

  async execute(): Promise<void> {
    await sleep(1000);
    this.configStore.setConfig({ theme: 'dark' });
  }
}
