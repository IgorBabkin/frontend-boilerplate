import { IQuery } from '../../../lib/scope/IQuery.ts';
import { IConfig } from '../../domain/IConfig.ts';
import { Observable } from 'rxjs';
import { ConfigStore } from '../../domain/ConfigStore.ts';
import { by, inject } from 'ts-ioc-container';

export class GetConfig implements IQuery<IConfig | undefined> {
  constructor(@inject(by.key('IConfigStore')) private configStore: ConfigStore) {}

  execute(): Observable<IConfig | undefined> {
    return this.configStore.getConfig$();
  }
}
