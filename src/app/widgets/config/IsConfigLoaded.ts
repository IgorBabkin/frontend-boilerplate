import { map, Observable } from 'rxjs';
import { ConfigStore, IConfigStoreKey } from '../../domain/ConfigStore.ts';
import { by, inject, provider, visible } from 'ts-ioc-container';
import { IObservableQuery } from '../../../lib/mediator/ICommand.ts';
import { loaderPredicate, parentOnly, perScope } from '../../../lib/scope/container.ts';

@loaderPredicate
@provider(perScope.page, visible(parentOnly))
export class IsConfigLoaded implements IObservableQuery<void, boolean> {
  constructor(@inject(by.key(IConfigStoreKey)) private configStore: ConfigStore) {}

  create(): Observable<boolean> {
    return this.configStore.getConfig$().pipe(map((config) => config !== undefined));
  }
}
