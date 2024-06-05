import { ObservableStore } from '../../lib/observable/ObservableStore';
import { injectProp, provider, register, scope, singleton } from 'ts-ioc-container';
import { service } from '@framework/service/ServiceProvider.ts';
import { Scope } from '@framework/scope.ts';
import { onDispose, onStart } from '@framework/hooks/OnInit';
import { Observable } from 'rxjs';
import { fromLocalStorage, saveToLocalStorage } from '../../lib/LocalStorage';
import { toggleElement } from '../../lib/utils';
import { IFavoritesService, IFavoritesServiceKey } from './IFavoritesService.public';
import { action, query } from '@framework/service/metadata.ts';

@register(IFavoritesServiceKey.register, scope(Scope.page))
@provider(service, singleton())
export class FavoritesService implements IFavoritesService {
  @onStart(injectProp(fromLocalStorage('favorites', [])))
  @onDispose(saveToLocalStorage('favorites'))
  private favorites!: ObservableStore<string[]>;

  @action toggleFavorite(id: string): void {
    this.favorites.map((list) => toggleElement(list, id));
  }

  @query getFavorites$(): Observable<string[]> {
    return this.favorites.asObservable();
  }
}
