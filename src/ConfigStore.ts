import { ObservableStore } from './observable/ObservableStore.ts';
import { IConfig } from './IConfig.ts';
import { perApplication } from './scope/container.ts';
import { key, register } from 'ts-ioc-container';

@perApplication
@register(key('IConfigStore'))
export class ConfigStore {
  private config = new ObservableStore<IConfig | undefined>(undefined);

  getConfig$() {
    return this.config.asObservable();
  }

  setConfig(value: IConfig): void {
    this.config.map(() => value);
  }
}
