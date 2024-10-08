import { Observable } from 'rxjs';
import { IFavoriteController, IFavoriteControllerKey } from './IFavoriteController.ts';
import { inject, register, scope } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { type IFavoritesService, IFavoritesServiceKey } from '@services/favourites/IFavoritesService.public.ts';
import { action } from '@framework/controller/metadata.ts';
import { IResource } from '@services/user/IResource.ts';
import { permission } from '@operations/permissions/CheckPermissionGuard.ts';

@register(IFavoriteControllerKey.register, scope(Scope.page))
export class FavoriteController implements IResource, IFavoriteController {
  resource = 'favorite';

  constructor(@inject(IFavoritesServiceKey.resolve) private favoritesService: IFavoritesService) {}

  getFavorites$(): Observable<string[]> {
    return this.favoritesService.getFavorites$();
  }

  @action
  @permission('write')
  toggleFavorite(id: string): void {
    this.favoritesService.toggleFavorite(id);
  }
}
