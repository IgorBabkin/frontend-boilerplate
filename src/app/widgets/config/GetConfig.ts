import { IConfig } from '../../domain/IConfig.ts';
import { Observable } from 'rxjs';
import { ConfigStore } from '../../domain/ConfigStore.ts';
import { by, inject } from 'ts-ioc-container';
import { IObservableQuery } from '../../../lib/mediator/ICommand.ts';

export class GetConfig implements IObservableQuery<void, IConfig | undefined> {
  constructor(@inject(by.key('IConfigStore')) private configStore: ConfigStore) {}

  create(): Observable<IConfig | undefined> {
    return this.configStore.getConfig$();
  }
}
