import { map, Observable } from 'rxjs';
import { ConfigStore } from '../../domain/ConfigStore.ts';
import { alias, by, inject, provider, register, scope } from 'ts-ioc-container';
import { IObservableQuery } from '../../../lib/mediator/ICommand.ts';
import { hasTags, hideFromChildren } from '../../../lib/scope/container.ts';

@register(alias('loader-predicate'))
@provider(scope(hasTags.every('page')), hideFromChildren)
export class IsConfigLoaded implements IObservableQuery<void, boolean> {
  constructor(@inject(by.key('IConfigStore')) private configStore: ConfigStore) {}

  create(): Observable<boolean> {
    return this.configStore.getConfig$().pipe(map((config) => config !== undefined));
  }
}
