import { Observable } from 'rxjs';
import { accessor } from '@lib/di/utils.ts';

export interface IFavoriteController {
  toggleFavorite(id: string): void;

  getFavorites$(): Observable<string[]>;
}

export const IFavoriteControllerKey = accessor<IFavoriteController>('IFavoriteController');
