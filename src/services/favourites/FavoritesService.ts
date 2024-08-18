import { ObservableStore } from '@lib/observable/ObservableStore.ts';
import { injectProp, provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { onDispose, onInit } from '@framework/hooks/OnInit.ts';
import { Observable } from 'rxjs';
import { fromLocalStorage, saveToLocalStorage } from '@lib/LocalStorage.ts';
import { toggleElement } from '@lib/utils.ts';
import { IFavoritesService, IFavoritesServiceKey } from './IFavoritesService.public.ts';

@register(IFavoritesServiceKey.register, scope(Scope.page))
@provider(singleton())
export class FavoritesService implements IFavoritesService {
  @onInit(injectProp(fromLocalStorage('favorites', [])))
  @onDispose(saveToLocalStorage('favorites'))
  private favorites!: ObservableStore<string[]>;

  toggleFavorite(id: string): void {
    this.favorites.map((list) => toggleElement(list, id));
  }

  getFavorites$(): Observable<string[]> {
    return this.favorites.asObservable();
  }
}
