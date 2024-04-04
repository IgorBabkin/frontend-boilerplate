import { ObservableStore } from '../../../lib/observable/ObservableStore.ts';
import { IConfig } from './IConfig.ts';
import { perApplication } from '../../../lib/scope/container.ts';
import { key, register } from 'ts-ioc-container';

export const IConfigStoreKey = Symbol('IConfigStore');

@perApplication
@register(key(IConfigStoreKey))
export class ConfigStore {
  private config = new ObservableStore<IConfig | undefined>(undefined);

  getConfig$() {
    return this.config.asObservable();
  }

  setConfig(value: IConfig): void {
    this.config.map(() => value);
  }
}
