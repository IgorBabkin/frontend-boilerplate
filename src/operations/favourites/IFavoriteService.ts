import { Observable } from 'rxjs';
import { depKey } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { IResource } from '@services/user/IResource.ts';

export interface IFavoriteService {
  toggleFavorite(id: string): void;

  getFavorites$(): Observable<string[]>;
}

export const IFavoriteServiceKey = depKey<IFavoriteService & IResource>('IFavoriteService').when(Scope.page);
