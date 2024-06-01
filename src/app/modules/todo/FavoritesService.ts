import { ObservableStore } from '@core/observable/ObservableStore';
import { action, query } from '@framework/components/operations';
import { injectProp, provider, register, scope, singleton } from 'ts-ioc-container';
import { service } from '@framework/components/ServiceProvider';
import { Scope } from '@framework/scope/container';
import { onDispose, onStart } from '@framework/initialize/OnInit';
import { Observable } from 'rxjs';
import { fromLocalStorage, saveToLocalStorage } from '@core/LocalStorage';
import { accessor } from '@core/container/utils';
import { toggleElement } from '@core/utils';

export interface IFavoritesService {
  toggleFavorite(id: string): void;

  getFavorites$(): Observable<string[]>;
}

export const IFavoritesServiceKey = accessor<IFavoritesService>(Symbol('IFavoritesService'));

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
