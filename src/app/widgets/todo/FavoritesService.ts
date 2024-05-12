import { ObservableStore } from '@lib/observable/ObservableStore.ts';
import { action, query } from '@lib/components/operations.ts';
import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { service } from '@lib/components/ServiceProvider.ts';
import { Scope } from '@lib/scope/container.ts';
import { onDispose } from '@lib/initialize/OnInit.ts';
import { Observable } from 'rxjs';
import { fromLocalStorage, saveToLocalStorage } from '@lib/LocalStorage.ts';
import { accessor } from '@lib/container/utils.ts';
import { toggleElement } from '@lib/utils.ts';

export interface IFavoritesService {
  toggleFavorite(id: string): void;

  getFavorites$(): Observable<string[]>;
}

export const IFavoritesServiceKey = accessor<IFavoritesService>(Symbol('IFavoritesService'));

@register(IFavoritesServiceKey.register, scope(Scope.page))
@provider(service, singleton())
export class FavoritesService implements IFavoritesService {
  @onDispose(saveToLocalStorage('favorites'))
  private favorites: ObservableStore<string[]>;

  constructor(@inject(fromLocalStorage('favorites', [])) favorites: ObservableStore<string[]>) {
    this.favorites = favorites;
  }

  @action toggleFavorite(id: string): void {
    this.favorites.map((list) => toggleElement(list, id));
  }

  @query getFavorites$(): Observable<string[]> {
    return this.favorites.asObservable();
  }
}
