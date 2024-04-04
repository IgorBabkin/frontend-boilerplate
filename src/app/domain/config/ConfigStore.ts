import { ObservableStore } from '../../../lib/observable/ObservableStore.ts';
import { IConfig } from './IConfig.ts';
import { perScope } from '../../../lib/scope/container.ts';
import { key, provider, register, singleton } from 'ts-ioc-container';

export const IConfigStoreKey = Symbol('IConfigStore');

@register(key(IConfigStoreKey))
@provider(perScope.application, singleton())
export class ConfigStore {
  private config = new ObservableStore<IConfig | undefined>(undefined);

  getConfig$() {
    return this.config.asObservable();
  }

  setConfig(value: IConfig): void {
    this.config.map(() => value);
  }
}
