import { Observable } from 'rxjs';
import { Accessor } from '@lib/di/utils.ts';

export interface IFavoritesService {
  toggleFavorite(id: string): void;

  getFavorites$(): Observable<string[]>;
}

export const IFavoritesServiceKey = new Accessor<IFavoritesService>('IFavoritesService');
