import { Observable } from 'rxjs';
import { Accessor } from '@lib/di/utils.ts';

export interface IFavoriteController {
  toggleFavorite(id: string): void;

  getFavorites$(): Observable<string[]>;
}

export const IFavoriteControllerKey = new Accessor<IFavoriteController>('IFavoriteController');
