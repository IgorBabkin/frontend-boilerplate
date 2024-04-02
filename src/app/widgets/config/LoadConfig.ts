import { sleep } from '../../../lib/utils.ts';
import { onMount, perWidget } from '../../../lib/scope/container.ts';
import { by, inject } from 'ts-ioc-container';
import { ConfigStore } from '../../domain/ConfigStore.ts';
import { IQueryHandler } from '../../../lib/mediator/IQueryHandler.ts';

@onMount
@perWidget('application')
export class LoadConfig implements IQueryHandler {
  constructor(@inject(by.key('IConfigStore')) private configStore: ConfigStore) {}

  async handle(): Promise<void> {
    await sleep(1000);
    this.configStore.setConfig({ theme: 'dark' });
  }
}
