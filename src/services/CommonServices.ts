import { IContainer, IContainerModule, Registration as R, singleton } from 'ts-ioc-container';
import { TodoRepo } from '@services/todo/TodoRepo.ts';
import { ProfileRepo } from '@services/user/ProfileRepo.ts';
import { TodoStore } from '@services/todo/TodoStore.ts';
import { UserService } from '@services/user/UserService.ts';
import { FavoritesService } from '@services/favourites/FavoritesService.ts';
import { NotificationStore } from '@services/notifications/NotificationStore.ts';
import { ErrorService } from '@framework/errors/ErrorService.ts';
import { AuthStore } from '@services/auth/AuthStore.ts';
import { AuthProvider } from '@services/auth/AuthProvider.ts';
import { AuthClient, IAuthClientKey } from '@services/auth/AuthClient.ts';
import { hasTags } from '@framework/scope.ts';
import { TabsChannel } from '@services/tabs/ITabsChannel.ts';
import { DialogManager } from '@services/dialog/IDialogManager.ts';
import { AlertService } from '@services/alert/IAlertService.ts';

export class CommonServices implements IContainerModule {
  applyTo(container: IContainer): void {
    container
      // User
      .add(R.fromClass(ProfileRepo))
      .add(R.fromClass(UserService))

      // Todos
      .add(R.fromClass(TodoRepo))
      .add(R.fromClass(TodoStore))

      // Favorites
      .add(R.fromClass(FavoritesService))
      .add(R.fromClass(NotificationStore))

      // Errors
      .add(R.fromClass(ErrorService))

      // MultiTabs
      .add(R.fromClass(TabsChannel))

      // Dialogs
      .add(R.fromClass(DialogManager))

      // Alerts
      .add(R.fromClass(AlertService))

      // Auth
      .add(R.fromClass(AuthStore))
      .add(R.fromClass(AuthProvider))
      .add(R.fromClass(AuthClient).to(IAuthClientKey.key).pipe(singleton()).when(hasTags.every('application')));
  }
}
