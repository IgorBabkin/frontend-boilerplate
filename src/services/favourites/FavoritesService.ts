import { ObservableStore } from '@lib/observable/ObservableStore.ts';
import { injectProp, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { onDispose, onViewInit } from '@framework/hooks/OnViewInit.ts';
import { Observable } from 'rxjs';
import { fromLocalStorage, saveToLocalStorage } from '@lib/LocalStorage.ts';
import { toggleElement } from '@lib/utils.ts';
import { IFavoritesStore, IFavoritesStoreKey } from './IFavoritesService.public.ts';
import { Store } from '@framework/service/Store.ts';

@register(IFavoritesStoreKey, scope(Scope.page), singleton())
export class FavoritesService extends Store implements IFavoritesStore {
  @onViewInit(injectProp(fromLocalStorage('favorites', [])))
  @onDispose(saveToLocalStorage('favorites'))
  private favorites!: ObservableStore<string[]>;

  toggleFavorite(id: string): void {
    this.favorites.map((list) => toggleElement(list, id));
  }

  getFavorites$(): Observable<string[]> {
    return this.favorites.asObservable();
  }
}
