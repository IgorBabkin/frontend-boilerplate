import { Observable } from 'rxjs';
import { accessor } from '@lib/di/utils.ts';

export interface IFavoritesService {
  toggleFavorite(id: string): void;

  getFavorites$(): Observable<string[]>;
}

export const IFavoritesServiceKey = accessor<IFavoritesService>('IFavoritesService');
