import { IConfig } from '../../domain/IConfig.ts';
import { Observable } from 'rxjs';
import { ConfigStore } from '../../domain/ConfigStore.ts';
import { by, inject } from 'ts-ioc-container';
import { IObservableQueryHandler } from '../../../lib/mediator/IQueryHandler.ts';

export class GetConfig implements IObservableQueryHandler<void, IConfig | undefined> {
  constructor(@inject(by.key('IConfigStore')) private configStore: ConfigStore) {}

  handle(): Observable<IConfig | undefined> {
    return this.configStore.getConfig$();
  }
}
