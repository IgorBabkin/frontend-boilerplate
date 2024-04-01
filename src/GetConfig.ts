import { IQuery } from './scope/IQuery.ts';
import { IConfig } from './IConfig.ts';
import { Observable } from 'rxjs';
import { ConfigStore } from './ConfigStore.ts';
import { by, inject } from 'ts-ioc-container';

export class GetConfig implements IQuery<IConfig | undefined> {
  constructor(@inject(by.key('IConfigStore')) private configStore: ConfigStore) {}

  execute(): Observable<IConfig | undefined> {
    return this.configStore.getConfig$();
  }
}
