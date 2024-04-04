import { IConfig } from '../../domain/config/IConfig.ts';
import { Observable } from 'rxjs';
import { ConfigStore, IConfigStoreKey } from '../../domain/config/ConfigStore.ts';
import { by, inject } from 'ts-ioc-container';
import { IObservableQuery } from '../../../lib/mediator/ICommand.ts';

export class GetConfig implements IObservableQuery<void, IConfig | undefined> {
  constructor(@inject(by.key(IConfigStoreKey)) private configStore: ConfigStore) {}

  create(): Observable<IConfig | undefined> {
    return this.configStore.getConfig$();
  }
}
