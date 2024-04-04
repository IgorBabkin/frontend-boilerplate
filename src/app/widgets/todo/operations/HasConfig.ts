import { IAsyncCondition } from '../../../../lib/mediator/IAsyncCondition.ts';
import { by, inject } from 'ts-ioc-container';
import { ConfigStore, IConfigStoreKey } from '../../../domain/config/ConfigStore.ts';
import { filter, firstValueFrom, map } from 'rxjs';

export class HasConfig implements IAsyncCondition {
  constructor(@inject(by.key(IConfigStoreKey)) private configStore: ConfigStore) {}

  isTrue(): Promise<boolean> {
    return firstValueFrom(
      this.configStore.getConfig$().pipe(
        filter((c) => c !== undefined),
        map(() => true),
      ),
    );
  }
}
