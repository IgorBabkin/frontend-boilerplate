import { Observable } from 'rxjs';
import { depKey } from 'ts-ioc-container';

export interface IFavoritesStore {
  toggleFavorite(id: string): void;

  getFavorites$(): Observable<string[]>;
}

export const IFavoritesStoreKey = depKey<IFavoritesStore>('IFavoritesStore');
