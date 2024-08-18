import { IContainer, IContainerModule, Registration as R, singleton } from 'ts-ioc-container';
import { TodoRepo } from '@services/todo/TodoRepo.ts';
import { ProfileRepo } from '@services/user/ProfileRepo.ts';
import { TodoService } from '@services/todo/TodoService.ts';
import { UserService } from '@services/user/UserService.ts';
import { FavoritesService } from '@services/favourites/FavoritesService.ts';
import { NotificationService } from '@services/notifications/NotificationService.ts';
import { ErrorService } from '@framework/errors/ErrorService.ts';
import { AuthService } from '@services/auth/AuthService.ts';
import { AuthProvider } from '@services/auth/AuthProvider.ts';
import { AuthClient, IAuthClientKey } from '@services/auth/AuthClient.ts';
import { hasTags } from '@framework/scope.ts';

export class CommonServices implements IContainerModule {
  applyTo(container: IContainer): void {
    container
      // User
      .add(R.fromClass(ProfileRepo))
      .add(R.fromClass(UserService))

      // Todos
      .add(R.fromClass(TodoRepo))
      .add(R.fromClass(TodoService))

      // Favorites
      .add(R.fromClass(FavoritesService))
      .add(R.fromClass(NotificationService))

      // Errors
      .add(R.fromClass(ErrorService))

      // Auth
      .add(R.fromClass(AuthService))
      .add(R.fromClass(AuthProvider))
      .add(R.fromClass(AuthClient).to(IAuthClientKey.key).pipe(singleton()).when(hasTags.every('application')));
  }
}
