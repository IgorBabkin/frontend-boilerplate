import { ObservableStore } from '@lib/observable/ObservableStore.ts';
import { injectProp, provider, register, scope, singleton } from 'ts-ioc-container';
import { service } from '@framework/service/ServiceProvider.ts';
import { Scope } from '@framework/scope.ts';
import { onDispose, onStart } from '@framework/hooks/OnInit.ts';
import { Observable } from 'rxjs';
import { fromLocalStorage, saveToLocalStorage } from '@lib/LocalStorage.ts';
import { toggleElement } from '@lib/utils.ts';
import { IFavoritesService, IFavoritesServiceKey } from './IFavoritesService.public.ts';

@register(IFavoritesServiceKey.register, scope(Scope.page))
@provider(service, singleton())
export class FavoritesService implements IFavoritesService {
  @onStart(injectProp(fromLocalStorage('favorites', [])))
  @onDispose(saveToLocalStorage('favorites'))
  private favorites!: ObservableStore<string[]>;

  toggleFavorite(id: string): void {
    this.favorites.map((list) => toggleElement(list, id));
  }

  getFavorites$(): Observable<string[]> {
    return this.favorites.asObservable();
  }
}
