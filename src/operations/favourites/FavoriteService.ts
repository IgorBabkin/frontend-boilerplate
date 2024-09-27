import { IFavoriteServiceKey } from './IFavoriteService.ts';
import { IContainer } from 'ts-ioc-container';
import { IFavoritesStoreKey } from '@services/favourites/IFavoritesService.public.ts';

export const FavoriteService = IFavoriteServiceKey.register((s: IContainer) => {
  const favoritesStore = IFavoritesStoreKey.resolve(s);
  return {
    resource: 'favorite',
    permissions: {
      toggleFavorite: 'write',
    },
    toggleFavorite: (id: string) => favoritesStore.toggleFavorite(id),
    getFavorites$: () => favoritesStore.getFavorites$(),
  };
});
